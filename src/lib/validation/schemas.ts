/**
 * Paradize — Zod Validation Schemas
 *
 * All user input is validated through Zod schemas before
 * reaching the database or AI services.
 */

import { z } from "zod";

/* ─── Auth Schemas ─────────────────────────────────── */
export const signUpSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(128, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must include uppercase, lowercase, and a number"
    ),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be 50 characters or less")
    .trim(),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/* ─── Book Schemas ─────────────────────────────────── */
export const searchBooksSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(200, "Search query is too long")
    .trim(),
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(40).default(20),
});

export const addToShelfSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  status: z.enum(["want_to_read", "reading", "completed", "abandoned"]),
});

export const updateProgressSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  progressPercent: z.number().int().min(0).max(100),
});

export const rateBookSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  rating: z.number().int().min(1).max(5),
});

/* ─── Discussion Schemas ───────────────────────────── */
export const createDiscussionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  content: z
    .string()
    .min(20, "Please write at least 20 characters to start a meaningful discussion")
    .max(10000, "Content is too long (max 10,000 characters)")
    .trim(),
  discussionType: z
    .enum(["question", "insight", "debate", "reflection", "review"])
    .default("insight"),
  bookId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
});

export const createReplySchema = z.object({
  discussionId: z.string().uuid("Invalid discussion ID"),
  content: z
    .string()
    .min(10, "Please write at least 10 characters for a meaningful reply")
    .max(5000, "Reply is too long (max 5,000 characters)")
    .trim(),
  parentReplyId: z.string().uuid().optional(),
});

/* ─── Reflection Schemas ───────────────────────────── */
export const createReflectionSchema = z.object({
  content: z
    .string()
    .min(10, "Please write at least 10 characters")
    .max(10000, "Reflection is too long (max 10,000 characters)")
    .trim(),
  bookId: z.string().uuid().optional(),
  mood: z
    .enum([
      "inspired",
      "thoughtful",
      "confused",
      "challenged",
      "grateful",
      "curious",
      "peaceful",
      "energized",
    ])
    .optional(),
  isPrivate: z.boolean().default(true),
});

/* ─── Profile Schemas ──────────────────────────────── */
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2)
    .max(50)
    .trim()
    .optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  avatarUrl: z.string().url().optional(),
  city: z.string().max(100).optional(),
  readingPreferences: z
    .object({
      genres: z.array(z.string()).max(10).optional(),
      readingSpeed: z.enum(["slow", "moderate", "fast"]).optional(),
      goalBooksPerMonth: z.number().int().min(0).max(50).optional(),
      preferredDiscussionStyle: z
        .enum(["observer", "contributor", "leader"])
        .optional(),
    })
    .optional(),
});

/* ─── Reading Group Schemas ────────────────────────── */
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(100, "Group name must be 100 characters or less")
    .trim(),
  description: z.string().max(1000).optional(),
  maxMembers: z.number().int().min(2).max(50).default(20),
  isPublic: z.boolean().default(true),
  genreFocus: z.array(z.string()).max(5).default([]),
});

/* ─── Report Schemas ───────────────────────────────── */
export const createReportSchema = z.object({
  reportedContentId: z.string().uuid("Invalid content ID"),
  reportedContentType: z.enum(["discussion", "reply", "user", "group"]),
  reason: z.enum(["toxicity", "spam", "harassment", "misinformation", "other"]),
  description: z.string().max(1000).optional(),
});

/* ─── Achievement Schemas ──────────────────────────── */
export const submitAchievementSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  evidence: z
    .string()
    .min(50, "Please write at least 50 characters to show your understanding")
    .max(2000, "Insight is too long (max 2,000 characters)")
    .trim(),
});

/* ─── Onboarding Schemas ───────────────────────────── */
export const onboardingQuizSchema = z.object({
  favoriteGenres: z
    .array(z.string())
    .min(1, "Please select at least one genre")
    .max(5, "Please select up to 5 genres"),
  booksPerMonth: z.enum(["0", "1", "2-3", "4+"]),
  readingStyle: z.enum(["solo", "discuss", "both"]),
  biggestChallenge: z.enum([
    "finding_time",
    "choosing_books",
    "staying_motivated",
    "finding_community",
    "applying_knowledge",
  ]),
  growthGoal: z.string().max(500).optional(),
});

/* ─── Utility ──────────────────────────────────────── */
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>;
export type CreateReplyInput = z.infer<typeof createReplySchema>;
export type CreateReflectionInput = z.infer<typeof createReflectionSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type OnboardingQuizInput = z.infer<typeof onboardingQuizSchema>;
