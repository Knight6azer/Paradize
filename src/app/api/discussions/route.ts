import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { discussions, users, books, readingGroups } from "@/lib/db/schema";
import { eq, desc, and, type SQL } from "drizzle-orm";

/**
 * GET /api/discussions?type=...&bookId=...&groupId=...&limit=...&offset=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const bookId = searchParams.get("bookId");
    const groupId = searchParams.get("groupId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    const db = getDb();
    const conditions: SQL[] = [];

    if (type) conditions.push(eq(discussions.discussionType, type as typeof discussions.discussionType.enumValues[number]));
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
 * Body: { authorId, title, content, discussionType, bookId?, groupId? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorId, title, content, discussionType = "insight", bookId, groupId } = body;

    if (!authorId || !title || !content) {
      return NextResponse.json(
        { error: "authorId, title, and content are required" },
        { status: 400 }
      );
    }

    if (title.length < 5 || content.length < 20) {
      return NextResponse.json(
        { error: "Title must be 5+ characters and content 20+ characters" },
        { status: 400 }
      );
    }

    const db = getDb();

    const result = await db
      .insert(discussions)
      .values({
        authorId,
        title,
        content,
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
