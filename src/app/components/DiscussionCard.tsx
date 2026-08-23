"use client";

import Link from "next/link";
import { TrendUp, ChatTeardropDots, BookOpenText } from "@phosphor-icons/react";

export interface DiscussionCardProps {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorInitial: string;
  discussionType: string;
  bookTitle?: string;
  groupName?: string;
  upvotes: number;
  replyCount: number;
  createdAt: string;
}

const typeColors: Record<string, string> = {
  question: "badge--amber",
  insight: "badge--sage",
  debate: "badge--error",
  reflection: "badge--teal",
  review: "badge--success",
};

export default function DiscussionCard({
  id,
  title,
  content,
  authorName,
  authorInitial,
  discussionType,
  bookTitle,
  groupName,
  upvotes,
  replyCount,
  createdAt,
}: DiscussionCardProps) {
  return (
    <Link href={`/discussions/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card card--interactive">
        {/* Author row */}
        <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-3)", alignItems: "center" }}>
          <div className="avatar avatar--sm">{authorInitial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>
              {authorName}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
              {createdAt}
              {groupName && ` in ${groupName}`}
            </div>
          </div>
          <span className={`badge ${typeColors[discussionType] || "badge--sage"}`}>
            {discussionType}
          </span>
        </div>

        {/* Title & content */}
        <h4 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)", lineHeight: "var(--leading-snug)" }}>
          {title}
        </h4>
        <p style={{
          color: "var(--text-secondary)",
          fontSize: "var(--text-sm)",
          marginBottom: "var(--space-4)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: "var(--leading-relaxed)",
        }}>
          {content}
        </p>

        {/* Book reference */}
        {bookTitle && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--text-xs)",
            color: "var(--forest-sage)",
            background: "rgba(45, 95, 62, 0.06)",
            padding: "var(--space-1) var(--space-3)",
            borderRadius: "var(--radius-full)",
            marginBottom: "var(--space-4)",
          }}>
            <BookOpenText size={14} weight="duotone" />
            {bookTitle}
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: "flex",
          gap: "var(--space-4)",
          borderTop: "1px solid var(--border-light)",
          paddingTop: "var(--space-3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
            <TrendUp size={16} /> {upvotes} Upvotes
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
            <ChatTeardropDots size={16} /> {replyCount} Replies
          </div>
        </div>
      </div>
    </Link>
  );
}
