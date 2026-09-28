import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { reflections, books } from "@/lib/db/schema";
import { eq, desc, and, type SQL } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import DOMPurify from "isomorphic-dompurify";

/**
 * GET /api/reflections?bookId=...
 * User ID is extracted from the server-side session — users can only see their own reflections.
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication server-side
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    const db = getDb();
    const conditions: SQL[] = [eq(reflections.userId, session.user.id)];
    if (bookId) conditions.push(eq(reflections.bookId, bookId));

    const result = await db
      .select({
        id: reflections.id,
        content: reflections.content,
        mood: reflections.mood,
        isPrivate: reflections.isPrivate,
        growthTags: reflections.growthTags,
        createdAt: reflections.createdAt,
        bookId: books.id,
        bookTitle: books.title,
        bookCover: books.coverUrl,
      })
      .from(reflections)
      .leftJoin(books, eq(reflections.bookId, books.id))
      .where(and(...conditions))
      .orderBy(desc(reflections.createdAt))
      .limit(50);

    return NextResponse.json({ reflections: result });
  } catch (error) {
    console.error("Reflections fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch reflections" }, { status: 500 });
  }
}

/**
 * POST /api/reflections — Create a reflection
 * Body: { content, bookId?, mood?, isPrivate? }
 * User ID is extracted from the server-side session.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication server-side
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { content, bookId, mood, isPrivate = true } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: "Reflection must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Sanitize user-generated content
    const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });

    const db = getDb();

    const result = await db
      .insert(reflections)
      .values({
        userId: session.user.id, // Use session user ID, never client-provided
        content: sanitizedContent,
        bookId: bookId || null,
        mood: mood || null,
        isPrivate,
      })
      .returning();

    return NextResponse.json({ reflection: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Create reflection error:", error);
    return NextResponse.json({ error: "Failed to create reflection" }, { status: 500 });
  }
}
