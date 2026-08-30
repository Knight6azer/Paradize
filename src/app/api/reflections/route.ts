import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { reflections, books } from "@/lib/db/schema";
import { eq, desc, and, type SQL } from "drizzle-orm";

/**
 * GET /api/reflections?userId=...&bookId=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const db = getDb();
    const conditions: SQL[] = [eq(reflections.userId, userId)];
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
 * Body: { userId, content, bookId?, mood?, isPrivate? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, content, bookId, mood, isPrivate = true } = body;

    if (!userId || !content) {
      return NextResponse.json({ error: "userId and content are required" }, { status: 400 });
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: "Reflection must be at least 10 characters" },
        { status: 400 }
      );
    }

    const db = getDb();

    const result = await db
      .insert(reflections)
      .values({
        userId,
        content,
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
