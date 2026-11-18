"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { LANGUAGES, DEFAULT_LANGUAGE, LanguageOption, SupportedLanguage } from "../i18n/languages";
import { TRANSLATIONS } from "../i18n/translations";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string, fallback?: string) => string;
  languages: LanguageOption[];
  currentLanguageObj: LanguageOption;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "paradize_language";

function getSavedLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (saved && saved in TRANSLATIONS) {
      return saved;
    }
  } catch {
    // Ignore localStorage access restrictions
  }
  return DEFAULT_LANGUAGE;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore<SupportedLanguage>(
    subscribe,
    getSavedLanguage,
    () => DEFAULT_LANGUAGE
  );

  const setLanguage = (langCode: SupportedLanguage) => {
    if (langCode in TRANSLATIONS) {
      try {
        localStorage.setItem(STORAGE_KEY, langCode);
      } catch {
        // Ignore
      }
      listeners.forEach((listener) => listener());
    }
  };

  const t = (path: string, fallback: string = ""): string => {
    if (!path) return fallback;
    const keys = path.split(".");

    // 1. Try currently selected language
    let current: unknown = TRANSLATIONS[language];
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        current = undefined;
        break;
      }
    }

    if (current !== undefined && current !== null && typeof current === "string") {
      return current;
    }

    // 2. Fallback to English
    let defaultLang: unknown = TRANSLATIONS[DEFAULT_LANGUAGE];
    for (const key of keys) {
      if (defaultLang && typeof defaultLang === "object" && key in defaultLang) {
        defaultLang = (defaultLang as Record<string, unknown>)[key];
      } else {
        defaultLang = undefined;
        break;
      }
    }

    if (defaultLang !== undefined && defaultLang !== null && typeof defaultLang === "string") {
      return defaultLang;
    }

    return fallback || path;
  };

  const currentLanguageObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
        currentLanguageObj,
        isHydrated: true,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

