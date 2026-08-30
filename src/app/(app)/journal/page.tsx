"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth/client";
import { Notebook, Sparkle, LockKey, Globe, BookOpenText } from "@phosphor-icons/react";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EmptyState from "@/app/components/EmptyState";
import MoodSelector from "@/app/components/MoodSelector";
import { useRouter } from "next/navigation";

interface ReflectionEntry {
  id: string;
  content: string;
  mood?: string | null;
  isPrivate: boolean;
  growthTags?: string[];
  createdAt: string;
  bookId?: string | null;
  bookTitle?: string | null;
  bookCover?: string | null;
}

export default function JournalPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Composer state
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Prompt state
  const [prompt, setPrompt] = useState("What challenged your perspective today?");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  const fetchReflections = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reflections?userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setReflections(data.reflections || []);
      }
    } catch (error) {
      console.error("Failed to load reflections:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReflections();
  }, [fetchReflections]);

  const handleGeneratePrompt = async () => {
    setIsGeneratingPrompt(true);
    try {
      const res = await fetch('/api/ai/reflection-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      });
      if (res.ok) {
        const data = await res.json();
        setPrompt(data.prompt);
      }
    } catch (error) {
      console.error("Failed to generate prompt:", error);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || content.length < 10) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          content,
          mood,
          isPrivate
        })
      });

      if (res.ok) {
        setContent("");
        setMood("");
        fetchReflections(); // Refresh list
      }
    } catch (error) {
      console.error("Failed to save reflection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <EmptyState
        icon={<Notebook size={48} />}
        title="Sign in required"
        description="Please sign in to access your private reflection journal."
        action={{ label: "Sign In", onClick: () => router.push("/login") }}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "var(--space-8)" }}>
      
      {/* Left Column: Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        <header>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            Reflection Journal
            <LockKey size={24} color="var(--text-tertiary)" />
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Your private space to process thoughts and insights.</p>
        </header>

        {isLoading ? (
          <LoadingSpinner label="Loading your journal..." />
        ) : reflections.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            {reflections.map((ref) => (
              <div key={ref.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontWeight: "var(--weight-semibold)" }}>
                      {new Date(ref.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                    {ref.mood && (
                      <div className="badge badge--teal">{ref.mood}</div>
                    )}
                  </div>
                  <div style={{ color: "var(--text-tertiary)" }} title={ref.isPrivate ? "Private" : "Public"}>
                    {ref.isPrivate ? <LockKey size={16} /> : <Globe size={16} />}
                  </div>
                </div>

                <p style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)", whiteSpace: "pre-wrap", color: "var(--text-primary)" }}>
                  {ref.content}
                </p>

                {ref.bookTitle && (
                  <div style={{ marginTop: "var(--space-4)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--border-light)", display: "inline-flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--forest-sage)" }}>
                    <BookOpenText size={14} weight="duotone" />
                    {ref.bookTitle}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Notebook size={48} />}
            title="Your journal is empty"
            description="Start writing your first reflection today. Your journal is private by default."
          />
        )}
      </div>

      {/* Right Column: Composer */}
      <div style={{ position: "sticky", top: "100px", height: "fit-content" }}>
        <form onSubmit={handleSubmit} className="card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--forest-sage)" }}>
          <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)", fontWeight: "var(--weight-semibold)" }}>New Entry</h3>
          
          <div style={{ marginBottom: "var(--space-4)" }}>
            <label style={{ display: "block", fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)", fontWeight: "var(--weight-bold)" }}>
              How are you feeling?
            </label>
            <MoodSelector value={mood} onChange={setMood} />
          </div>

          <div style={{ marginBottom: "var(--space-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
              <label style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "var(--weight-bold)" }}>
                Prompt
              </label>
              <button 
                type="button" 
                onClick={handleGeneratePrompt}
                disabled={isGeneratingPrompt}
                style={{ background: "none", border: "none", color: "var(--forest-sage)", fontSize: "var(--text-xs)", display: "flex", alignItems: "center", gap: "var(--space-1)", cursor: "pointer", fontWeight: "var(--weight-semibold)" }}
              >
                <Sparkle size={12} weight="fill" /> 
                {isGeneratingPrompt ? "Thinking..." : "New Prompt"}
              </button>
            </div>
            <div style={{ padding: "var(--space-3)", background: "var(--bg-card)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontStyle: "italic", borderLeft: "3px solid var(--forest-sage)" }}>
              &ldquo;{prompt}&rdquo;
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-4)" }}>
            <textarea
              className="input"
              placeholder="Start typing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              style={{ minHeight: "200px", resize: "vertical", background: "var(--bg-card)" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)", cursor: "pointer" }}>
              <input 
                type="checkbox" 
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                style={{ accentColor: "var(--forest-sage)", width: 16, height: 16 }}
              />
              <LockKey size={16} /> Private
            </label>

            <button 
              type="submit" 
              className="btn btn--primary"
              disabled={isSubmitting || content.length < 10}
            >
              {isSubmitting ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
