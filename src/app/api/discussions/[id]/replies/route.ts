import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { discussionReplies, discussions, users } from "@/lib/db/schema";
import { eq, asc, sql } from "drizzle-orm";

/**
 * GET /api/discussions/[id]/replies — Get all replies for a discussion
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const replies = await db
      .select({
        id: discussionReplies.id,
        content: discussionReplies.content,
        upvotes: discussionReplies.upvotes,
        isEvidenceBased: discussionReplies.isEvidenceBased,
        parentReplyId: discussionReplies.parentReplyId,
        createdAt: discussionReplies.createdAt,
        authorName: users.displayName,
        authorUsername: users.username,
        authorImage: users.avatarUrl,
      })
      .from(discussionReplies)
      .innerJoin(users, eq(discussionReplies.authorId, users.id))
      .where(eq(discussionReplies.discussionId, id))
      .orderBy(asc(discussionReplies.createdAt));

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Replies fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 });
  }
}

/**
 * POST /api/discussions/[id]/replies — Create a reply
 * Body: { authorId, content, parentReplyId? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { authorId, content, parentReplyId } = body;

    if (!authorId || !content) {
      return NextResponse.json(
        { error: "authorId and content are required" },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: "Reply must be at least 10 characters" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Create the reply
    const result = await db
      .insert(discussionReplies)
      .values({
        discussionId: id,
        authorId,
        content,
        parentReplyId: parentReplyId || null,
      })
      .returning();

    // Increment the reply count on the discussion
    await db
      .update(discussions)
      .set({ replyCount: sql`${discussions.replyCount} + 1` })
      .where(eq(discussions.id, id));

    return NextResponse.json({ reply: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Create reply error:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}
