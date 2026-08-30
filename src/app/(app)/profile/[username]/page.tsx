"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "@/lib/auth/client";
import { Medal, BookOpenText, Fire, ChatsCircle } from "@phosphor-icons/react";
import BookCard from "@/app/components/BookCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { notFound } from "next/navigation";

interface ProfileBook {
  id: string;
  bookId: string;
  title: string;
  authors: string[];
  coverUrl?: string | null;
}

interface ProfileDiscussion {
  id: string;
  title: string;
  createdAt: string;
  upvotes: number;
}

interface ProfileData {
  id: string;
  name: string;
  preferences?: {
    readingStyle?: string;
    booksPerMonth?: string;
    favoriteGenres?: string[];
    biggestChallenge?: string;
    growthGoal?: string;
  };
  stats?: {
    streak?: number;
    booksRead?: number;
    discussions?: number;
    reputation?: number;
  };
  recentBooks?: ProfileBook[];
  recentDiscussions?: ProfileDiscussion[];
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        } else {
          setError("User not found");
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    if (username) {
      loadProfile();
    }
  }, [username]);

  if (isLoading) return <LoadingSpinner label="Loading profile..." />;
  if (error || !profile) return notFound();

  const isOwnProfile = session?.user?.id === profile.id;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      
      {/* Profile Header */}
      <header className="card" style={{ display: "flex", gap: "var(--space-8)", alignItems: "center", padding: "var(--space-8)" }}>
        <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", fontWeight: "var(--weight-bold)", color: "var(--forest-sage)", flexShrink: 0 }}>
          {profile.name.charAt(0)}
        </div>
        
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-1)" }}>{profile.name}</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>@{profile.name.toLowerCase().replace(/\s+/g, '')}</p>
          
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            {profile.preferences?.readingStyle && (
              <span className="badge badge--sage">
                {profile.preferences.readingStyle === "solo" ? "🧘 Solo Reflector" : "🤝 Community Builder"}
              </span>
            )}
            {profile.preferences?.booksPerMonth && (
              <span className="badge badge--outline">
                {profile.preferences.booksPerMonth === "fast" ? "6+ books/mo" : profile.preferences.booksPerMonth === "medium" ? "3-5 books/mo" : "1-2 books/mo"}
              </span>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <button className="btn btn--outline">Edit Profile</button>
        )}
      </header>

      {/* Stats Grid */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-4)" }}>
          <Fire size={32} weight="duotone" color="var(--amber-main)" />
          <div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>{profile.stats?.streak || 0}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Day Streak</div>
          </div>
        </div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-4)" }}>
          <BookOpenText size={32} weight="duotone" color="var(--forest-sage)" />
          <div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>{profile.stats?.booksRead || 0}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Books Read</div>
          </div>
        </div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-4)" }}>
          <ChatsCircle size={32} weight="duotone" color="var(--teal-main)" />
          <div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>{profile.stats?.discussions || 0}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Discussions</div>
          </div>
        </div>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-4)" }}>
          <Medal size={32} weight="duotone" color="var(--purple-main)" />
          <div>
            <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>{profile.stats?.reputation || 0}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Reputation</div>
          </div>
        </div>
      </section>

      {/* Two Column Content */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>
        
        {/* Left Column: Recent Activity / Shelf Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          <section>
            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <BookOpenText size={24} color="var(--forest-sage)" />
              Recently Completed
            </h2>
            
            {profile.recentBooks && profile.recentBooks.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
                {profile.recentBooks.map((book: ProfileBook) => (
                  <BookCard
                    key={book.id}
                    id={book.bookId}
                    title={book.title}
                    authors={book.authors}
                    coverUrl={book.coverUrl}
                    showActions={false}
                    linkTo={`/discover/${book.bookId}`}
                  />
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-secondary)" }}>
                No completed books yet.
              </div>
            )}
          </section>

          <section>
            <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <ChatsCircle size={24} color="var(--teal-main)" />
              Recent Discussions
            </h2>
            
            {profile.recentDiscussions && profile.recentDiscussions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {profile.recentDiscussions.map((disc: ProfileDiscussion) => (
                  <div key={disc.id} className="card card--interactive">
                    <h4 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{disc.title}</h4>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>
                      {new Date(disc.createdAt).toLocaleDateString()} • {disc.upvotes} Upvotes
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-secondary)" }}>
                No discussions started yet.
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Preferences & Bio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div className="card">
            <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>About</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-6)" }}>
              {profile.preferences?.growthGoal || "Avid reader looking to discover new perspectives."}
            </p>
            
            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
              Favorite Genres
            </h4>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-6)" }}>
              {profile.preferences?.favoriteGenres ? profile.preferences.favoriteGenres.map((g: string) => (
                <span key={g} className="badge badge--outline">{g}</span>
              )) : (
                <span style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>Not set</span>
              )}
            </div>

            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
              Biggest Challenge
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
              {profile.preferences?.biggestChallenge || "Not set"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
