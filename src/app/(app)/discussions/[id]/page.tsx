"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "@/lib/auth/client";
import {
  TrendUp,
  ChatTeardropDots,
  ArrowLeft,
  PaperPlaneRight,
  CheckCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface DiscussionDetail {
  id: string;
  title: string;
  content: string;
  discussionType: string;
  upvotes: number;
  replyCount: number;
  qualityScore: number | null;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  authorName: string;
  authorUsername: string;
  authorImage: string | null;
  authorReputation: string;
}

interface Reply {
  id: string;
  content: string;
  upvotes: number;
  isEvidenceBased: boolean;
  parentReplyId: string | null;
  createdAt: string;
  authorName: string;
  authorUsername: string;
  authorImage: string | null;
}

const typeColors: Record<string, string> = {
  question: "badge--amber",
  insight: "badge--sage",
  debate: "badge--error",
  reflection: "badge--teal",
  review: "badge--success",
};

export default function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();

  const [discussion, setDiscussion] = useState<DiscussionDetail | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Reply form
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const fetchDiscussion = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/discussions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDiscussion(data.discussion);
        setReplies(data.replies || []);
      } else {
        setError("Discussion not found");
      }
    } catch {
      setError("Failed to load discussion");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDiscussion();
  }, [fetchDiscussion]);

  const handleUpvote = async () => {
    if (hasUpvoted || !discussion) return;
    try {
      const res = await fetch(`/api/discussions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote" }),
      });
      if (res.ok) {
        setDiscussion({ ...discussion, upvotes: discussion.upvotes + 1 });
        setHasUpvoted(true);
      }
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || replyContent.length < 5) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/discussions/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: session.user.id,
          content: replyContent,
        }),
      });

      if (res.ok) {
        setReplyContent("");
        fetchDiscussion(); // Refresh to get new reply
      }
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading discussion..." />;
  }

  if (error || !discussion) {
    return (
      <div className="animate-fade-in" style={{ textAlign: "center", padding: "var(--space-16)" }}>
        <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>
          {error || "Discussion not found"}
        </h2>
        <Link href="/discussions" className="btn btn--primary">
          Back to Discussions
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Back link */}
      <Link
        href="/discussions"
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
        <ArrowLeft size={16} /> Back to Discussions
      </Link>

      {/* Discussion Header */}
      <article className="card" style={{ marginBottom: "var(--space-8)" }}>
        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            marginBottom: "var(--space-6)",
          }}
        >
          <div className="avatar avatar--sm">
            {discussion.authorName.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "var(--weight-semibold)", fontSize: "var(--text-sm)" }}>
              {discussion.authorName}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
              @{discussion.authorUsername} · {new Date(discussion.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
          <span className={`badge ${typeColors[discussion.discussionType] || "badge--sage"}`}>
            {discussion.discussionType}
          </span>
          {discussion.isPinned && (
            <span className="badge badge--amber">Pinned</span>
          )}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "var(--text-2xl)", lineHeight: "var(--leading-snug)", marginBottom: "var(--space-6)" }}>
          {discussion.title}
        </h1>

        {/* Content */}
        <div
          style={{
            fontSize: "var(--text-base)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--text-primary)",
            whiteSpace: "pre-wrap",
            marginBottom: "var(--space-6)",
          }}
        >
          {discussion.content}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            borderTop: "1px solid var(--border-light)",
            paddingTop: "var(--space-4)",
          }}
        >
          <button
            className={`btn btn--ghost`}
            onClick={handleUpvote}
            disabled={hasUpvoted}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              color: hasUpvoted ? "var(--forest-sage)" : "var(--text-tertiary)",
              fontWeight: hasUpvoted ? "var(--weight-bold)" : "var(--weight-medium)",
            }}
          >
            <TrendUp size={18} weight={hasUpvoted ? "fill" : "regular"} />
            {discussion.upvotes} Upvotes
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              color: "var(--text-tertiary)",
              fontSize: "var(--text-sm)",
            }}
          >
            <ChatTeardropDots size={18} />
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </div>
        </div>
      </article>

      {/* Replies */}
      <section style={{ marginBottom: "var(--space-8)" }}>
        <h3
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-bold)",
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <ChatTeardropDots size={20} weight="fill" color="var(--teal-main)" />
          Replies
        </h3>

        {replies.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="card"
                style={{
                  borderLeft: reply.isEvidenceBased
                    ? "3px solid var(--forest-sage)"
                    : "3px solid transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <div className="avatar avatar--xs">
                    {reply.authorName.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "var(--weight-semibold)", fontSize: "var(--text-sm)" }}>
                      {reply.authorName}
                    </span>
                    <span style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)", marginLeft: "var(--space-2)" }}>
                      {new Date(reply.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {reply.isEvidenceBased && (
                    <span
                      className="badge badge--sage"
                      style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}
                    >
                      <CheckCircle size={12} weight="fill" /> Evidence-Based
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    lineHeight: "var(--leading-relaxed)",
                    whiteSpace: "pre-wrap",
                    color: "var(--text-primary)",
                  }}
                >
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "var(--space-8)",
              color: "var(--text-tertiary)",
            }}
          >
            <ChatTeardropDots size={32} style={{ margin: "0 auto var(--space-3)" }} />
            <p>No replies yet. Be the first to contribute!</p>
          </div>
        )}
      </section>

      {/* Reply Form */}
      {discussion.isLocked ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "var(--space-6)",
            color: "var(--text-tertiary)",
            background: "var(--bg-secondary)",
          }}
        >
          This discussion is locked and no longer accepts replies.
        </div>
      ) : session ? (
        <form onSubmit={handleReply} className="card" style={{ background: "var(--bg-secondary)" }}>
          <h4
            style={{
              fontSize: "var(--text-md)",
              fontWeight: "var(--weight-semibold)",
              marginBottom: "var(--space-4)",
            }}
          >
            Add your reply
          </h4>
          <textarea
            className="input"
            placeholder="Share your thoughts thoughtfully..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            required
            minLength={5}
            style={{
              minHeight: "120px",
              resize: "vertical",
              marginBottom: "var(--space-4)",
              background: "var(--bg-card)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || replyContent.length < 5}
              style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
            >
              <PaperPlaneRight size={16} weight="bold" />
              {isSubmitting ? "Sending..." : "Post Reply"}
            </button>
          </div>
        </form>
      ) : (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "var(--space-6)",
            background: "var(--bg-secondary)",
          }}
        >
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
            Sign in to join the conversation.
          </p>
          <Link href="/login" className="btn btn--primary">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
