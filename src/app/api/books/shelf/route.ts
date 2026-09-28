import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { userBooks, books } from "@/lib/db/schema";
import { eq, and, type SQL } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";

/**
 * GET /api/books/shelf?status=reading|completed|want_to_read
 * User ID is extracted from the server-side session.
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication server-side
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const db = getDb();
    const conditions: SQL[] = [eq(userBooks.userId, session.user.id)];
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
 * Body: { bookData (from Google Books), status }
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
    const { bookData, status = "want_to_read" } = body;

    if (!bookData) {
      return NextResponse.json({ error: "bookData is required" }, { status: 400 });
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

    // Add to user's shelf using session user ID
    const userBook = await db
      .insert(userBooks)
      .values({
        userId: session.user.id,
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
 * Verifies the userBook belongs to the authenticated user.
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication server-side
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { userBookId, status, progressPercent } = body;

    if (!userBookId) {
      return NextResponse.json({ error: "userBookId is required" }, { status: 400 });
    }

    const db = getDb();

    // Verify ownership: only allow updating own books
    const existing = await db
      .select({ userId: userBooks.userId })
      .from(userBooks)
      .where(eq(userBooks.id, userBookId))
      .limit(1);

    if (!existing[0] || existing[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
    }

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
 * Verifies the userBook belongs to the authenticated user.
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication server-side
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userBookId = searchParams.get("userBookId");

    if (!userBookId) {
      return NextResponse.json({ error: "userBookId is required" }, { status: 400 });
    }

    const db = getDb();

    // Verify ownership before deletion
    const existing = await db
      .select({ userId: userBooks.userId })
      .from(userBooks)
      .where(eq(userBooks.id, userBookId))
      .limit(1);

    if (!existing[0] || existing[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
    }

    await db.delete(userBooks).where(eq(userBooks.id, userBookId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete shelf error:", error);
    return NextResponse.json({ error: "Failed to remove from shelf" }, { status: 500 });
  }
}
