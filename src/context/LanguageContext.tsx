"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
      }
    } catch {
      // Ignore localStorage access restrictions
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (langCode: SupportedLanguage) => {
    if (TRANSLATIONS[langCode]) {
      setLanguageState(langCode);
      try {
        localStorage.setItem(STORAGE_KEY, langCode);
      } catch {
        // Ignore
      }
    }
  };

  const t = (path: string, fallback: string = ""): string => {
    if (!path) return fallback;
    const keys = path.split(".");

    // 1. Try currently selected language
    let current: any = TRANSLATIONS[language];
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }

    if (current !== undefined && current !== null && typeof current === "string") {
      return current;
    }

    // 2. Fallback to English
    let defaultLang: any = TRANSLATIONS[DEFAULT_LANGUAGE];
    for (const key of keys) {
      if (defaultLang && typeof defaultLang === "object" && key in defaultLang) {
        defaultLang = defaultLang[key];
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
        isHydrated
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

