import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { discussionReplies, discussions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * POST /api/discussions/[id]/replies — Create a reply
 * Body: { authorId, content, parentReplyId? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: discussionId } = await params;
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

    const result = await db
      .insert(discussionReplies)
      .values({
        discussionId,
        authorId,
        content,
        parentReplyId: parentReplyId || null,
      })
      .returning();

    // Increment reply count on the discussion
    await db
      .update(discussions)
      .set({ replyCount: sql`${discussions.replyCount} + 1` })
      .where(eq(discussions.id, discussionId));

    return NextResponse.json({ reply: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Create reply error:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}
