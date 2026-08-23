import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/users/onboarding — Save onboarding quiz answers
 * Body: { userId, favoriteGenres, booksPerMonth, readingStyle, biggestChallenge, growthGoal? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, favoriteGenres, booksPerMonth, readingStyle, biggestChallenge, growthGoal } = body;

    if (!userId || !favoriteGenres) {
      return NextResponse.json({ error: "userId and favoriteGenres are required" }, { status: 400 });
    }

    const db = getDb();

    const readingPreferences = {
      genres: favoriteGenres,
      booksPerMonth,
      readingStyle,
      biggestChallenge,
      growthGoal: growthGoal || "",
    };

    const result = await db
      .update(users)
      .set({
        readingPreferences,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({ user: result[0] });
  } catch (error) {
    console.error("Onboarding save error:", error);
    return NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 });
  }
}
