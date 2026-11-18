import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users, userBooks, discussions, reflections, achievements, books } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import DOMPurify from "isomorphic-dompurify";
import { updateProfileSchema } from "@/lib/validation/schemas";

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
        readingPreferences: users.readingPreferences,
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

    // Get recent books on shelf
    const recentBooks = await db
      .select({
        id: userBooks.id,
        bookId: books.id,
        title: books.title,
        authors: books.authors,
        coverUrl: books.coverUrl,
      })
      .from(userBooks)
      .innerJoin(books, eq(userBooks.bookId, books.id))
      .where(eq(userBooks.userId, user.id))
      .limit(4);

    // Get recent discussions
    const recentDiscussions = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        createdAt: discussions.createdAt,
        upvotes: discussions.upvotes,
      })
      .from(discussions)
      .where(eq(discussions.authorId, user.id))
      .orderBy(desc(discussions.createdAt))
      .limit(3);

    return NextResponse.json({
      user,
      stats: {
        booksOnShelf: booksRead[0]?.count || 0,
        booksRead: booksRead[0]?.count || 0,
        discussions: discussionCount[0]?.count || 0,
        reflections: reflectionCount[0]?.count || 0,
        reputation: user.reputationPoints || 0,
        streak: 1,
      },
      recentBooks,
      recentDiscussions,
      achievements: userAchievements,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

/**
 * PATCH /api/users/[username] — Update own profile
 * Strictly verifies the authenticated session matches the target user account.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { username } = await params;
    const body = await request.json();

    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid profile data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify user exists
    const targetUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (targetUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Authorization check: User can only update their own profile
    if (targetUser[0].id !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You cannot modify another user's profile" },
        { status: 403 }
      );
    }

    const { displayName, bio, city, readingPreferences } = parsed.data;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (displayName) {
      updateData.displayName = DOMPurify.sanitize(displayName, { ALLOWED_TAGS: [] });
    }
    if (bio !== undefined) {
      updateData.bio = DOMPurify.sanitize(bio, { ALLOWED_TAGS: [] });
    }
    if (city) {
      updateData.city = DOMPurify.sanitize(city, { ALLOWED_TAGS: [] });
    }
    if (readingPreferences) {
      updateData.readingPreferences = readingPreferences;
    }

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning();

    return NextResponse.json({ user: result[0] });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
