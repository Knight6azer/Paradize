"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth/client";
import { Books, MagnifyingGlass, BookOpenText, CheckCircle, X } from "@phosphor-icons/react";
import BookCard from "@/app/components/BookCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EmptyState from "@/app/components/EmptyState";
import Link from "next/link";

interface ShelfBook {
  id: string;
  bookId: string;
  title: string;
  subtitle?: string | null;
  authors: string[];
  coverUrl?: string | null;
  genres?: string[];
  status: "want_to_read" | "reading" | "completed" | "abandoned";
  progressPercent: number;
  personalRating?: number | null;
  isFavorite?: boolean;
  startedAt?: string | null;
  completedAt?: string | null;
  pageCount?: number | null;
  description?: string | null;
}

type ShelfStatus = "all" | "reading" | "want_to_read" | "completed";

export default function LibraryPage() {
  const { data: session } = useSession();
  
  const [activeTab, setActiveTab] = useState<ShelfStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchShelf = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const url = activeTab === "all" 
        ? `/api/books/shelf?userId=${session.user.id}`
        : `/api/books/shelf?userId=${session.user.id}&status=${activeTab}`;
        
      const res = await fetch(url);
      if (res.ok) {
        const { shelf } = await res.json();
        setBooks(shelf);
      }
    } catch (error) {
      console.error("Failed to load shelf:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session, activeTab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchShelf();
  }, [fetchShelf]);

  const handleStatusChange = async (userBookId: string, newStatus: string) => {
    setIsUpdating(userBookId);
    try {
      const res = await fetch('/api/books/shelf', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userBookId, status: newStatus })
      });
      
      if (res.ok) {
        fetchShelf(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemove = async (userBookId: string) => {
    setIsUpdating(userBookId);
    try {
      const res = await fetch(`/api/books/shelf?userBookId=${userBookId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setBooks(prev => prev.filter(b => b.id !== userBookId));
      }
    } catch (error) {
      console.error("Failed to remove book", error);
    } finally {
      setIsUpdating(null);
    }
  };

  // Filter books by search query client-side
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors?.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>My Library</h1>
          <p style={{ color: "var(--text-secondary)" }}>Your personal collection and reading progress.</p>
        </div>
        
        <Link href="/discover" className="btn btn--primary">
          Find New Books
        </Link>
      </header>

      {/* Controls: Search and Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
        
        {/* Tabs */}
        <div style={{ display: "flex", background: "var(--bg-secondary)", padding: "var(--space-1)", borderRadius: "var(--radius-lg)" }}>
          <button 
            className={`btn ${activeTab === 'all' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setActiveTab('all')}
            style={{ padding: "var(--space-2) var(--space-4)" }}
          >
            All Books
          </button>
          <button 
            className={`btn ${activeTab === 'reading' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setActiveTab('reading')}
            style={{ padding: "var(--space-2) var(--space-4)" }}
          >
            Currently Reading
          </button>
          <button 
            className={`btn ${activeTab === 'want_to_read' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setActiveTab('want_to_read')}
            style={{ padding: "var(--space-2) var(--space-4)" }}
          >
            Want to Read
          </button>
          <button 
            className={`btn ${activeTab === 'completed' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setActiveTab('completed')}
            style={{ padding: "var(--space-2) var(--space-4)" }}
          >
            Completed
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative", minWidth: "300px" }}>
          <div style={{ position: "absolute", left: "var(--space-3)", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)", pointerEvents: "none" }}>
            <MagnifyingGlass size={20} />
          </div>
          <input
            type="text"
            className="input"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "var(--space-10)" }}
          />
        </div>
      </div>

      {/* Book Grid */}
      {isLoading ? (
        <LoadingSpinner label="Fetching your books..." />
      ) : filteredBooks.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
          {filteredBooks.map((book) => (
            <div key={book.id} style={{ position: "relative" }}>
              <div style={{ opacity: isUpdating === book.id ? 0.5 : 1, transition: "opacity 0.2s" }}>
                <BookCard
                  id={book.bookId}
                  title={book.title}
                  authors={book.authors}
                  coverUrl={book.coverUrl}
                  genres={book.genres}
                  progress={book.progressPercent}
                  status={book.status}
                  showActions={false}
                  linkTo={`/discover/${book.bookId}`}
                />
              </div>

              {/* Status Actions Overlay */}
              <div style={{ 
                position: "absolute", 
                bottom: "var(--space-4)", 
                right: "var(--space-4)", 
                display: "flex", 
                gap: "var(--space-2)" 
              }}>
                {book.status !== 'reading' && (
                  <button 
                    className="btn btn--sm" 
                    style={{ background: "rgba(45, 95, 62, 0.1)", color: "var(--forest-sage)", padding: "var(--space-1) var(--space-2)" }}
                    onClick={(e) => { e.preventDefault(); handleStatusChange(book.id, 'reading'); }}
                    title="Move to Reading"
                  >
                    <BookOpenText size={16} />
                  </button>
                )}
                {book.status !== 'completed' && (
                  <button 
                    className="btn btn--sm" 
                    style={{ background: "rgba(34, 197, 94, 0.1)", color: "var(--success-main)", padding: "var(--space-1) var(--space-2)" }}
                    onClick={(e) => { e.preventDefault(); handleStatusChange(book.id, 'completed'); }}
                    title="Mark as Completed"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                <button 
                  className="btn btn--sm" 
                  style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--error-main)", padding: "var(--space-1) var(--space-2)" }}
                  onClick={(e) => { e.preventDefault(); handleRemove(book.id); }}
                  title="Remove from Shelf"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Books size={64} weight="duotone" />}
          title={searchQuery ? "No matching books found" : "Your library is empty"}
          description={searchQuery 
            ? "Try adjusting your search terms." 
            : activeTab === 'all' 
              ? "You haven't added any books to your shelf yet."
              : `You don't have any books marked as '${activeTab.replace('_', ' ')}'.`
          }
          action={!searchQuery ? { label: "Discover Books", href: "/discover" } : undefined}
        />
      )}
    </div>
  );
}
