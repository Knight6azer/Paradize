import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { discussionReplies, discussions, users } from "@/lib/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

const createReplyInputSchema = z.object({
  content: z
    .string()
    .min(10, "Please write at least 10 characters for a meaningful reply")
    .max(5000, "Reply is too long (max 5,000 characters)")
    .trim(),
  parentReplyId: z.string().uuid().optional().nullable(),
});

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
 * Body: { content, parentReplyId? }
 * Strictly extracts author identity from the verified server-side session.
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
    const body = await request.json();

    const parsed = createReplyInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid reply", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify parent discussion exists and is not locked
    const disc = await db
      .select({ id: discussions.id, isLocked: discussions.isLocked })
      .from(discussions)
      .where(eq(discussions.id, id))
      .limit(1);

    if (disc.length === 0) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    if (disc[0].isLocked) {
      return NextResponse.json(
        { error: "This discussion is locked and cannot receive new replies" },
        { status: 403 }
      );
    }

    // Sanitize user-generated content
    const sanitizedContent = DOMPurify.sanitize(parsed.data.content, { ALLOWED_TAGS: [] });

    // Create the reply with verified session user ID (never trust client authorId)
    const result = await db
      .insert(discussionReplies)
      .values({
        discussionId: id,
        authorId: session.user.id,
        content: sanitizedContent,
        parentReplyId: parsed.data.parentReplyId || null,
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
