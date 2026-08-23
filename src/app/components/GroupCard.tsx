"use client";

import Link from "next/link";
import { Users, BookOpenText } from "@phosphor-icons/react";

export interface GroupCardProps {
  id: string;
  name: string;
  description?: string | null;
  memberCount: number;
  maxMembers: number;
  currentBookTitle?: string | null;
  genreFocus?: string[];
  isPublic?: boolean;
}

export default function GroupCard({
  id,
  name,
  description,
  memberCount,
  maxMembers,
  currentBookTitle,
  genreFocus = [],
  isPublic = true,
}: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card card--interactive" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, rgba(45, 95, 62, 0.12), rgba(38, 70, 83, 0.12))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--forest-sage)",
            flexShrink: 0,
          }}>
            <Users size={22} weight="duotone" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: "var(--text-md)",
              fontWeight: "var(--weight-semibold)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {name}
            </h3>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
              {memberCount}/{maxMembers} members
              {!isPublic && " • Private"}
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            lineHeight: "var(--leading-relaxed)",
            marginBottom: "var(--space-4)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {description}
          </p>
        )}

        {/* Genre tags */}
        {genreFocus.length > 0 && (
          <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
            {genreFocus.slice(0, 3).map((genre) => (
              <span key={genre} className="badge badge--teal" style={{ fontSize: "10px" }}>
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Current book */}
        {currentBookTitle && (
          <div style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--text-xs)",
            color: "var(--forest-sage)",
            background: "rgba(45, 95, 62, 0.06)",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
          }}>
            <BookOpenText size={14} weight="duotone" />
            Currently reading: {currentBookTitle}
          </div>
        )}
      </div>
    </Link>
  );
}
