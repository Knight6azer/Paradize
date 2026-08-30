import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { userBooks, books } from "@/lib/db/schema";
import { eq, and, type SQL } from "drizzle-orm";

/**
 * GET /api/books/shelf?userId=...&status=reading|completed|want_to_read
 * Fetch user's bookshelf with book details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const db = getDb();
    const conditions: SQL[] = [eq(userBooks.userId, userId)];
    if (status) {
      conditions.push(eq(userBooks.status, status as typeof userBooks.status.enumValues[number]));
    }

    const result = await db
      .select({
        id: userBooks.id,
        status: userBooks.status,
        progressPercent: userBooks.progressPercent,
        personalRating: userBooks.personalRating,
        isFavorite: userBooks.isFavorite,
        startedAt: userBooks.startedAt,
        completedAt: userBooks.completedAt,
        bookId: books.id,
        title: books.title,
        subtitle: books.subtitle,
        authors: books.authors,
        coverUrl: books.coverUrl,
        genres: books.genres,
        pageCount: books.pageCount,
        description: books.description,
      })
      .from(userBooks)
      .innerJoin(books, eq(userBooks.bookId, books.id))
      .where(and(...conditions));

    return NextResponse.json({ shelf: result });
  } catch (error) {
    console.error("Shelf fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch shelf" }, { status: 500 });
  }
}

/**
 * POST /api/books/shelf — Add a book to user's shelf
 * Body: { userId, bookData (from Google Books), status }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bookData, status = "want_to_read" } = body;

    if (!userId || !bookData) {
      return NextResponse.json({ error: "userId and bookData are required" }, { status: 400 });
    }

    const db = getDb();

    // Upsert the book first (by ISBN or title+author)
    let bookRecord;
    if (bookData.isbn) {
      const existing = await db
        .select()
        .from(books)
        .where(eq(books.isbn, bookData.isbn))
        .limit(1);
      bookRecord = existing[0];
    }

    if (!bookRecord) {
      const inserted = await db
        .insert(books)
        .values({
          isbn: bookData.isbn || null,
          title: bookData.title,
          subtitle: bookData.subtitle || null,
          authors: bookData.authors || ["Unknown Author"],
          description: bookData.description || null,
          coverUrl: bookData.coverUrl || null,
          genres: bookData.genres || [],
          pageCount: bookData.pageCount || null,
          publishedDate: bookData.publishedDate || null,
          publisher: bookData.publisher || null,
          language: bookData.language || "en",
        })
        .returning();
      bookRecord = inserted[0];
    }

    // Add to user's shelf
    const userBook = await db
      .insert(userBooks)
      .values({
        userId,
        bookId: bookRecord.id,
        status: status as typeof userBooks.status.enumValues[number],
        startedAt: status === "reading" ? new Date() : null,
        completedAt: status === "completed" ? new Date() : null,
        progressPercent: status === "completed" ? 100 : 0,
      })
      .onConflictDoUpdate({
        target: [userBooks.userId, userBooks.bookId],
        set: { status: status as typeof userBooks.status.enumValues[number], updatedAt: new Date() },
      })
      .returning();

    return NextResponse.json({ userBook: userBook[0] });
  } catch (error) {
    console.error("Add to shelf error:", error);
    return NextResponse.json({ error: "Failed to add to shelf" }, { status: 500 });
  }
}

/**
 * PATCH /api/books/shelf — Update book status or progress
 * Body: { userBookId, status?, progressPercent? }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userBookId, status, progressPercent } = body;

    if (!userBookId) {
      return NextResponse.json({ error: "userBookId is required" }, { status: 400 });
    }

    const db = getDb();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (status) updateData.status = status;
    if (progressPercent !== undefined) updateData.progressPercent = progressPercent;
    if (status === "completed") {
      updateData.completedAt = new Date();
      updateData.progressPercent = 100;
    }
    if (status === "reading" && !updateData.startedAt) {
      updateData.startedAt = new Date();
    }

    const result = await db
      .update(userBooks)
      .set(updateData)
      .where(eq(userBooks.id, userBookId))
      .returning();

    return NextResponse.json({ userBook: result[0] });
  } catch (error) {
    console.error("Update shelf error:", error);
    return NextResponse.json({ error: "Failed to update shelf" }, { status: 500 });
  }
}

/**
 * DELETE /api/books/shelf?userBookId=...
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userBookId = searchParams.get("userBookId");

    if (!userBookId) {
      return NextResponse.json({ error: "userBookId is required" }, { status: 400 });
    }

    const db = getDb();
    await db.delete(userBooks).where(eq(userBooks.id, userBookId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete shelf error:", error);
    return NextResponse.json({ error: "Failed to remove from shelf" }, { status: 500 });
  }
}
