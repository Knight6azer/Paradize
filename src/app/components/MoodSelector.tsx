"use client";

import { useState } from "react";

const MOODS = [
  { value: "inspired", emoji: "✨", label: "Inspired" },
  { value: "thoughtful", emoji: "🤔", label: "Thoughtful" },
  { value: "confused", emoji: "😵‍💫", label: "Confused" },
  { value: "challenged", emoji: "💪", label: "Challenged" },
  { value: "grateful", emoji: "🙏", label: "Grateful" },
  { value: "curious", emoji: "🔍", label: "Curious" },
  { value: "peaceful", emoji: "☮️", label: "Peaceful" },
  { value: "energized", emoji: "⚡", label: "Energized" },
] as const;

type MoodValue = typeof MOODS[number]["value"];

interface MoodSelectorProps {
  value?: string;
  onChange: (mood: string) => void;
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onChange(mood.value)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-full)",
            fontSize: "var(--text-sm)",
            fontWeight: value === mood.value ? "var(--weight-semibold)" : "var(--weight-medium)",
            background: value === mood.value ? "rgba(45, 95, 62, 0.1)" : "var(--bg-secondary)",
            color: value === mood.value ? "var(--forest-sage)" : "var(--text-secondary)",
            border: value === mood.value ? "1.5px solid var(--forest-sage)" : "1.5px solid transparent",
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          <span>{mood.emoji}</span>
          {mood.label}
        </button>
      ))}
    </div>
  );
}

export { MOODS };
export type { MoodValue };
