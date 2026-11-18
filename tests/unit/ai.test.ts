import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractJsonFromResponse } from "../../src/lib/ai/index.ts";

describe("AI Service Resilience & Parsing — Unit Tests", () => {
  it("should extract JSON from clean JSON string", () => {
    const raw = '[{"title":"Sapiens","author":"Yuval Noah Harari"}]';
    const result = extractJsonFromResponse(raw, []);
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
    assert.equal((result[0] as { title: string }).title, "Sapiens");
  });

  it("should extract JSON wrapped in markdown code blocks", () => {
    const raw = '```json\n[{"title":"Meditations","author":"Marcus Aurelius"}]\n```';
    const result = extractJsonFromResponse(raw, []);
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
    assert.equal((result[0] as { title: string }).title, "Meditations");
  });

  it("should extract JSON embedded within explanatory conversational text", () => {
    const raw = `Here are your recommended books for intellectual growth:
[
  {
    "title": "Thinking, Fast and Slow",
    "author": "Daniel Kahneman",
    "reason": "Examines cognitive bias and heuristics",
    "question": "How do mental shortcuts bias your perceptions?"
  }
]
I hope these inspire your reading journey!`;

    const result = extractJsonFromResponse(raw, []);
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
    assert.equal((result[0] as { title: string }).title, "Thinking, Fast and Slow");
  });

  it("should return fallback when given non-JSON text or API error string", () => {
    const raw = "[AI temporarily unavailable]";
    const fallback = [{ title: "Default Book", author: "Default Author" }];
    const result = extractJsonFromResponse(raw, fallback);
    assert.deepEqual(result, fallback);
  });

  it("should parse single object JSON format cleanly", () => {
    const raw = '{"score": 8, "feedback": "Great evidence-based insight."}';
    const result = extractJsonFromResponse(raw, { score: 0, feedback: "" });
    assert.equal(result.score, 8);
    assert.equal(result.feedback, "Great evidence-based insight.");
  });
});
