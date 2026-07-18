import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  real,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ═══════════════════════════════════════════════════
   PARADIZE — Database Schema (Drizzle ORM)
   ═══════════════════════════════════════════════════ */

/* ─── Enums ────────────────────────────────────────── */
export const bookStatusEnum = pgEnum("book_status", [
  "want_to_read",
  "reading",
  "completed",
  "abandoned",
]);

export const reputationLevelEnum = pgEnum("reputation_level", [
  "reader",
  "conversationalist",
  "inquirer",
  "cultivator",
  "scholar",
  "luminary",
  "torchbearer",
]);

export const discussionTypeEnum = pgEnum("discussion_type", [
  "question",
  "insight",
  "debate",
  "reflection",
  "review",
]);

export const groupRoleEnum = pgEnum("group_role", [
  "member",
  "moderator",
  "leader",
]);

export const moodEnum = pgEnum("mood", [
  "inspired",
  "thoughtful",
  "confused",
  "challenged",
  "grateful",
  "curious",
  "peaceful",
  "energized",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "book_club_meeting",
  "author_qa",
  "debate",
  "workshop",
  "celebration",
  "meetup",
]);

export const reputationEventTypeEnum = pgEnum("reputation_event_type", [
  "thoughtful_question",
  "constructive_feedback",
  "evidence_based_thinking",
  "respectful_disagreement",
  "helped_others",
  "consistency",
  "reflection",
  "curiosity",
  "mentorship",
  "contribution",
]);

export const reportReasonEnum = pgEnum("report_reason", [
  "toxicity",
  "spam",
  "harassment",
  "misinformation",
  "other",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "reviewed",
  "action_taken",
  "dismissed",
]);

export const challengeTypeEnum = pgEnum("challenge_type", [
  "books_count",
  "genre_explore",
  "discussion_depth",
  "reflection",
]);

/* ─── Better Auth Tables ─────────────────────────────── */
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

/* ─── Users (Extended for Better Auth) ─────────────── */
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    username: text("username").notNull().unique(),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio").default(""),
    city: text("city").default("Mumbai"),
    readingPreferences: jsonb("reading_preferences").default({}),
    reputationPoints: integer("reputation_points").default(0).notNull(),
    reputationLevel: reputationLevelEnum("reputation_level")
      .default("reader")
      .notNull(),
    growthScore: integer("growth_score").default(0).notNull(),
    onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    isBanned: boolean("is_banned").default(false).notNull(),
    banReason: text("ban_reason"),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_users_username").on(table.username),
    index("idx_users_reputation").on(table.reputationPoints),
  ]
);

/* ─── Books ────────────────────────────────────────── */
export const books = pgTable(
  "books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    isbn: text("isbn").unique(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    authors: text("authors").array().notNull(),
    description: text("description"),
    coverUrl: text("cover_url"),
    genres: text("genres").array().default([]),
    pageCount: integer("page_count"),
    publishedDate: text("published_date"),
    publisher: text("publisher"),
    language: text("language").default("en"),
    avgCommunityRating: real("avg_community_rating").default(0),
    totalReaders: integer("total_readers").default(0),
    totalDiscussions: integer("total_discussions").default(0),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_books_isbn").on(table.isbn),
  ]
);

/* ─── User Books (Reading Shelf) ───────────────────── */
export const userBooks = pgTable(
  "user_books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    status: bookStatusEnum("status").default("want_to_read").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    personalRating: integer("personal_rating"),
    isFavorite: boolean("is_favorite").default(false),
    progressPercent: integer("progress_percent").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_user_books_unique").on(table.userId, table.bookId),
    index("idx_user_books_user").on(table.userId),
    index("idx_user_books_status").on(table.userId, table.status),
  ]
);

/* ─── Reading Groups ───────────────────────────────── */
export const readingGroups = pgTable("reading_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coverUrl: text("cover_url"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  currentBookId: uuid("current_book_id").references(() => books.id),
  maxMembers: integer("max_members").default(20),
  isPublic: boolean("is_public").default(true),
  genreFocus: text("genre_focus").array().default([]),
  discussionSchedule: jsonb("discussion_schedule").default({}),
  memberCount: integer("member_count").default(1),
  healthScore: real("health_score").default(100),
  city: text("city").default("Mumbai"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ─── Group Members ────────────────────────────────── */
export const groupMembers = pgTable(
  "group_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => readingGroups.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: groupRoleEnum("role").default("member"),
    contributionsCount: integer("contributions_count").default(0),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_group_members_unique").on(table.groupId, table.userId),
  ]
);

/* ─── Discussions ──────────────────────────────────── */
export const discussions = pgTable(
  "discussions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    groupId: uuid("group_id").references(() => readingGroups.id, {
      onDelete: "set null",
    }),
    bookId: uuid("book_id").references(() => books.id, { onDelete: "set null" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    discussionType: discussionTypeEnum("discussion_type").default("insight"),
    qualityScore: real("quality_score").default(0),
    upvotes: integer("upvotes").default(0),
    thoughtfulCount: integer("thoughtful_count").default(0),
    replyCount: integer("reply_count").default(0),
    isPinned: boolean("is_pinned").default(false),
    isLocked: boolean("is_locked").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_discussions_book").on(table.bookId),
    index("idx_discussions_group").on(table.groupId),
    index("idx_discussions_author").on(table.authorId),
    index("idx_discussions_quality").on(table.qualityScore),
  ]
);

/* ─── Discussion Replies ───────────────────────────── */
export const discussionReplies = pgTable(
  "discussion_replies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    discussionId: uuid("discussion_id")
      .notNull()
      .references(() => discussions.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    parentReplyId: uuid("parent_reply_id"),
    content: text("content").notNull(),
    qualityScore: real("quality_score").default(0),
    isEvidenceBased: boolean("is_evidence_based").default(false),
    respectfulnessScore: real("respectfulness_score").default(1.0),
    upvotes: integer("upvotes").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_replies_discussion").on(table.discussionId),
  ]
);

/* ─── Reflections (Private Journal) ────────────────── */
export const reflections = pgTable(
  "reflections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: uuid("book_id").references(() => books.id),
    content: text("content").notNull(),
    mood: moodEnum("mood"),
    isPrivate: boolean("is_private").default(true),
    growthTags: text("growth_tags").array().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_reflections_user").on(table.userId)]
);

/* ─── Achievements ─────────────────────────────────── */
export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementType: text("achievement_type").notNull(),
  bookId: uuid("book_id").references(() => books.id),
  title: text("title").notNull(),
  description: text("description"),
  evidence: text("evidence"),
  evidenceVerified: boolean("evidence_verified").default(false),
  badgeIcon: text("badge_icon"),
  earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow(),
  isDisplayed: boolean("is_displayed").default(true),
});

/* ─── Reputation Events ────────────────────────────── */
export const reputationEvents = pgTable(
  "reputation_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventType: reputationEventTypeEnum("event_type").notNull(),
    points: integer("points").notNull(),
    sourceId: uuid("source_id"),
    sourceType: text("source_type"),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_reputation_user").on(table.userId)]
);

/* ─── Events ───────────────────────────────────────── */
export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  eventType: eventTypeEnum("event_type").default("book_club_meeting"),
  hostId: uuid("host_id")
    .notNull()
    .references(() => users.id),
  groupId: uuid("group_id").references(() => readingGroups.id),
  bookId: uuid("book_id").references(() => books.id),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  maxParticipants: integer("max_participants").default(50),
  isVirtual: boolean("is_virtual").default(true),
  meetingUrl: text("meeting_url"),
  location: text("location"),
  participantCount: integer("participant_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ─── Notifications ────────────────────────────────── */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    message: text("message"),
    actionUrl: text("action_url"),
    isRead: boolean("is_read").default(false),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_notifications_user").on(table.userId, table.isRead)]
);

/* ─── Reports ──────────────────────────────────────── */
export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterId: uuid("reporter_id")
    .notNull()
    .references(() => users.id),
  reportedContentId: uuid("reported_content_id").notNull(),
  reportedContentType: text("reported_content_type").notNull(),
  reason: reportReasonEnum("reason").notNull(),
  description: text("description"),
  status: reportStatusEnum("status").default("pending"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  actionTaken: text("action_taken"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ─── Reading Challenges ───────────────────────────── */
export const readingChallenges = pgTable("reading_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  challengeType: challengeTypeEnum("challenge_type").default("books_count"),
  targetValue: integer("target_value").notNull(),
  durationDays: integer("duration_days").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  participantCount: integer("participant_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userChallenges = pgTable(
  "user_challenges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => readingChallenges.id, { onDelete: "cascade" }),
    progress: integer("progress").default(0),
    completed: boolean("completed").default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_user_challenges_unique").on(table.userId, table.challengeId),
  ]
);

/* ─── Messages ─────────────────────────────────────── */
export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("idx_conv_participants").on(table.conversationId, table.userId),
  ]
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_messages_conversation").on(table.conversationId)]
);

/* ─── Knowledge Connections ────────────────────────── */
export const knowledgeConnections = pgTable("knowledge_connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bookAId: uuid("book_a_id")
    .notNull()
    .references(() => books.id),
  bookBId: uuid("book_b_id")
    .notNull()
    .references(() => books.id),
  connectionType: text("connection_type").default("theme"),
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ─── Audit Log ────────────────────────────────────── */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => users.id),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: uuid("target_id"),
    details: jsonb("details").default({}),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("idx_audit_actor").on(table.actorId)]
);

/* ─── Relations ────────────────────────────────────── */
export const usersRelations = relations(users, ({ many }) => ({
  userBooks: many(userBooks),
  discussions: many(discussions),
  reflections: many(reflections),
  achievements: many(achievements),
  reputationEvents: many(reputationEvents),
  notifications: many(notifications),
  groupMemberships: many(groupMembers),
}));

export const booksRelations = relations(books, ({ many }) => ({
  userBooks: many(userBooks),
  discussions: many(discussions),
}));

export const userBooksRelations = relations(userBooks, ({ one }) => ({
  user: one(users, { fields: [userBooks.userId], references: [users.id] }),
  book: one(books, { fields: [userBooks.bookId], references: [books.id] }),
}));

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  author: one(users, { fields: [discussions.authorId], references: [users.id] }),
  book: one(books, { fields: [discussions.bookId], references: [books.id] }),
  group: one(readingGroups, {
    fields: [discussions.groupId],
    references: [readingGroups.id],
  }),
  replies: many(discussionReplies),
}));

export const discussionRepliesRelations = relations(
  discussionReplies,
  ({ one }) => ({
    discussion: one(discussions, {
      fields: [discussionReplies.discussionId],
      references: [discussions.id],
    }),
    author: one(users, {
      fields: [discussionReplies.authorId],
      references: [users.id],
    }),
  })
);

export const readingGroupsRelations = relations(
  readingGroups,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [readingGroups.createdBy],
      references: [users.id],
    }),
    currentBook: one(books, {
      fields: [readingGroups.currentBookId],
      references: [books.id],
    }),
    members: many(groupMembers),
    discussions: many(discussions),
  })
);

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(readingGroups, {
    fields: [groupMembers.groupId],
    references: [readingGroups.id],
  }),
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
}));
