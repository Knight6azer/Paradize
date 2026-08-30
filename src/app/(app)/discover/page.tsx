"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth/client";
import { MagnifyingGlass, Sparkle, Fire, BookmarkSimple } from "@phosphor-icons/react";
import BookCard from "@/app/components/BookCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EmptyState from "@/app/components/EmptyState";
import { useRouter } from "next/navigation";

interface BookResult {
  id?: string;
  title: string;
  authors: string[];
  coverUrl?: string | null;
  description?: string | null;
  isbn?: string;
  genres?: string[];
  pageCount?: number;
  publishedDate?: string;
  publisher?: string;
  language?: string;
  subtitle?: string;
}

interface Recommendation {
  title: string;
  author: string;
  reason: string;
  question: string;
}

const GENRE_TAGS = [
  "Fiction", "Non-Fiction", "Science", "Philosophy", 
  "History", "Psychology", "Business", "Biography"
];

export default function DiscoverPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [searchResults, setSearchResults] = useState<BookResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/books/search?query=${encodeURIComponent(query)}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.books || []);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const getAIRecommendations = async () => {
    setIsRecommending(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genres: activeGenre ? [activeGenre] : ["Fiction", "Philosophy"],
          goals: ["Read something thought provoking"]
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
      }
    } catch (error) {
      console.error("AI recommendation failed:", error);
    } finally {
      setIsRecommending(false);
    }
  };

  const handleGenreClick = (genre: string) => {
    const newGenre = activeGenre === genre ? "" : genre;
    setActiveGenre(newGenre);
    if (newGenre) {
      setSearchQuery(`subject:${newGenre.toLowerCase()}`);
    } else {
      setSearchQuery("");
    }
  };

  const addToShelf = async (bookData: BookResult, status: string) => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch('/api/books/shelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          bookData,
          status
        })
      });

      if (res.ok) {
        // Show brief success state or toast
        alert("Added to shelf!");
      }
    } catch (error) {
      console.error("Failed to add to shelf:", error);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <header>
        <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>Discover</h1>
        <p style={{ color: "var(--text-secondary)" }}>Find your next great read.</p>
      </header>

      {/* Search Bar */}
      <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
        <div style={{ position: "absolute", left: "var(--space-4)", top: "50%", transform: "translateY(-50%)", color: "var(--forest-sage)", pointerEvents: "none" }}>
          <MagnifyingGlass size={24} weight="bold" />
        </div>
        <input
          type="text"
          className="input"
          placeholder="Search for books, authors, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            paddingLeft: "var(--space-12)", 
            paddingTop: "var(--space-4)", 
            paddingBottom: "var(--space-4)", 
            fontSize: "var(--text-lg)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}
        />
      </div>

      {/* Genre Tags */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", justifyContent: "center", marginBottom: "var(--space-4)" }}>
        {GENRE_TAGS.map(genre => (
          <button
            key={genre}
            className={`badge ${activeGenre === genre ? 'badge--sage' : 'badge--outline'}`}
            onClick={() => handleGenreClick(genre)}
            style={{ 
              fontSize: "var(--text-sm)", 
              padding: "var(--space-2) var(--space-4)", 
              cursor: "pointer",
              border: activeGenre === genre ? "none" : "1px solid var(--border-medium)"
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Search Results Area */}
      {searchQuery || hasSearched ? (
        <section>
          <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)" }}>Search Results</h2>
          
          {isSearching ? (
            <LoadingSpinner label="Searching..." />
          ) : searchResults.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
              {searchResults.map((book) => (
                <div key={book.id || book.title} style={{ height: "100%", background: "var(--bg-card)", borderRadius: "var(--radius-md)" }}>
                  <BookCard
                    id={book.id || 'temp'}
                    title={book.title}
                    authors={book.authors}
                    coverUrl={book.coverUrl}
                    description={book.description}
                    showActions={true}
                    onAddToShelf={(status) => addToShelf(book, status)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MagnifyingGlass size={48} />}
              title="No books found"
              description="Try adjusting your search terms or exploring a different genre."
            />
          )}
        </section>
      ) : (
        /* Default Discover View (when not searching) */
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>
          
          {/* AI Recommendations Banner */}
          <section className="card" style={{ 
            background: "linear-gradient(135deg, rgba(45, 95, 62, 0.1), rgba(245, 158, 11, 0.1))",
            border: "1px dashed var(--forest-sage)",
            padding: "var(--space-8)",
            textAlign: "center"
          }}>
            <Sparkle size={32} weight="fill" color="var(--forest-sage)" style={{ margin: "0 auto var(--space-4)" }} />
            <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-2)" }}>Curated For You</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto var(--space-6)" }}>
              Let our AI analyze your reading habits and goals to suggest books perfectly tailored to your intellectual journey.
            </p>
            
            {recommendations.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-4)", textAlign: "left", marginTop: "var(--space-6)" }}>
                {recommendations.map((rec, i) => (
                  <div key={i} style={{ background: "var(--bg-card)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)" }}>
                    <h4 style={{ fontWeight: "var(--weight-bold)", fontSize: "var(--text-lg)", marginBottom: "var(--space-1)" }}>{rec.title}</h4>
                    <div style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-3)" }}>By {rec.author}</div>
                    <p style={{ fontSize: "var(--text-sm)", fontStyle: "italic", marginBottom: "var(--space-2)" }}>&ldquo;{rec.reason}&rdquo;</p>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--forest-sage)", fontWeight: "var(--weight-semibold)" }}>Prompt: {rec.question}</div>
                  </div>
                ))}
              </div>
            ) : (
              <button 
                className="btn btn--primary"
                onClick={getAIRecommendations}
                disabled={isRecommending}
              >
                {isRecommending ? "Analyzing..." : "Generate Recommendations"}
              </button>
            )}
          </section>

          {/* Trending Section */}
          <section>
            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Fire size={24} weight="fill" color="var(--amber-main)" />
              Trending in the Community
            </h2>
            <EmptyState
              icon={<BookmarkSimple size={48} />}
              title="Trending books"
              description="Books that the community is currently reading and discussing."
              action={{ label: "View Popular Books", onClick: () => setSearchQuery("subject:fiction") }}
            />
          </section>
        </div>
      )}
    </div>
  );
}
