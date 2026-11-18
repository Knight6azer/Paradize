import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getBookById as getGoogleBookById } from "@/lib/books/google-books";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/books/[id] — Get a single book by ID
 * Supports both internal database UUIDs and external Google Books IDs.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. If valid UUID, look up in local database
    if (UUID_REGEX.test(id)) {
      const db = getDb();
      const result = await db
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);

      if (result.length > 0) {
        return NextResponse.json({ book: result[0] });
      }
    }

    // 2. Fallback: Search Google Books API for external volume ID
    const externalBook = await getGoogleBookById(id);
    if (externalBook) {
      // Upsert into local database if possible for future relational stability
      try {
        const db = getDb();
        if (externalBook.isbn) {
          const existing = await db
            .select()
            .from(books)
            .where(eq(books.isbn, externalBook.isbn))
            .limit(1);

          if (existing.length > 0) {
            return NextResponse.json({ book: existing[0] });
          }
        }

        const inserted = await db
          .insert(books)
          .values({
            isbn: externalBook.isbn || null,
            title: externalBook.title,
            subtitle: externalBook.subtitle || null,
            authors: externalBook.authors || ["Unknown Author"],
            description: externalBook.description || null,
            coverUrl: externalBook.coverUrl || null,
            genres: externalBook.genres || [],
            pageCount: externalBook.pageCount || null,
            publishedDate: externalBook.publishedDate || null,
            publisher: externalBook.publisher || null,
            language: externalBook.language || "en",
          })
          .returning();

        return NextResponse.json({ book: inserted[0] });
      } catch {
        // If DB write fails, still return external book data cleanly
        return NextResponse.json({
          book: {
            id,
            isbn: externalBook.isbn,
            title: externalBook.title,
            subtitle: externalBook.subtitle,
            authors: externalBook.authors,
            description: externalBook.description,
            coverUrl: externalBook.coverUrl,
            genres: externalBook.genres,
            pageCount: externalBook.pageCount,
            publishedDate: externalBook.publishedDate,
            publisher: externalBook.publisher,
            language: externalBook.language,
            avgCommunityRating: 0,
            totalReaders: 0,
            totalDiscussions: 0,
          },
        });
      }
    }

    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  } catch (error) {
    console.error("Book fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}
