import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { discussions, users, books, readingGroups } from "@/lib/db/schema";
import { eq, desc, and, type SQL } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import DOMPurify from "isomorphic-dompurify";
import { createDiscussionSchema } from "@/lib/validation/schemas";

/**
 * GET /api/discussions?type=...&bookId=...&groupId=...&limit=...&offset=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const bookId = searchParams.get("bookId");
    const groupId = searchParams.get("groupId");
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20") || 20, 1), 50);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0") || 0, 0);

    const db = getDb();
    const conditions: SQL[] = [];

    const validTypes = ["question", "insight", "debate", "reflection", "review"];
    if (type && validTypes.includes(type)) {
      conditions.push(eq(discussions.discussionType, type as typeof discussions.discussionType.enumValues[number]));
    }
    if (bookId) conditions.push(eq(discussions.bookId, bookId));
    if (groupId) conditions.push(eq(discussions.groupId, groupId));

    const result = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        content: discussions.content,
        discussionType: discussions.discussionType,
        upvotes: discussions.upvotes,
        replyCount: discussions.replyCount,
        qualityScore: discussions.qualityScore,
        isPinned: discussions.isPinned,
        createdAt: discussions.createdAt,
        authorId: users.id,
        authorName: users.displayName,
        authorUsername: users.username,
        authorImage: users.avatarUrl,
        bookId: books.id,
        bookTitle: books.title,
        groupId: readingGroups.id,
        groupName: readingGroups.name,
      })
      .from(discussions)
      .innerJoin(users, eq(discussions.authorId, users.id))
      .leftJoin(books, eq(discussions.bookId, books.id))
      .leftJoin(readingGroups, eq(discussions.groupId, readingGroups.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(discussions.isPinned), desc(discussions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ discussions: result });
  } catch (error) {
    console.error("Discussions fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 });
  }
}

/**
 * POST /api/discussions — Create new discussion
 * Body: { title, content, discussionType, bookId?, groupId? }
 * User ID is strictly extracted from the server-side session.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createDiscussionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid discussion data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, content, discussionType, bookId, groupId } = parsed.data;

    // Sanitize user-generated content
    const sanitizedTitle = DOMPurify.sanitize(title, { ALLOWED_TAGS: [] });
    const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });

    const db = getDb();

    const result = await db
      .insert(discussions)
      .values({
        authorId: session.user.id,
        title: sanitizedTitle,
        content: sanitizedContent,
        discussionType: discussionType as typeof discussions.discussionType.enumValues[number],
        bookId: bookId || null,
        groupId: groupId || null,
      })
      .returning();

    return NextResponse.json({ discussion: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Create discussion error:", error);
    return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 });
  }
}
