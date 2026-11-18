import { NextRequest, NextResponse } from "next/server";
import { getBookRecommendations } from "@/lib/ai";
import { z } from "zod";

const recommendInputSchema = z.object({
  genres: z.array(z.string().max(50)).max(5).default([]),
  recentBooks: z.array(z.string().max(100)).max(5).default([]),
  goals: z.array(z.string().max(200)).max(3).default([]),
});

/**
 * POST /api/ai/recommend
 * Returns AI-generated or curated book recommendations based on user goals.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = recommendInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid recommendation request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { genres, recentBooks, goals } = parsed.data;

    const recommendations = await getBookRecommendations({
      genres,
      recentBooks,
      readingGoals: goals,
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("AI recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
