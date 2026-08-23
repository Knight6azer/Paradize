"use client";

import { SpinnerGap } from "@phosphor-icons/react";

interface LoadingSpinnerProps {
  size?: number;
  label?: string;
}

export default function LoadingSpinner({ size = 32, label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-3)",
      padding: "var(--space-12) 0",
      color: "var(--text-tertiary)",
    }}>
      <SpinnerGap
        size={size}
        weight="bold"
        style={{ animation: "rotate-slow 1s linear infinite" }}
      />
      {label && (
        <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>
          {label}
        </span>
      )}
    </div>
  );
}
