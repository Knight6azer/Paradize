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
 *   - Toxicity detection (detoxify)
 *   - Sentence embeddings (all-MiniLM-L6-v2)
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
  systemInstruction?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️  GEMINI_API_KEY not set. AI features disabled.");
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
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", response.status, error);
      return "[AI temporarily unavailable]";
    }

    const data: GeminiResponse = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "[No response]";
  } catch (error) {
    console.error("Gemini request failed:", error);
    return "[AI temporarily unavailable]";
  }
}

/* ─── Book Recommendations ─────────────────────────── */
export async function getBookRecommendations(
  userPreferences: {
    genres: string[];
    recentBooks: string[];
    readingGoals: string[];
  },
  count: number = 5
): Promise<string> {
  const prompt = `You are Paradize's book recommendation engine. Based on the following reader profile, suggest ${count} books that would promote their intellectual growth and expand their perspectives.

Reader Profile:
- Favorite genres: ${userPreferences.genres.join(", ")}
- Recently read: ${userPreferences.recentBooks.join(", ")}
- Reading goals: ${userPreferences.readingGoals.join(", ")}

For each book, provide:
1. Title and Author
2. Why this book fits their growth journey (2 sentences)
3. A thought-provoking question the book might help them answer

Focus on books that challenge assumptions, build empathy, and encourage critical thinking. Include at least one book outside their comfort zone.

Respond in JSON format: [{ "title": "", "author": "", "reason": "", "question": "" }]`;

  return askGemini(prompt, "You are a wise librarian who believes in the transformative power of reading.");
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

Respond in JSON: { "score": <0-10>, "feedback": "<one sentence of constructive feedback>" }`;

  try {
    const response = await askGemini(prompt);
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { score: 5, feedback: "Quality assessment unavailable." };
  }
}

/* ─── Reflection Prompts ───────────────────────────── */
export async function generateReflectionPrompt(
  bookTitle?: string,
  recentMood?: string
): Promise<string> {
  const context = bookTitle
    ? `The reader recently finished "${bookTitle}".`
    : "Generate a general reading reflection prompt.";
  const moodContext = recentMood ? ` Their recent mood is "${recentMood}".` : "";

  const prompt = `${context}${moodContext}

Generate one thought-provoking reflection prompt that encourages deep self-examination and personal growth. The prompt should:
- Be open-ended
- Connect reading to real life
- Encourage honesty and vulnerability
- Be suitable for a private journal

Respond with just the prompt text, no formatting.`;

  return askGemini(prompt, "You are a gentle, wise mentor who helps readers process their experiences.");
}

/* ─── Achievement Verification ─────────────────────── */
export async function verifyReadingAchievement(
  bookTitle: string,
  userInsight: string
): Promise<{ score: number; verified: boolean; feedback: string }> {
  const prompt = `A reader claims to have read "${bookTitle}" and submitted this insight as proof:

"${userInsight}"

Evaluate their insight on a 0-100 scale:
- Does it reference specific content from the book? (not just plot summary)
- Is it original? (not copy-pasted from reviews)
- Does it show genuine understanding?
- Does it connect to real-life application?

Be generous but honest. The goal is to encourage genuine reflection, not gatekeep.

Respond in JSON: { "score": <0-100>, "verified": <true if score >= 70>, "feedback": "<encouraging feedback>" }`;

  try {
    const response = await askGemini(prompt);
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      score: 50,
      verified: false,
      feedback: "We couldn't verify your insight automatically. It will be reviewed by the community.",
    };
  }
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
    console.error("Toxicity check failed:", error);
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

Keep it neutral and balanced. Do not take sides.`;

  return askGemini(prompt, "You are a fair and thoughtful discussion moderator.");
}
