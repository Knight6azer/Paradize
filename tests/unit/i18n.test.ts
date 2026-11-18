import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LANGUAGES, DEFAULT_LANGUAGE } from "../../src/i18n/languages.ts";
import { TRANSLATIONS } from "../../src/i18n/translations.ts";

describe("Internationalization & Translations — Unit Tests", () => {
  it("should declare all 6 supported languages in catalog", () => {
    const codes = LANGUAGES.map((l) => l.code);
    assert.deepEqual(codes, ["en", "hi", "es", "fr", "de", "bn"]);
    assert.equal(DEFAULT_LANGUAGE, "en");
  });

  it("should have translations dictionary populated for all 6 languages", () => {
    for (const lang of LANGUAGES) {
      assert.ok(
        TRANSLATIONS[lang.code],
        `Translation dictionary missing for language: ${lang.code}`
      );
      assert.ok(
        typeof TRANSLATIONS[lang.code] === "object",
        `Translation dictionary is not an object for language: ${lang.code}`
      );
    }
  });

  it("should contain essential navigation and brand keys across all languages", () => {
    const requiredSections = ["nav", "hero", "showcase", "newsletter", "footer"];

    for (const lang of LANGUAGES) {
      const dict = TRANSLATIONS[lang.code] as Record<string, unknown>;
      for (const section of requiredSections) {
        assert.ok(
          dict[section],
          `Missing section '${section}' in language '${lang.code}'`
        );
      }
    }
  });

  it("should contain authentic brand naming across all translations", () => {
    const expectedBrands: Record<string, string> = {
      en: "Paradize",
      hi: "पैराडाइज़",
      es: "Paradize",
      fr: "Paradize",
      de: "Paradize",
      bn: "প্যারাডাইজ",
    };

    for (const lang of LANGUAGES) {
      const dict = TRANSLATIONS[lang.code] as { nav?: { brand?: string } };
      assert.ok(dict?.nav?.brand, `Missing brand name in language: ${lang.code}`);
      assert.equal(
        dict?.nav?.brand,
        expectedBrands[lang.code],
        `Brand name mismatch in language: ${lang.code}`
      );
    }
  });
});
