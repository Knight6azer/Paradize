import { NextRequest, NextResponse } from "next/server";
import { searchBooks, searchOpenLibrary } from "@/lib/books/google-books";
import { searchBooksSchema } from "@/lib/validation/schemas";

/**
 * GET /api/books/search?query=...&page=0&limit=20
 *
 * Search for books using Google Books API.
 * Falls back to Open Library if Google Books returns no results.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate input
    const parsed = searchBooksSchema.safeParse({
      query: searchParams.get("query"),
      page: searchParams.get("page") || "0",
      limit: searchParams.get("limit") || "20",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, page, limit } = parsed.data;
    const startIndex = page * limit;

    // Search Google Books
    let result = await searchBooks(query, startIndex, limit);

    // Fallback to Open Library if no results
    if (result.books.length === 0) {
      const openLibraryBooks = await searchOpenLibrary(query, limit);
      result = { books: openLibraryBooks, totalItems: openLibraryBooks.length };
    }

    return NextResponse.json({
      books: result.books,
      totalItems: result.totalItems,
      page,
      limit,
    });
  } catch (error) {
    console.error("Book search error:", error);
    return NextResponse.json(
      { error: "Failed to search books" },
      { status: 500 }
    );
  }
}
