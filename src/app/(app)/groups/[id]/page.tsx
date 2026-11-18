"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "@/lib/auth/client";
import {
  Users,
  BookOpenText,
  ArrowLeft,
  Plus,
  SignOut,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  ChatCircleDots,
} from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EmptyState from "@/app/components/EmptyState";
import { useRouter } from "next/navigation";

interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  maxMembers: number;
  genreFocus: string[];
  isPublic: boolean;
  healthScore: number;
  city: string;
  createdBy: string;
  createdAt: string;
  currentBookId?: string | null;
  currentBookTitle?: string | null;
  currentBookCover?: string | null;
  currentBookAuthors?: string[] | null;
}

interface Member {
  userId: string;
  name: string;
  username: string;
  image: string | null;
  role: "leader" | "moderator" | "member";
  joinedAt: string;
}

interface GroupDiscussion {
  id: string;
  title: string;
  discussionType: string;
  replyCount: number;
  createdAt: string;
  authorName: string;
}

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const fetchGroup = useCallback(async () => {
    try {
      const res = await fetch(`/api/groups/${id}`);
      if (res.ok) {
        const data = await res.json();
        setGroup(data.group);
        setMembers(data.members || []);
        setDiscussions(data.discussions || []);
      } else {
        setError("Reading group not found");
      }
    } catch {
      setError("Failed to load reading group");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/groups/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return;
        if (data?.group) {
          setGroup(data.group);
          setMembers(data.members || []);
          setDiscussions(data.discussions || []);
        } else {
          setError("Reading group not found");
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to load reading group");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isMember = members.some((m) => m.userId === session?.user?.id);
  const isLeader = group?.createdBy === session?.user?.id;
  const isFull = (group?.memberCount || 0) >= (group?.maxMembers || 20);

  const handleJoin = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg("Welcome to the reading circle!");
        fetchGroup();
      } else {
        setError(data.error || "Failed to join group");
      }
    } catch {
      setError("Failed to join group");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!session?.user?.id) return;

    if (!confirm("Are you sure you want to leave this reading circle?")) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeedbackMsg("You have left the reading circle.");
        fetchGroup();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to leave group");
      }
    } catch {
      setError("Failed to leave group");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading reading circle..." />;

  if (error && !group) {
    return (
      <EmptyState
        icon={<Users size={48} />}
        title="Group Not Found"
        description={error || "The reading group you are looking for does not exist."}
        action={{
          label: "Back to Groups",
          href: "/groups",
        }}
      />
    );
  }

  if (!group) return null;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      {/* Back link */}
      <div>
        <Link
          href="/groups"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            color: "var(--text-secondary)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-medium)",
          }}
        >
          <ArrowLeft size={16} /> Back to Reading Groups
        </Link>
      </div>

      {feedbackMsg && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            background: "rgba(45, 95, 62, 0.1)",
            border: "1px solid var(--forest-sage)",
            color: "var(--forest-sage)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--text-sm)",
          }}
        >
          <CheckCircle size={18} weight="fill" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Group Header Hero */}
      <div
        className="card"
        style={{
          padding: "var(--space-8)",
          background: "linear-gradient(135deg, var(--bg-card), var(--bg-secondary))",
          border: "1px solid var(--border-light)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--radius-xl)",
                background: "linear-gradient(135deg, var(--forest-sage), var(--deep-teal))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              <Users size={32} weight="duotone" />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-1)" }}>
                <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>
                  {group.name}
                </h1>
                <span className={`badge ${group.isPublic ? "badge--teal" : "badge--amber"}`}>
                  {group.isPublic ? "Public Circle" : "Private Circle"}
                </span>
                <span className="badge badge--outline">📍 {group.city}</span>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", maxWidth: "600px", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-3)" }}>
                {group.description || "An intimate cohort of thoughtful readers exploring transformative ideas."}
              </p>

              {group.genreFocus && group.genreFocus.length > 0 && (
                <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap" }}>
                  {group.genreFocus.map((genre) => (
                    <span key={genre} className="badge badge--sage" style={{ fontSize: "11px" }}>
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action button */}
          <div>
            {isMember ? (
              <button
                className="btn btn--secondary"
                onClick={handleLeave}
                disabled={actionLoading || isLeader}
                title={isLeader ? "Leaders cannot leave their group directly" : "Leave Circle"}
              >
                <SignOut size={16} />
                {isLeader ? "Circle Leader" : "Leave Circle"}
              </button>
            ) : isFull ? (
              <span className="badge badge--amber" style={{ padding: "var(--space-2) var(--space-4)" }}>
                Circle Full (20/20)
              </span>
            ) : (
              <button
                className="btn btn--primary"
                onClick={handleJoin}
                disabled={actionLoading}
              >
                <UserPlus size={16} weight="bold" />
                Join Circle
              </button>
            )}
          </div>
        </div>

        {/* Member Cap Bar */}
        <div style={{ marginTop: "var(--space-6)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
          <span>Cohort Capacity: {group.memberCount} of {group.maxMembers} readers</span>
          <span>Target Size: 5–20 readers for deep engagement</span>
        </div>
      </div>

      {/* Grid: Current Book + Member Roster */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
        {/* Current Book Reading */}
        <div className="card" style={{ padding: "var(--space-6)" }}>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <BookOpenText size={20} color="var(--forest-sage)" />
            Currently Reading Together
          </h2>

          {group.currentBookTitle ? (
            <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
              {group.currentBookCover ? (
                <div style={{ width: 70, height: 105, position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", flexShrink: 0 }}>
                  <Image
                    src={group.currentBookCover}
                    alt={group.currentBookTitle}
                    fill
                    sizes="70px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div style={{ width: 70, height: 105, background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  📖
                </div>
              )}
              <div>
                <h3 style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-1)" }}>
                  {group.currentBookTitle}
                </h3>
                {group.currentBookAuthors && (
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-3)" }}>
                    {group.currentBookAuthors.join(", ")}
                  </p>
                )}
                {group.currentBookId && (
                  <Link href={`/discover/${group.currentBookId}`} className="btn btn--ghost btn--sm">
                    View Book Details →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)", fontStyle: "italic" }}>
              No current book selected for this cycle. The circle leader will assign the next reading shortly.
            </p>
          )}
        </div>

        {/* Member Roster */}
        <div className="card" style={{ padding: "var(--space-6)" }}>
          <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Users size={20} color="var(--forest-sage)" />
            Circle Members ({members.length})
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxHeight: "280px", overflowY: "auto" }}>
            {members.map((m) => (
              <div
                key={m.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--space-2) 0",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--bg-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      color: "var(--forest-sage)",
                    }}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <Link
                      href={`/profile/${m.username}`}
                      style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", textDecoration: "none" }}
                    >
                      {m.name}
                    </Link>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>@{m.username}</div>
                  </div>
                </div>

                <span
                  className={`badge ${
                    m.role === "leader"
                      ? "badge--sage"
                      : m.role === "moderator"
                      ? "badge--teal"
                      : "badge--outline"
                  }`}
                  style={{ fontSize: "10px" }}
                >
                  {m.role === "leader" && <ShieldCheck size={12} style={{ marginRight: 4 }} />}
                  {m.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Circle Discussions */}
      <div className="card" style={{ padding: "var(--space-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
          <h2 style={{ fontSize: "var(--text-lg)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <ChatCircleDots size={20} color="var(--forest-sage)" />
            Circle Discussions
          </h2>
          <Link
            href={`/discussions/new?groupId=${group.id}`}
            className="btn btn--primary btn--sm"
          >
            <Plus size={14} weight="bold" />
            Start Discussion
          </Link>
        </div>

        {discussions.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {discussions.map((d) => (
              <Link
                key={d.id}
                href={`/discussions/${d.id}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div>
                  <div style={{ fontWeight: "var(--weight-semibold)", fontSize: "var(--text-sm)" }}>{d.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: "2px" }}>
                    By {d.authorName} • {d.discussionType}
                  </div>
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                  {d.replyCount} {d.replyCount === 1 ? "reply" : "replies"}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)", fontStyle: "italic", padding: "var(--space-4) 0" }}>
            No discussions in this circle yet. Start the first conversation!
          </p>
        )}
      </div>
    </div>
  );
}
