"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      textAlign: "center",
      padding: "var(--space-16) var(--space-6)",
      background: "var(--bg-card)",
      borderRadius: "var(--radius-xl)",
      border: "1px dashed var(--border-medium)",
    }}>
      <div style={{ color: "var(--text-tertiary)", marginBottom: "var(--space-4)", display: "flex", justifyContent: "center" }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", marginBottom: action ? "var(--space-6)" : "0", maxWidth: "400px", margin: "0 auto", lineHeight: "var(--leading-relaxed)" }}>
        {description}
      </p>
      {action && (
        <div style={{ marginTop: "var(--space-6)" }}>
          {action.href ? (
            <a href={action.href} className="btn btn--primary">{action.label}</a>
          ) : (
            <button className="btn btn--primary" onClick={action.onClick}>{action.label}</button>
          )}
        </div>
      )}
    </div>
  );
}
