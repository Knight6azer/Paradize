import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { readingGroups, groupMembers, users, books, discussions } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";

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
        createdBy: readingGroups.createdBy,
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
 * Strictly uses authenticated session. Enforces group capacity (max 20 readers).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    // Check if group exists and verify capacity
    const targetGroup = await db
      .select({
        id: readingGroups.id,
        memberCount: readingGroups.memberCount,
        maxMembers: readingGroups.maxMembers,
        isPublic: readingGroups.isPublic,
      })
      .from(readingGroups)
      .where(eq(readingGroups.id, id))
      .limit(1);

    if (targetGroup.length === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const group = targetGroup[0];
    const maxMembers = group.maxMembers || 20;

    // Check if already a member
    const existingMember = await db
      .select({ id: groupMembers.id })
      .from(groupMembers)
      .where(and(eq(groupMembers.groupId, id), eq(groupMembers.userId, session.user.id)))
      .limit(1);

    if (existingMember.length > 0) {
      return NextResponse.json({ error: "You are already a member of this reading group" }, { status: 400 });
    }

    if ((group.memberCount || 0) >= maxMembers) {
      return NextResponse.json(
        { error: `This group has reached its maximum capacity of ${maxMembers} readers to preserve intimacy.` },
        { status: 400 }
      );
    }

    await db.insert(groupMembers).values({
      groupId: id,
      userId: session.user.id,
      role: "member",
    });

    // Increment member count
    await db
      .update(readingGroups)
      .set({ memberCount: sql`${readingGroups.memberCount} + 1` })
      .where(eq(readingGroups.id, id));

    return NextResponse.json({ success: true, message: "Joined group successfully" }, { status: 201 });
  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json({ error: "Failed to join group" }, { status: 500 });
  }
}

/**
 * DELETE /api/groups/[id] — Leave a group
 * Strictly uses authenticated session.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    // Verify membership exists
    const membership = await db
      .select({ id: groupMembers.id, role: groupMembers.role })
      .from(groupMembers)
      .where(and(eq(groupMembers.groupId, id), eq(groupMembers.userId, session.user.id)))
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: "You are not a member of this group" }, { status: 404 });
    }

    await db
      .delete(groupMembers)
      .where(and(eq(groupMembers.groupId, id), eq(groupMembers.userId, session.user.id)));

    await db
      .update(readingGroups)
      .set({ memberCount: sql`GREATEST(0, ${readingGroups.memberCount} - 1)` })
      .where(eq(readingGroups.id, id));

    return NextResponse.json({ success: true, message: "Left group successfully" });
  } catch (error) {
    console.error("Leave group error:", error);
    return NextResponse.json({ error: "Failed to leave group" }, { status: 500 });
  }
}
