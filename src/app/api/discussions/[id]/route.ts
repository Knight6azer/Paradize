import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { discussions, discussionReplies, users } from "@/lib/db/schema";
import { eq, asc, sql } from "drizzle-orm";

/**
 * GET /api/discussions/[id] — Get discussion with replies
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    // Get discussion
    const discussionResult = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        content: discussions.content,
        discussionType: discussions.discussionType,
        upvotes: discussions.upvotes,
        replyCount: discussions.replyCount,
        qualityScore: discussions.qualityScore,
        isPinned: discussions.isPinned,
        isLocked: discussions.isLocked,
        createdAt: discussions.createdAt,
        authorName: users.displayName,
        authorUsername: users.username,
        authorImage: users.avatarUrl,
        authorReputation: users.reputationLevel,
      })
      .from(discussions)
      .innerJoin(users, eq(discussions.authorId, users.id))
      .where(eq(discussions.id, id))
      .limit(1);

    if (discussionResult.length === 0) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    // Get replies
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

    return NextResponse.json({
      discussion: discussionResult[0],
      replies,
    });
  } catch (error) {
    console.error("Discussion fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch discussion" }, { status: 500 });
  }
}

/**
 * PATCH /api/discussions/[id] — Upvote a discussion
 * Body: { action: "upvote" }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    if (body.action === "upvote") {
      await db
        .update(discussions)
        .set({ upvotes: sql`${discussions.upvotes} + 1` })
        .where(eq(discussions.id, id));

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Discussion update error:", error);
    return NextResponse.json({ error: "Failed to update discussion" }, { status: 500 });
  }
}
