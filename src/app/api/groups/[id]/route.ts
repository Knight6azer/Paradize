import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { readingGroups, groupMembers, users, books, discussions } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

/**
 * GET /api/groups/[id] — Get group details with members
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const groupResult = await db
      .select({
        id: readingGroups.id,
        name: readingGroups.name,
        description: readingGroups.description,
        memberCount: readingGroups.memberCount,
        maxMembers: readingGroups.maxMembers,
        genreFocus: readingGroups.genreFocus,
        isPublic: readingGroups.isPublic,
        healthScore: readingGroups.healthScore,
        city: readingGroups.city,
        createdAt: readingGroups.createdAt,
        currentBookId: books.id,
        currentBookTitle: books.title,
        currentBookCover: books.coverUrl,
        currentBookAuthors: books.authors,
      })
      .from(readingGroups)
      .leftJoin(books, eq(readingGroups.currentBookId, books.id))
      .where(eq(readingGroups.id, id))
      .limit(1);

    if (groupResult.length === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Get members
    const members = await db
      .select({
        userId: users.id,
        name: users.displayName,
        username: users.username,
        image: users.avatarUrl,
        role: groupMembers.role,
        joinedAt: groupMembers.joinedAt,
      })
      .from(groupMembers)
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .where(eq(groupMembers.groupId, id));

    // Get recent discussions
    const groupDiscussions = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        discussionType: discussions.discussionType,
        replyCount: discussions.replyCount,
        createdAt: discussions.createdAt,
        authorName: users.displayName,
      })
      .from(discussions)
      .innerJoin(users, eq(discussions.authorId, users.id))
      .where(eq(discussions.groupId, id))
      .orderBy(desc(discussions.createdAt))
      .limit(10);

    return NextResponse.json({
      group: groupResult[0],
      members,
      discussions: groupDiscussions,
    });
  } catch (error) {
    console.error("Group fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}

/**
 * POST /api/groups/[id] — Join a group
 * Body: { userId }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const db = getDb();

    await db.insert(groupMembers).values({
      groupId: id,
      userId,
      role: "member",
    });

    // Increment member count
    await db
      .update(readingGroups)
      .set({ memberCount: sql`${readingGroups.memberCount} + 1` })
      .where(eq(readingGroups.id, id));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json({ error: "Failed to join group" }, { status: 500 });
  }
}

/**
 * DELETE /api/groups/[id] — Leave a group
 * Body: { userId }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const db = getDb();

    await db
      .delete(groupMembers)
      .where(and(eq(groupMembers.groupId, id), eq(groupMembers.userId, userId)));

    await db
      .update(readingGroups)
      .set({ memberCount: sql`${readingGroups.memberCount} - 1` })
      .where(eq(readingGroups.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave group error:", error);
    return NextResponse.json({ error: "Failed to leave group" }, { status: 500 });
  }
}
