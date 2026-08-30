"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { ArrowLeft, Sparkle, ChatTeardropDots } from "@phosphor-icons/react";
import Link from "next/link";

const DISCUSSION_TYPES = [
  { value: "insight", label: "Insight", desc: "Share a realization or key takeaway" },
  { value: "question", label: "Question", desc: "Ask the community something you're wondering about" },
  { value: "debate", label: "Debate", desc: "Propose an argument or challenge a premise" },
  { value: "reflection", label: "Reflection", desc: "Personal thoughts on how a book affected you" },
  { value: "review", label: "Review", desc: "A critique or recommendation" },
];

export default function NewDiscussionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("insight");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: session.user.id,
          title,
          content,
          discussionType: type
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create discussion");
      }

      const { discussion } = await res.json();
      router.push(`/discussions/${discussion.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create discussion");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "var(--space-8) 0" }}>
      
      <Link href="/discussions" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-secondary)", textDecoration: "none", marginBottom: "var(--space-8)", fontWeight: "var(--weight-medium)" }}>
        <ArrowLeft size={16} /> Back to Discussions
      </Link>

      <header style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>Start a Discussion</h1>
        <p style={{ color: "var(--text-secondary)" }}>Share an insight, ask a question, or spark a debate.</p>
      </header>

      <form onSubmit={handleSubmit} className="card">
        {error && (
          <div style={{ padding: "var(--space-4)", background: "rgba(239, 68, 68, 0.1)", color: "var(--error-dark)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-6)" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "var(--space-6)" }}>
          <label style={{ display: "block", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-2)" }}>
            Discussion Type
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--space-3)" }}>
            {DISCUSSION_TYPES.map(t => (
              <div 
                key={t.value}
                onClick={() => setType(t.value)}
                style={{
                  padding: "var(--space-3)",
                  border: `1.5px solid ${type === t.value ? 'var(--forest-sage)' : 'var(--border-light)'}`,
                  background: type === t.value ? 'rgba(45, 95, 62, 0.05)' : 'var(--bg-secondary)',
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                <div style={{ fontWeight: "var(--weight-semibold)", color: type === t.value ? 'var(--forest-sage)' : 'var(--text-primary)', marginBottom: "var(--space-1)" }}>
                  {t.label}
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "var(--space-6)" }}>
          <label htmlFor="title" style={{ display: "block", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-2)" }}>
            Title <span style={{ color: "var(--error-main)" }}>*</span>
          </label>
          <input
            id="title"
            type="text"
            className="input"
            placeholder="E.g., Does the concept of 'Flow' apply to reading itself?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={5}
            maxLength={120}
          />
        </div>

        <div style={{ marginBottom: "var(--space-8)" }}>
          <label htmlFor="content" style={{ display: "block", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-2)" }}>
            Content <span style={{ color: "var(--error-main)" }}>*</span>
          </label>
          <textarea
            id="content"
            className="input"
            placeholder="Share your thoughts, reference specific passages, or pose your questions here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={20}
            style={{ minHeight: "200px", resize: "vertical" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
            <span>Markdown is supported. Be respectful and constructive.</span>
            <span style={{ color: content.length < 20 ? 'var(--error-main)' : 'inherit' }}>
              {content.length}/5000 (Min 20)
            </span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--forest-sage)", fontSize: "var(--text-sm)", background: "rgba(45, 95, 62, 0.1)", padding: "var(--space-2) var(--space-4)", borderRadius: "var(--radius-full)" }}>
            <Sparkle size={16} weight="fill" />
            AI will analyze your post for quality scoring
          </div>
          
          <button 
            type="submit" 
            className="btn btn--primary"
            disabled={isSubmitting || !title || content.length < 20}
          >
            {isSubmitting ? "Posting..." : (
              <>
                <ChatTeardropDots size={16} weight="bold" />
                Post Discussion
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
