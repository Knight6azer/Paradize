/**
 * Paradize — Google Books API Service
 *
 * Fetches book metadata, covers, and descriptions from
 * Google Books API (free: 1,000 requests/day).
 *
 * Supplemented by Open Library API for additional data.
 */

interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    categories?: string[];
    language?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    averageRating?: number;
    ratingsCount?: number;
  };
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBookVolume[];
}

export interface BookSearchResult {
  googleBooksId: string;
  isbn: string | null;
  title: string;
  subtitle: string | null;
  authors: string[];
  description: string | null;
  coverUrl: string | null;
  genres: string[];
  pageCount: number | null;
  publishedDate: string | null;
  publisher: string | null;
  language: string;
}

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

/**
 * Search for books using Google Books API
 */
export async function searchBooks(
  query: string,
  startIndex: number = 0,
  maxResults: number = 20
): Promise<{ books: BookSearchResult[]; totalItems: number }> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const params = new URLSearchParams({
    q: query,
    startIndex: startIndex.toString(),
    maxResults: Math.min(maxResults, 40).toString(),
    printType: "books",
    langRestrict: "en",
    orderBy: "relevance",
  });

  if (apiKey) {
    params.set("key", apiKey);
  }

  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Google Books API error:", response.status);
      return { books: [], totalItems: 0 };
    }

    const data: GoogleBooksResponse = await response.json();

    const books: BookSearchResult[] = (data.items || []).map(transformVolume);

    return { books, totalItems: data.totalItems };
  } catch (error) {
    console.error("Google Books search failed:", error);
    return { books: [], totalItems: 0 };
  }
}

/**
 * Get a specific book by Google Books ID
 */
export async function getBookById(
  googleBooksId: string
): Promise<BookSearchResult | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const url = apiKey
    ? `${GOOGLE_BOOKS_API}/${googleBooksId}?key=${apiKey}`
    : `${GOOGLE_BOOKS_API}/${googleBooksId}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) return null;

    const volume: GoogleBookVolume = await response.json();
    return transformVolume(volume);
  } catch {
    return null;
  }
}

/**
 * Search books by ISBN
 */
export async function getBookByISBN(
  isbn: string
): Promise<BookSearchResult | null> {
  const result = await searchBooks(`isbn:${isbn}`, 0, 1);
  return result.books[0] || null;
}

/**
 * Get book cover URL (higher resolution)
 */
export function getHighResCover(
  coverUrl: string | null
): string | null {
  if (!coverUrl) return null;
  // Google Books thumbnails can be upscaled by modifying the zoom parameter
  return coverUrl
    .replace("zoom=1", "zoom=2")
    .replace("&edge=curl", "")
    .replace("http://", "https://");
}

/**
 * Transform Google Books volume to our format
 */
function transformVolume(volume: GoogleBookVolume): BookSearchResult {
  const info = volume.volumeInfo;

  // Extract ISBN (prefer ISBN-13)
  const isbn13 = info.industryIdentifiers?.find(
    (id) => id.type === "ISBN_13"
  )?.identifier;
  const isbn10 = info.industryIdentifiers?.find(
    (id) => id.type === "ISBN_10"
  )?.identifier;

  // Get cover URL and upgrade to HTTPS
  let coverUrl = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null;
  if (coverUrl) {
    coverUrl = coverUrl.replace("http://", "https://");
  }

  return {
    googleBooksId: volume.id,
    isbn: isbn13 || isbn10 || null,
    title: info.title,
    subtitle: info.subtitle || null,
    authors: info.authors || ["Unknown Author"],
    description: info.description || null,
    coverUrl,
    genres: info.categories || [],
    pageCount: info.pageCount || null,
    publishedDate: info.publishedDate || null,
    publisher: info.publisher || null,
    language: info.language || "en",
  };
}

/**
 * Fallback: Search Open Library API
 * Used when Google Books doesn't have data
 */
export async function searchOpenLibrary(
  query: string,
  limit: number = 10
): Promise<BookSearchResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      fields:
        "key,title,subtitle,author_name,cover_i,isbn,first_publish_year,publisher,number_of_pages_median,subject,language",
    });

    const response = await fetch(
      `https://openlibrary.org/search.json?${params}`,
      {
        headers: { "User-Agent": "Paradize/1.0 (reading community platform)" },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();

    return (data.docs || []).slice(0, limit).map(
      (doc: {
        key: string;
        title: string;
        subtitle?: string;
        author_name?: string[];
        cover_i?: number;
        isbn?: string[];
        first_publish_year?: number;
        publisher?: string[];
        number_of_pages_median?: number;
        subject?: string[];
        language?: string[];
      }): BookSearchResult => ({
        googleBooksId: doc.key,
        isbn: doc.isbn?.[0] || null,
        title: doc.title,
        subtitle: doc.subtitle || null,
        authors: doc.author_name || ["Unknown Author"],
        description: null,
        coverUrl: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : null,
        genres: (doc.subject || []).slice(0, 5),
        pageCount: doc.number_of_pages_median || null,
        publishedDate: doc.first_publish_year?.toString() || null,
        publisher: doc.publisher?.[0] || null,
        language: doc.language?.[0] || "en",
      })
    );
  } catch (error) {
    console.error("Open Library search failed:", error);
    return [];
  }
}
