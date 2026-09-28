import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";

/**
 * POST /api/users/onboarding — Save onboarding quiz answers
 * Body: { favoriteGenres, booksPerMonth, readingStyle, biggestChallenge, growthGoal? }
 * User ID is extracted from the server-side session.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication server-side
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { favoriteGenres, booksPerMonth, readingStyle, biggestChallenge, growthGoal } = body;

    if (!favoriteGenres || !Array.isArray(favoriteGenres) || favoriteGenres.length === 0) {
      return NextResponse.json({ error: "favoriteGenres is required" }, { status: 400 });
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
      .where(eq(users.id, session.user.id)) // Use session user ID
      .returning();

    return NextResponse.json({ user: result[0] });
  } catch (error) {
    console.error("Onboarding save error:", error);
    return NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 });
  }
}
