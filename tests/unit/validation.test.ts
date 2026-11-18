import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  signUpSchema,
  signInSchema,
  searchBooksSchema,
  createDiscussionSchema,
  createReplySchema,
  createReflectionSchema,
  createGroupSchema,
  updateProfileSchema,
} from "../../src/lib/validation/schemas.ts";

describe("Validation Schemas — Unit Tests", () => {
  describe("signUpSchema", () => {
    it("should accept valid registration input", () => {
      const valid = {
        email: "reader@paradize.in",
        password: "Password123",
        username: "curious_reader",
        displayName: "Curious Reader",
      };
      const result = signUpSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("should reject invalid email", () => {
      const invalid = {
        email: "not-an-email",
        password: "Password123",
        username: "curious_reader",
        displayName: "Curious Reader",
      };
      const result = signUpSchema.safeParse(invalid);
      assert.equal(result.success, false);
      assert.ok(result.error?.issues.some((i) => i.path.includes("email")));
    });

    it("should reject weak password without uppercase or numbers", () => {
      const invalid = {
        email: "reader@paradize.in",
        password: "passwordonly",
        username: "curious_reader",
        displayName: "Curious Reader",
      };
      const result = signUpSchema.safeParse(invalid);
      assert.equal(result.success, false);
      assert.ok(result.error?.issues.some((i) => i.path.includes("password")));
    });

    it("should reject invalid characters in username", () => {
      const invalid = {
        email: "reader@paradize.in",
        password: "Password123",
        username: "user@name!",
        displayName: "User Name",
      };
      const result = signUpSchema.safeParse(invalid);
      assert.equal(result.success, false);
      assert.ok(result.error?.issues.some((i) => i.path.includes("username")));
    });
  });

  describe("signInSchema", () => {
    it("should accept valid credentials", () => {
      const valid = {
        email: "reader@paradize.in",
        password: "MySecurePassword123!",
      };
      const result = signInSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("should reject empty password", () => {
      const invalid = {
        email: "reader@paradize.in",
        password: "",
      };
      const result = signInSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("searchBooksSchema", () => {
    it("should parse and apply pagination defaults", () => {
      const result = searchBooksSchema.safeParse({ query: "Stoicism" });
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.query, "Stoicism");
        assert.equal(result.data.page, 0);
        assert.equal(result.data.limit, 20);
      }
    });

    it("should reject blank search query", () => {
      const result = searchBooksSchema.safeParse({ query: "   " });
      assert.equal(result.success, false);
    });
  });

  describe("createDiscussionSchema", () => {
    it("should accept valid discussion with insightful content", () => {
      const valid = {
        title: "The Ethics of Stoic Acceptance",
        content: "In Meditations, Marcus Aurelius explores the dichotomy of control. How does this apply to modern distractions?",
        discussionType: "insight",
      };
      const result = createDiscussionSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("should reject discussions with shallow content under 20 chars", () => {
      const invalid = {
        title: "Short Title",
        content: "Too short",
        discussionType: "question",
      };
      const result = createDiscussionSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("should reject invalid discussion types", () => {
      const invalid = {
        title: "Valid Discussion Title",
        content: "This content is definitely long enough to pass validation.",
        discussionType: "flame_war",
      };
      const result = createDiscussionSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("createReplySchema", () => {
    it("should accept valid reply", () => {
      const valid = {
        discussionId: "123e4567-e89b-12d3-a456-426614174000",
        content: "This is a thoughtful reply that adds perspective to the discussion.",
      };
      const result = createReplySchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("should reject shallow reply under 10 chars", () => {
      const invalid = {
        discussionId: "123e4567-e89b-12d3-a456-426614174000",
        content: "Agree +1",
      };
      const result = createReplySchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it("should reject invalid discussion UUID", () => {
      const invalid = {
        discussionId: "not-a-valid-uuid",
        content: "This reply has enough text but the discussion ID is invalid.",
      };
      const result = createReplySchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("createReflectionSchema", () => {
    it("should accept valid private reflection with supported mood", () => {
      const valid = {
        content: "Today I realized that changing my mind is not a defeat, but a necessary condition of intellectual growth.",
        mood: "thoughtful",
        isPrivate: true,
      };
      const result = createReflectionSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("should reject reflections with unsupported mood enum", () => {
      const invalid = {
        content: "Today I realized something interesting about human behavior.",
        mood: "toxic_rage",
      };
      const result = createReflectionSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("createGroupSchema", () => {
    it("should accept cohort size within target limit (5-20)", () => {
      const valid = {
        name: "Mumbai Philosophy Circle",
        description: "Reading classics together every Sunday.",
        maxMembers: 15,
        genreFocus: ["Philosophy", "History"],
      };
      const result = createGroupSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it("should reject group names under 3 chars", () => {
      const invalid = {
        name: "AB",
        maxMembers: 10,
      };
      const result = createGroupSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });
  });

  describe("updateProfileSchema", () => {
    it("should accept valid profile updates", () => {
      const valid = {
        displayName: "Om Tiwari",
        bio: "Curious reader exploring cognitive psychology and philosophy.",
        city: "Mumbai",
        readingPreferences: {
          genres: ["Philosophy", "Psychology"],
          readingSpeed: "moderate",
          goalBooksPerMonth: 3,
        },
      };
      const result = updateProfileSchema.safeParse(valid);
      assert.equal(result.success, true);
    });
  });
});
