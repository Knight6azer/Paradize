"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "@/lib/auth/client";
import {
  ArrowLeft,
  BookOpenText,
  BookmarkSimple,
  CheckCircle,
  Star,
  Users,
  ChatTeardropDots,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useRouter } from "next/navigation";

interface BookDetail {
  id: string;
  isbn: string | null;
  title: string;
  subtitle: string | null;
  authors: string[];
  description: string | null;
  coverUrl: string | null;
  genres: string[] | null;
  pageCount: number | null;
  publishedDate: string | null;
  publisher: string | null;
  language: string | null;
  avgCommunityRating: number | null;
  totalReaders: number | null;
  totalDiscussions: number | null;
}

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [shelfStatus, setShelfStatus] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchBook = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}`);
      if (res.ok) {
        const data = await res.json();
        setBook(data.book);
      } else {
        setError("Book not found");
      }
    } catch {
      setError("Failed to load book");
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBook();
  }, [fetchBook]);

  const addToShelf = async (status: string) => {
    if (!session?.user?.id || !book) {
      router.push("/login");
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch("/api/books/shelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          bookData: {
            title: book.title,
            authors: book.authors,
            coverUrl: book.coverUrl,
            isbn: book.isbn,
            description: book.description,
            pageCount: book.pageCount,
            publishedDate: book.publishedDate,
            publisher: book.publisher,
            genres: book.genres,
            language: book.language,
            subtitle: book.subtitle,
          },
          status,
        }),
      });

      if (res.ok) {
        setShelfStatus(status);
      }
    } catch (err) {
      console.error("Failed to add to shelf:", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading book..." />;
  }

  if (error || !book) {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: "var(--space-16)" }}>
        <BookOpenText size={48} weight="duotone" style={{ color: "var(--text-tertiary)", marginBottom: "var(--space-4)" }} />
        <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>
          {error || "Book not found"}
        </h2>
        <Link href="/discover" className="btn btn--primary">
          Back to Discover
        </Link>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    want_to_read: "Want to Read",
    reading: "Currently Reading",
    completed: "Read",
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Back link */}
      <Link
        href="/discover"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          color: "var(--text-secondary)",
          textDecoration: "none",
          marginBottom: "var(--space-8)",
          fontWeight: "var(--weight-medium)",
          fontSize: "var(--text-sm)",
        }}
      >
        <ArrowLeft size={16} /> Back to Discover
      </Link>

      {/* Book Hero */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "var(--space-10)",
          marginBottom: "var(--space-10)",
        }}
      >
        {/* Cover */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "2/3",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          }}
        >
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="260px"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, var(--forest-sage), var(--teal-main))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <BookOpenText size={64} weight="duotone" />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Genres */}
          {book.genres && book.genres.length > 0 && (
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
              {book.genres.map((genre) => (
                <span key={genre} className="badge badge--outline" style={{ fontSize: "var(--text-xs)" }}>
                  {genre}
                </span>
              ))}
            </div>
          )}

          <h1 style={{ fontSize: "var(--text-3xl)", lineHeight: "var(--leading-snug)", marginBottom: "var(--space-2)" }}>
            {book.title}
          </h1>

          {book.subtitle && (
            <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
              {book.subtitle}
            </p>
          )}

          <p style={{ fontSize: "var(--text-md)", color: "var(--forest-sage)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-6)" }}>
            by {book.authors.join(", ")}
          </p>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "var(--space-6)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
            {book.avgCommunityRating != null && book.avgCommunityRating > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                <Star size={16} weight="fill" color="var(--amber-main)" />
                {book.avgCommunityRating.toFixed(1)} Community Rating
              </div>
            )}
            {book.totalReaders != null && book.totalReaders > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                <Users size={16} />
                {book.totalReaders} Readers
              </div>
            )}
            {book.totalDiscussions != null && book.totalDiscussions > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                <ChatTeardropDots size={16} />
                {book.totalDiscussions} Discussions
              </div>
            )}
            {book.pageCount && (
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>
                {book.pageCount} pages
              </div>
            )}
          </div>

          {/* Shelf Actions */}
          {shelfStatus ? (
            <div
              className="btn btn--secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                pointerEvents: "none",
              }}
            >
              <CheckCircle size={18} weight="fill" color="var(--forest-sage)" />
              Added as &ldquo;{statusLabels[shelfStatus] || shelfStatus}&rdquo;
            </div>
          ) : (
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <button
                className="btn btn--primary"
                onClick={() => addToShelf("want_to_read")}
                disabled={isAdding}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
              >
                <BookmarkSimple size={18} weight="bold" />
                Want to Read
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => addToShelf("reading")}
                disabled={isAdding}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
              >
                <BookOpenText size={18} />
                Start Reading
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => addToShelf("completed")}
                disabled={isAdding}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
              >
                <CheckCircle size={18} />
                Mark as Read
              </button>
            </div>
          )}

          {/* Meta details */}
          <div
            style={{
              marginTop: "var(--space-8)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "var(--space-4)",
              fontSize: "var(--text-sm)",
            }}
          >
            {book.publisher && (
              <div>
                <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-1)" }}>Publisher</div>
                <div style={{ color: "var(--text-primary)" }}>{book.publisher}</div>
              </div>
            )}
            {book.publishedDate && (
              <div>
                <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-1)" }}>Published</div>
                <div style={{ color: "var(--text-primary)" }}>{book.publishedDate}</div>
              </div>
            )}
            {book.isbn && (
              <div>
                <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-1)" }}>ISBN</div>
                <div style={{ color: "var(--text-primary)" }}>{book.isbn}</div>
              </div>
            )}
            {book.language && (
              <div>
                <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-1)" }}>Language</div>
                <div style={{ color: "var(--text-primary)" }}>{book.language.toUpperCase()}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {book.description && (
        <section className="card" style={{ marginBottom: "var(--space-8)" }}>
          <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-4)" }}>
            About This Book
          </h3>
          <div
            style={{
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-relaxed)",
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap",
            }}
          >
            {book.description}
          </div>
        </section>
      )}
    </div>
  );
}
