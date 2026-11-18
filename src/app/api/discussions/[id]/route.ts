import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { discussions, discussionReplies, users } from "@/lib/db/schema";
import { eq, asc, sql, and } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

const updateDiscussionSchema = z.object({
  action: z.enum(["upvote", "edit"]).optional(),
  title: z.string().min(5, "Title must be at least 5 characters").max(200).optional(),
  content: z.string().min(20, "Content must be at least 20 characters").max(10000).optional(),
});

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
        authorId: discussions.authorId,
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
        authorId: discussionReplies.authorId,
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
 * PATCH /api/discussions/[id] — Upvote or Edit discussion
 * Upvoting requires an active session. Editing requires discussion authorship.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = updateDiscussionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify discussion exists
    const existing = await db
      .select({ id: discussions.id, authorId: discussions.authorId, isLocked: discussions.isLocked })
      .from(discussions)
      .where(eq(discussions.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    // Action 1: Upvote
    if (parsed.data.action === "upvote" || (!parsed.data.title && !parsed.data.content)) {
      await db
        .update(discussions)
        .set({ upvotes: sql`${discussions.upvotes} + 1` })
        .where(eq(discussions.id, id));

      return NextResponse.json({ success: true, message: "Upvote recorded" });
    }

    // Action 2: Edit discussion content (author only)
    if (existing[0].authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only edit your own discussions" },
        { status: 403 }
      );
    }

    if (existing[0].isLocked) {
      return NextResponse.json(
        { error: "This discussion is locked and cannot be edited" },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.title) {
      updateData.title = DOMPurify.sanitize(parsed.data.title, { ALLOWED_TAGS: [] });
    }
    if (parsed.data.content) {
      updateData.content = DOMPurify.sanitize(parsed.data.content, { ALLOWED_TAGS: [] });
    }

    const updated = await db
      .update(discussions)
      .set(updateData)
      .where(and(eq(discussions.id, id), eq(discussions.authorId, session.user.id)))
      .returning();

    return NextResponse.json({ discussion: updated[0] });
  } catch (error) {
    console.error("Discussion update error:", error);
    return NextResponse.json({ error: "Failed to update discussion" }, { status: 500 });
  }
}

/**
 * DELETE /api/discussions/[id] — Delete discussion
 * Author only.
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

    const existing = await db
      .select({ id: discussions.id, authorId: discussions.authorId })
      .from(discussions)
      .where(eq(discussions.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    if (existing[0].authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own discussions" },
        { status: 403 }
      );
    }

    await db
      .delete(discussions)
      .where(and(eq(discussions.id, id), eq(discussions.authorId, session.user.id)));

    return NextResponse.json({ success: true, message: "Discussion deleted" });
  } catch (error) {
    console.error("Delete discussion error:", error);
    return NextResponse.json({ error: "Failed to delete discussion" }, { status: 500 });
  }
}
