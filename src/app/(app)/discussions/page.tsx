"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth/client";
import { ChatsCircle, Plus, BookOpenText, TrendUp } from "@phosphor-icons/react";
import DiscussionCard from "@/app/components/DiscussionCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EmptyState from "@/app/components/EmptyState";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DiscussionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDiscussions() {
      setIsLoading(true);
      try {
        const url = activeTab === "all" 
          ? `/api/discussions`
          : `/api/discussions?type=${activeTab}`;
          
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setDiscussions(data.discussions || []);
        }
      } catch (error) {
        console.error("Failed to load discussions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDiscussions();
  }, [activeTab]);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>Discussions</h1>
          <p style={{ color: "var(--text-secondary)" }}>Join the conversation about your favorite ideas.</p>
        </div>
        
        <button 
          className="btn btn--primary"
          onClick={() => {
            if (!session) router.push("/login");
            else router.push("/discussions/new");
          }}
        >
          <Plus size={16} weight="bold" />
          New Discussion
        </button>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", background: "var(--bg-secondary)", padding: "var(--space-1)", borderRadius: "var(--radius-lg)", overflowX: "auto" }}>
        <button 
          className={`btn ${activeTab === 'all' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('all')}
          style={{ padding: "var(--space-2) var(--space-4)", whiteSpace: "nowrap" }}
        >
          All
        </button>
        <button 
          className={`btn ${activeTab === 'insight' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('insight')}
          style={{ padding: "var(--space-2) var(--space-4)", whiteSpace: "nowrap" }}
        >
          Insights
        </button>
        <button 
          className={`btn ${activeTab === 'question' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('question')}
          style={{ padding: "var(--space-2) var(--space-4)", whiteSpace: "nowrap" }}
        >
          Questions
        </button>
        <button 
          className={`btn ${activeTab === 'debate' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('debate')}
          style={{ padding: "var(--space-2) var(--space-4)", whiteSpace: "nowrap" }}
        >
          Debates
        </button>
        <button 
          className={`btn ${activeTab === 'reflection' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('reflection')}
          style={{ padding: "var(--space-2) var(--space-4)", whiteSpace: "nowrap" }}
        >
          Reflections
        </button>
      </div>

      {/* Discussions Feed */}
      {isLoading ? (
        <LoadingSpinner label="Loading discussions..." />
      ) : discussions.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-4)" }}>
          {discussions.map((disc) => (
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
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ChatsCircle size={48} />}
          title={activeTab === 'all' ? "No discussions yet" : `No ${activeTab}s yet`}
          description={activeTab === 'all' 
            ? "Be the first to start a conversation in the community!" 
            : `There are no discussions of type '${activeTab}' right now.`}
          action={{ 
            label: "Start Discussion", 
            onClick: () => {
              if (!session) router.push("/login");
              else router.push("/discussions/new");
            }
          }}
        />
      )}
    </div>
  );
}
