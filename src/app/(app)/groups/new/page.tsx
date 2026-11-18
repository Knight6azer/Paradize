"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { ArrowLeft, Users } from "@phosphor-icons/react";
import Link from "next/link";

const GENRES = [
  "Philosophy",
  "History",
  "Science",
  "Psychology",
  "Fiction",
  "Non-Fiction",
  "Biography",
  "Economics",
  "Poetry",
];

export default function NewGroupPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(20);
  const [isPublic, setIsPublic] = useState(true);
  const [genreFocus, setGenreFocus] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleGenre = (genre: string) => {
    setGenreFocus((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : prev.length < 5
        ? [...prev, genre]
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    if (name.trim().length < 3) {
      setError("Circle name must be at least 3 characters.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          maxMembers: Number(maxMembers),
          isPublic,
          genreFocus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create reading group");
      }

      router.push(`/groups/${data.group.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create reading group");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "720px", margin: "0 auto", padding: "var(--space-6) 0" }}>
      <Link
        href="/groups"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          color: "var(--text-secondary)",
          textDecoration: "none",
          marginBottom: "var(--space-6)",
          fontWeight: "var(--weight-medium)",
          fontSize: "var(--text-sm)",
        }}
      >
        <ArrowLeft size={16} /> Back to Reading Groups
      </Link>

      <header style={{ marginBottom: "var(--space-8)" }}>
        <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>Start a Reading Circle</h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
          Gather an intimate cohort of 5–20 curious minds. Focus on ideas, mutual accountability, and depth.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="card" style={{ padding: "var(--space-8)" }}>
        {error && (
          <div
            style={{
              padding: "var(--space-4)",
              background: "rgba(220, 38, 38, 0.1)",
              color: "var(--error)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--space-6)",
              fontSize: "var(--text-sm)",
            }}
          >
            {error}
          </div>
        )}

        <div className="input-group" style={{ marginBottom: "var(--space-6)" }}>
          <label className="input-label" htmlFor="groupName">Circle Name *</label>
          <input
            id="groupName"
            type="text"
            className="input"
            placeholder="e.g. Stoic Thinkers of Mumbai"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            disabled={isSubmitting}
          />
        </div>

        <div className="input-group" style={{ marginBottom: "var(--space-6)" }}>
          <label className="input-label" htmlFor="groupDesc">Mission & Purpose</label>
          <textarea
            id="groupDesc"
            className="input"
            rows={4}
            placeholder="What will this circle explore together? What reading pace do you expect?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            disabled={isSubmitting}
            style={{ resize: "vertical" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)", marginBottom: "var(--space-6)" }}>
          <div className="input-group">
            <label className="input-label" htmlFor="groupMax">Cohort Capacity (Max Readers)</label>
            <select
              id="groupMax"
              className="input"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              disabled={isSubmitting}
            >
              <option value={5}>5 readers (Micro-circle)</option>
              <option value={10}>10 readers (Intimate)</option>
              <option value={15}>15 readers (Collaborative)</option>
              <option value={20}>20 readers (Full Cohort)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="groupVisibility">Circle Access</label>
            <select
              id="groupVisibility"
              className="input"
              value={isPublic ? "public" : "private"}
              onChange={(e) => setIsPublic(e.target.value === "public")}
              disabled={isSubmitting}
            >
              <option value="public">Public (Open for readers to join)</option>
              <option value="private">Private (Invite only)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "var(--space-8)" }}>
          <label className="input-label" style={{ marginBottom: "var(--space-2)", display: "block" }}>
            Genre Focus (Select up to 5)
          </label>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {GENRES.map((g) => {
              const selected = genreFocus.includes(g);
              return (
                <button
                  type="button"
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`badge ${selected ? "badge--sage" : "badge--outline"}`}
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    cursor: "pointer",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {selected ? `✓ ${g}` : `+ ${g}`}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          style={{ width: "100%", padding: "var(--space-3)" }}
          disabled={isSubmitting}
        >
          <Users size={18} weight="bold" />
          {isSubmitting ? "Creating Reading Circle..." : "Create Reading Circle"}
        </button>
      </form>
    </div>
  );
}
