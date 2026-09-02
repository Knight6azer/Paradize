import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/books/[id] — Get a single book by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const result = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book: result[0] });
  } catch (error) {
    console.error("Book fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}
