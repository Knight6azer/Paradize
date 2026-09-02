"use client";

import { useEffect } from "react";
import { WarningCircle } from "@phosphor-icons/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "var(--space-8)",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "var(--radius-full)",
          background: "rgba(220, 38, 38, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "var(--space-6)",
        }}
      >
        <WarningCircle size={36} weight="duotone" color="#dc2626" />
      </div>

      <h2
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: "var(--weight-bold)",
          marginBottom: "var(--space-3)",
        }}
      >
        Something went wrong
      </h2>

      <p
        style={{
          color: "var(--text-secondary)",
          maxWidth: "420px",
          marginBottom: "var(--space-8)",
          lineHeight: "var(--leading-relaxed)",
        }}
      >
        An unexpected error occurred. This has been logged and we&apos;ll look
        into it. You can try again or head back to the dashboard.
      </p>

      <div style={{ display: "flex", gap: "var(--space-4)" }}>
        <button onClick={reset} className="btn btn--primary">
          Try Again
        </button>
        <a href="/dashboard" className="btn btn--secondary">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
