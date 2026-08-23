import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users, userBooks, discussions, reflections, achievements } from "@/lib/db/schema";
import { eq, sql, count } from "drizzle-orm";

/**
 * GET /api/users/[username] — Public profile data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const db = getDb();

    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        displayName: users.displayName,
        bio: users.bio,
        avatarUrl: users.avatarUrl,
        city: users.city,
        reputationPoints: users.reputationPoints,
        reputationLevel: users.reputationLevel,
        growthScore: users.growthScore,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult[0];

    // Get stats
    const booksRead = await db
      .select({ count: count() })
      .from(userBooks)
      .where(eq(userBooks.userId, user.id));

    const discussionCount = await db
      .select({ count: count() })
      .from(discussions)
      .where(eq(discussions.authorId, user.id));

    const reflectionCount = await db
      .select({ count: count() })
      .from(reflections)
      .where(eq(reflections.userId, user.id));

    const userAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, user.id));

    return NextResponse.json({
      user,
      stats: {
        booksOnShelf: booksRead[0]?.count || 0,
        discussions: discussionCount[0]?.count || 0,
        reflections: reflectionCount[0]?.count || 0,
      },
      achievements: userAchievements,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

/**
 * PATCH /api/users/[username] — Update own profile
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const body = await request.json();
    const { displayName, bio, city, readingPreferences } = body;

    const db = getDb();
    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (displayName) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (city) updateData.city = city;
    if (readingPreferences) updateData.readingPreferences = readingPreferences;

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.username, username))
      .returning();

    return NextResponse.json({ user: result[0] });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
