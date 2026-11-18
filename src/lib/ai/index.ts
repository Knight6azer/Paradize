/**
 * Paradize AI Service — Hybrid Strategy
 *
 * Model 1: Gemini 2.0 Flash (Google AI) — Free tier
 *   - Book recommendations
 *   - Discussion summaries
 *   - Reflection prompts
 *   - Achievement verification
 *   - Quality scoring
 *
 * Model 2: HuggingFace Inference API — Free tier
 *   - Toxicity detection (detoxify / toxic-bert)
 */

/* ─── Gemini Service ───────────────────────────────── */
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export async function askGemini(
  prompt: string,
  systemInstruction?: string,
  timeoutMs: number = 8000
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "[AI unavailable — API key not configured]";
  }

  try {
    const body: Record<string, unknown> = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.95,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) {
      console.warn("Gemini API returned error status:", response.status);
      return "[AI temporarily unavailable]";
    }

    const data: GeminiResponse = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "[No response]";
  } catch (error) {
    console.warn("Gemini request timed out or failed:", error instanceof Error ? error.message : "unknown error");
    return "[AI temporarily unavailable]";
  }
}

/**
 * Robust JSON extraction from LLM output
 */
export function extractJsonFromResponse<T>(response: string, fallback: T): T {
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/) || response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

/* ─── Curated Fallback Recommendations ─────────────── */
export interface RecommendationItem {
  title: string;
  author: string;
  reason: string;
  question: string;
  genre?: string;
}

const CURATED_GROWTH_BOOKS: RecommendationItem[] = [
  {
    title: "Meditations",
    author: "Marcus Aurelius",
    reason: "A foundational text on self-mastery, clarity, and navigating adversity with emotional equanimity.",
    question: "What aspects of your life are currently within your control, and what are you futilely struggling against?",
    genre: "Philosophy"
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    reason: "Illuminates the cognitive biases and dual thinking systems that govern human judgment and choices.",
    question: "When did your intuitive instincts last mislead you in a high-stakes decision?",
    genre: "Psychology"
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    reason: "Examines how shared myths, cultures, and cooperative fictions shaped the trajectory of civilization.",
    question: "Which unspoken cultural stories or assumptions hold the greatest invisible sway over your everyday actions?",
    genre: "History"
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    reason: "A profound reflection on human dignity, resilience, and identifying enduring purpose amid suffering.",
    question: "What fundamental responsibility or commitment gives meaning to your present challenges?",
    genre: "Philosophy"
  },
  {
    title: "The Courage to Be Disliked",
    author: "Ichiro Kishimi & Fumitake Koga",
    reason: "Explores Adlerian psychology and how liberating yourself from others' expectations enables authentic living.",
    question: "Are your daily goals chosen for your own growth, or designed to earn praise from observers?",
    genre: "Psychology"
  }
];

/* ─── Book Recommendations ─────────────────────────── */
export async function getBookRecommendations(
  userPreferences: {
    genres: string[];
    recentBooks: string[];
    readingGoals: string[];
  },
  count: number = 5
): Promise<RecommendationItem[]> {
  const prompt = `You are Paradize's book recommendation engine. Based on the following reader profile, suggest ${count} books that would promote their intellectual growth and expand their perspectives.

Reader Profile:
- Favorite genres: ${userPreferences.genres.join(", ") || "Diverse"}
- Recently read: ${userPreferences.recentBooks.join(", ") || "Various"}
- Reading goals: ${userPreferences.readingGoals.join(", ") || "Intellectual growth and deeper perspective"}

For each book, provide:
1. Title and Author
2. A 2-sentence reason why this fits their growth journey
3. A thought-provoking question the book helps answer
4. Primary genre

Focus on books that challenge assumptions, build empathy, and encourage critical thinking.
Respond ONLY in valid JSON array format:
[{"title": "...", "author": "...", "reason": "...", "question": "...", "genre": "..."}]`;

  const response = await askGemini(
    prompt,
    "You are a wise librarian who believes in the transformative power of reading. Return strictly valid JSON."
  );

  const result = extractJsonFromResponse<RecommendationItem[]>(response, []);
  if (result.length > 0) {
    return result.slice(0, count);
  }

  // Graceful fallback to curated titles
  return CURATED_GROWTH_BOOKS.slice(0, count);
}

/* ─── Discussion Quality Scoring ───────────────────── */
export async function scoreDiscussionQuality(
  content: string,
  discussionType: string
): Promise<{ score: number; feedback: string }> {
  const prompt = `Rate the quality of this ${discussionType} on a scale of 0-10.

Content: "${content}"

Evaluate based on:
1. Depth of thought (not surface-level)
2. Evidence or reasoning provided
3. Originality of perspective
4. Respect for differing viewpoints
5. Contribution to understanding

Respond strictly in JSON: {"score": <0-10>, "feedback": "<one constructive sentence>"}`;

  const response = await askGemini(prompt);
  return extractJsonFromResponse(response, {
    score: 7,
    feedback: "Thank you for contributing your perspective to the community.",
  });
}

/* ─── Reflection Prompts ───────────────────────────── */
const CURATED_REFLECTION_PROMPTS = [
  "What is one idea you encountered recently that made you uncomfortable or changed how you see a familiar situation?",
  "Reflect on a belief you used to hold strongly. What evidence or reading caused that perspective to evolve?",
  "How has the central theme of your current book mirrored a real challenge in your personal or professional life?",
  "If the author of your favorite book asked you what lesson you are actually practicing, what would you say?"
];

export async function generateReflectionPrompt(
  bookTitle?: string,
  recentMood?: string
): Promise<string> {
  const context = bookTitle
    ? `The reader recently finished "${bookTitle}".`
    : "Generate a reading reflection prompt.";
  const moodContext = recentMood ? ` Their recent mood is "${recentMood}".` : "";

  const prompt = `${context}${moodContext}

Generate one thought-provoking reflection prompt that encourages deep self-examination and personal growth. The prompt should:
- Be open-ended
- Connect reading to real life
- Encourage honesty and vulnerability
- Be suitable for a private journal

Respond with just the prompt text, no quotes or formatting.`;

  const response = await askGemini(
    prompt,
    "You are a gentle, wise mentor who helps readers process their experiences."
  );

  if (response.startsWith("[AI") || !response.trim()) {
    const randomIndex = Math.floor(Math.random() * CURATED_REFLECTION_PROMPTS.length);
    return CURATED_REFLECTION_PROMPTS[randomIndex];
  }

  return response.trim();
}

/* ─── Achievement Verification ─────────────────────── */
export async function verifyReadingAchievement(
  bookTitle: string,
  userInsight: string
): Promise<{ score: number; verified: boolean; feedback: string }> {
  const prompt = `A reader claims to have read "${bookTitle}" and submitted this insight as proof:

"${userInsight}"

Evaluate their insight on a 0-100 scale:
- Does it reference specific concepts from the book?
- Is it original rather than a copy-pasted summary?
- Does it show genuine understanding?
- Does it connect to practical application?

Respond strictly in JSON: {"score": <0-100>, "verified": <true if score >= 70>, "feedback": "<encouraging feedback>"}`;

  const response = await askGemini(prompt);
  return extractJsonFromResponse(response, {
    score: 70,
    verified: true,
    feedback: "Insight accepted. Thank you for demonstrating thoughtful understanding.",
  });
}

/* ─── HuggingFace Toxicity Detection ───────────────── */
interface ToxicityResult {
  label: string;
  score: number;
}

export async function checkToxicity(
  text: string
): Promise<{ toxic: boolean; score: number; categories: ToxicityResult[] }> {
  const token = process.env.HF_API_TOKEN;
  if (!token) {
    return { toxic: false, score: 0, categories: [] };
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/unitary/toxic-bert",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      console.warn("HuggingFace API error:", response.status);
      return { toxic: false, score: 0, categories: [] };
    }

    const data = await response.json();
    const results: ToxicityResult[] = Array.isArray(data[0]) ? data[0] : [];
    const toxicScore = results.find((r) => r.label === "toxic")?.score || 0;

    return {
      toxic: toxicScore > 0.7,
      score: toxicScore,
      categories: results,
    };
  } catch (error) {
    console.warn("Toxicity check failed or timed out:", error);
    return { toxic: false, score: 0, categories: [] };
  }
}

/* ─── Discussion Summary ───────────────────────────── */
export async function summarizeDiscussion(
  title: string,
  replies: string[]
): Promise<string> {
  const prompt = `Summarize this community discussion in 3-4 sentences:

Topic: "${title}"

Key contributions:
${replies.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Capture:
- The main perspectives shared
- Points of agreement and respectful disagreement
- Key insights that emerged

Keep it neutral and balanced.`;

  const response = await askGemini(prompt, "You are a fair and thoughtful discussion moderator.");
  if (response.startsWith("[AI")) {
    return "This discussion explored diverse reader viewpoints and personal reflections.";
  }
  return response.trim();
}
