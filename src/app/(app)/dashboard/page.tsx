"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendUp, 
  BookOpenText, 
  Sparkle,
  BookmarkSimple,
  ChatsCircle,
  Fire,
  Medal,
  Users
} from "@phosphor-icons/react";
import BookCard from "@/app/components/BookCard";
import DiscussionCard from "@/app/components/DiscussionCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EmptyState from "@/app/components/EmptyState";
import { useSession } from "@/lib/auth/client";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [reading, setReading] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!session?.user?.id) return;
      
      try {
        const shelfRes = await fetch(`/api/books/shelf?userId=${session.user.id}&status=reading`);
        if (shelfRes.ok) {
          const { shelf } = await shelfRes.json();
          setReading(shelf);
        }

        const discRes = await fetch(`/api/discussions?limit=2`);
        if (discRes.ok) {
          const { discussions: d } = await discRes.json();
          setDiscussions(d);
        }

        try {
          const recRes = await fetch('/api/ai/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              genres: ["Philosophy", "Self-Help"],
              goals: ["To be more mindful"]
            })
          });
          
          if (recRes.ok) {
            const data = await recRes.json();
            if (data.recommendations && data.recommendations.length > 0) {
              setRecommendation(data.recommendations[0]);
            }
          }
        } catch (e) {
          console.error("AI recommendation failed", e);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [session]);

  if (isLoading) {
    return <LoadingSpinner label="Loading your reading universe..." />;
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <header>
        <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Reader'}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>Here's what's happening in your intellectual journey.</p>
        
        {/* Stats Row */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-6)" }}>
          <div className="card" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ padding: "var(--space-3)", background: "rgba(245, 158, 11, 0.1)", color: "var(--amber-dark)", borderRadius: "var(--radius-full)" }}>
              <Fire size={24} weight="fill" />
            </div>
            <div>
              <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>12</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
            </div>
          </div>
          <div className="card" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ padding: "var(--space-3)", background: "rgba(45, 95, 62, 0.1)", color: "var(--forest-sage)", borderRadius: "var(--radius-full)" }}>
              <BookOpenText size={24} weight="fill" />
            </div>
            <div>
              <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>14</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Books Read</div>
            </div>
          </div>
          <div className="card" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ padding: "var(--space-3)", background: "rgba(38, 70, 83, 0.1)", color: "var(--teal-dark)", borderRadius: "var(--radius-full)" }}>
              <Medal size={24} weight="fill" />
            </div>
            <div>
              <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>2.4k</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Reputation</div>
            </div>
          </div>
        </section>
      </header>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          
          {/* Currently Reading */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <BookmarkSimple size={20} weight="fill" color="var(--forest-sage)" />
                Currently Reading
              </h3>
              <Link href="/library" style={{ fontSize: "var(--text-sm)", color: "var(--forest-sage)", fontWeight: "var(--weight-semibold)", textDecoration: "none" }}>
                View Shelf
              </Link>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {reading.length > 0 ? reading.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.bookId}
                  title={book.title}
                  authors={book.authors}
                  coverUrl={book.coverUrl}
                  progress={book.progressPercent}
                  status="reading"
                  linkTo={`/discover/${book.bookId}`}
                />
              )) : (
                <EmptyState 
                  icon={<BookOpenText size={48} />}
                  title="Not reading anything"
                  description="You don't have any books marked as currently reading."
                  action={{ label: "Discover Books", href: "/discover" }}
                />
              )}
            </div>
          </section>

          {/* AI Recommendation */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <Sparkle size={20} weight="fill" color="var(--amber-main)" />
                Daily Insight
              </h3>
            </div>
            
            <div className="card" style={{ background: "var(--bg-tertiary)", border: "none" }}>
              {recommendation ? (
                <>
                  <h4 style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-1)" }}>
                    {recommendation.title}
                  </h4>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
                    By {recommendation.author}
                  </div>
                  
                  <p style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-4)", fontStyle: "italic" }}>
                    "{recommendation.reason}"
                  </p>
                  
                  <div style={{ background: "white", padding: "var(--space-3)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--amber-main)" }}>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-1)", fontWeight: "var(--weight-bold)" }}>
                      Reflection Prompt
                    </div>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>
                      {recommendation.question}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "var(--space-4)" }}>
                  <Sparkle size={24} style={{ margin: "0 auto var(--space-2)", color: "var(--text-tertiary)" }} />
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>Check back tomorrow for a new recommendation.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
          
          {/* Recent Discussions */}
          <section>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <ChatsCircle size={20} weight="fill" color="var(--teal-main)" />
                Trending Discussions
              </h3>
              <Link href="/discussions" style={{ fontSize: "var(--text-sm)", color: "var(--forest-sage)", fontWeight: "var(--weight-semibold)", textDecoration: "none" }}>
                View All
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {discussions.length > 0 ? discussions.map((disc) => (
                <DiscussionCard
                  key={disc.id}
                  id={disc.id}
                  title={disc.title}
                  content={disc.content}
                  authorName={disc.authorName}
                  authorInitial={disc.authorName.charAt(0)}
                  discussionType={disc.discussionType}
                  bookTitle={disc.bookTitle}
                  groupName={disc.groupName}
                  upvotes={disc.upvotes}
                  replyCount={disc.replyCount}
                  createdAt={new Date(disc.createdAt).toLocaleDateString()}
                />
              )) : (
                <EmptyState 
                  icon={<ChatsCircle size={48} />}
                  title="No discussions yet"
                  description="Be the first to start a discussion in the community!"
                  action={{ label: "Start Discussion", href: "/discussions/new" }}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
