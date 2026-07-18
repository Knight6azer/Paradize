import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/lib/ai";

/**
 * POST /api/ai/recommend
 *
 * Get AI-powered book recommendations using Gemini.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { genres = [], recentBooks = [], goals = [] } = body;

    if (genres.length === 0 && recentBooks.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least genres or recent books" },
        { status: 400 }
      );
    }

    const prompt = `You are Paradize's book recommendation engine. Based on this reader profile, suggest 5 books.

Genres: ${genres.join(", ") || "not specified"}
Recently read: ${recentBooks.join(", ") || "not specified"}
Goals: ${goals.join(", ") || "personal growth"}

For each book provide:
1. Title and Author
2. A 2-sentence reason why this fits their growth journey
3. A thought-provoking question the book addresses

Include at least one book outside their comfort zone.
Respond ONLY in valid JSON array format: [{ "title": "", "author": "", "reason": "", "question": "", "genre": "" }]`;

    const response = await askGemini(
      prompt,
      "You are a wise, inclusive librarian who believes every reader's journey is unique."
    );

    // Try to parse AI response as JSON
    try {
      const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
      const recommendations = JSON.parse(cleaned);
      return NextResponse.json({ recommendations });
    } catch {
      // If parsing fails, return raw text
      return NextResponse.json({
        recommendations: [],
        rawResponse: response,
      });
    }
  } catch (error) {
    console.error("AI recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
