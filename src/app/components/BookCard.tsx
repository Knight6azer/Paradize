"use client";

import Link from "next/link";
import Image from "next/image";
import { BookmarkSimple, Star } from "@phosphor-icons/react";

export interface BookCardProps {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string | null;
  genres?: string[];
  pageCount?: number | null;
  description?: string | null;
  progress?: number;
  status?: "want_to_read" | "reading" | "completed" | "abandoned";
  onAddToShelf?: (status: string) => void;
  showActions?: boolean;
  linkTo?: string;
}

export default function BookCard({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  title,
  authors,
  coverUrl,
  genres = [],
  description,
  progress,
  status,
  onAddToShelf,
  showActions = true,
  linkTo,
}: BookCardProps) {
  const content = (
    <div className="card card--interactive" style={{
      display: "flex",
      gap: "var(--space-4)",
      padding: "var(--space-4)",
      height: "100%",
    }}>
      {/* Book Cover */}
      <div style={{
        width: "80px",
        height: "120px",
        borderRadius: "var(--radius-md)",
        flexShrink: 0,
        overflow: "hidden",
        background: "var(--bg-tertiary)",
      }}>
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            width={80}
            height={120}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-tertiary)",
            fontSize: "var(--text-xs)",
            textAlign: "center",
            padding: "var(--space-2)",
            fontFamily: "var(--font-reading)",
          }}>
            {title}
          </div>
        )}
      </div>

      {/* Book Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <h3 style={{
          fontSize: "var(--text-md)",
          fontWeight: "var(--weight-semibold)",
          marginBottom: "var(--space-1)",
          lineHeight: "var(--leading-snug)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: "var(--text-sm)",
          color: "var(--text-secondary)",
          marginBottom: "var(--space-2)",
        }}>
          {authors.join(", ")}
        </p>

        {/* Genre tags */}
        {genres.length > 0 && (
          <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap", marginBottom: "var(--space-2)" }}>
            {genres.slice(0, 2).map((genre) => (
              <span key={genre} className="badge badge--teal" style={{ fontSize: "10px" }}>
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {description && !status && (
          <p style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-tertiary)",
            lineHeight: "var(--leading-relaxed)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            marginBottom: "auto",
          }}>
            {description}
          </p>
        )}

        {/* Progress bar for reading status */}
        {status === "reading" && progress !== undefined && (
          <div style={{ marginTop: "auto", paddingTop: "var(--space-3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)" }}>
              <span style={{ color: "var(--text-secondary)" }}>Progress</span>
              <span style={{ fontWeight: "var(--weight-semibold)", color: "var(--forest-sage)" }}>{progress}%</span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "var(--forest-sage)", borderRadius: "var(--radius-full)", transition: "width 0.3s ease" }} />
            </div>
          </div>
        )}

        {/* Completed badge */}
        {status === "completed" && (
          <div style={{ marginTop: "auto", paddingTop: "var(--space-3)" }}>
            <span className="badge badge--success">
              <Star size={12} weight="fill" /> Completed
            </span>
          </div>
        )}

        {/* Add to shelf actions */}
        {showActions && !status && onAddToShelf && (
          <div style={{ marginTop: "auto", paddingTop: "var(--space-3)" }}>
            <button
              className="btn btn--primary btn--sm"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToShelf("want_to_read"); }}
              style={{ width: "100%" }}
            >
              <BookmarkSimple size={14} weight="bold" />
              Add to Shelf
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link href={linkTo} style={{ textDecoration: "none", color: "inherit" }}>{content}</Link>;
  }

  return content;
}
