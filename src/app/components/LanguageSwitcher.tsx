"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, CaretDown, Check } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguage } from "@/i18n/languages";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "nav" | "header" | "compact";
}

export default function LanguageSwitcher({ className, variant = "nav" }: LanguageSwitcherProps) {
  const { language, setLanguage, languages, currentLanguageObj } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setLanguage(code as SupportedLanguage);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        zIndex: 50
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          padding: variant === "compact" ? "0.4rem 0.65rem" : "0.45rem 0.85rem",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          boxShadow: isOpen ? "0 0 0 2px var(--forest-sage-subtle)" : "var(--shadow-xs)"
        }}
      >
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>{currentLanguageObj.flag}</span>
        <span style={{ fontSize: "0.82rem" }}>{currentLanguageObj.nativeName}</span>
        <CaretDown
          size={12}
          weight="bold"
          style={{
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "var(--text-secondary)"
          }}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            width: "210px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-medium)",
            boxShadow: "var(--shadow-lg)",
            padding: "0.35rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.15rem",
            animation: "fadeIn 0.15s ease",
            zIndex: 100
          }}
        >
          <div
            style={{
              padding: "0.4rem 0.65rem 0.35rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-tertiary)",
              borderBottom: "1px solid var(--border-light)",
              marginBottom: "0.2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Globe size={13} weight="bold" />
            <span>Select Language</span>
          </div>

          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => handleSelect(lang.code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.45rem 0.65rem",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: isSelected ? "var(--forest-sage-subtle)" : "transparent",
                  color: isSelected ? "var(--forest-sage)" : "var(--text-primary)",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>{lang.flag}</span>
                  <div>
                    <div style={{ lineHeight: 1.2 }}>{lang.nativeName}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                      {lang.name}
                    </div>
                  </div>
                </div>
                {isSelected && <Check size={14} weight="bold" color="var(--forest-sage)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

