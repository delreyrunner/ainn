import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

// =============================================================================
// AUTH (Better Auth managed tables — do not modify structure)
// =============================================================================

// Better Auth creates "user", "session", "account", "verification" tables
// automatically. We extend the user table with a role column via databaseHooks.

// =============================================================================
// ARTICLES
// =============================================================================

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  status: text("status").notNull().default("draft"), // draft, review, live, archived
  headline: text("headline").notNull(),
  dek: text("dek"), // subheadline
  body: text("body"), // markdown content
  section: text("section").notNull().default("general"), // models, benchmarks, sentiment, infrastructure
  verificationMark: text("verification_mark").notNull().default("unconfirmed"), // verified, claim, reported, unconfirmed
  byline: text("byline").notNull().default("AINN Research Desk"),
  datePublished: timestamp("date_published", { withTimezone: true }),
  dateModified: timestamp("date_modified", { withTimezone: true }),
  sources: jsonb("sources").default([]), // array of source citations
  ogImageUrl: text("og_image_url"),
  relatedArticleIds: jsonb("related_article_ids").default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// =============================================================================
// CLAIMS (per-article verification items)
// =============================================================================

export const claims = pgTable("claims", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").references(() => articles.id).notNull(),
  claimText: text("claim_text").notNull(),
  mark: text("mark").notNull().default("unconfirmed"), // verified, claim, reported, unconfirmed
  source: text("source"), // who sourced this (vendor name, our test, reporter)
  citation: text("citation"), // how confirmed
  isRecordItem: boolean("is_record_item").default(false),
  recordColumn: text("record_column"), // confirmed, claimed (only if is_record_item)
  deltaVendor: text("delta_vendor"), // vendor's number
  deltaOurs: text("delta_ours"), // our number
  deltaValue: text("delta_value"), // difference
  deltaPassed: boolean("delta_passed"), // whether claim held
  logsUrl: text("logs_url"), // link to raw logs (required if delta)
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// =============================================================================
// BENCHMARKS (cached from IIMAGINE API for widget)
// =============================================================================

export const widgetBenchmarks = pgTable("widget_benchmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelName: text("model_name").notNull(),
  provider: text("provider").notNull(),
  useCase: text("use_case").notNull(), // code_generation, creative_writing, etc.
  score: numeric("score"), // composite 0-100
  latencyMs: integer("latency_ms"),
  costPer1kTokens: numeric("cost_per_1k_tokens"),
  accuracyScore: numeric("accuracy_score"),
  lastTested: timestamp("last_tested", { withTimezone: true }),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// =============================================================================
// SUBSCRIBERS (newsletter + follow-story)
// =============================================================================

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  type: text("type").notNull(), // newsletter, follow_story
  articleId: uuid("article_id").references(() => articles.id), // only for follow_story
  confirmed: boolean("confirmed").default(false),
  confirmationToken: text("confirmation_token"),
  unsubscribeToken: text("unsubscribe_token"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
});

// =============================================================================
// MEMBERS (paid subscriptions)
// =============================================================================

export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  userId: text("user_id"), // FK to Better Auth user table (if they have an account)
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan"), // monthly, annual
  status: text("status").notNull().default("active"), // active, past_due, cancelled, expired
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
});

// =============================================================================
// SUGGESTED QUESTIONS (pre-computed for Ask the Article)
// =============================================================================

export const suggestedQuestions = pgTable("suggested_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").references(() => articles.id).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  citationParagraph: integer("citation_paragraph"),
  order: integer("order").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// =============================================================================
// CORRECTIONS (append-only)
// =============================================================================

export const corrections = pgTable("corrections", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").references(() => articles.id).notNull(),
  correctionText: text("correction_text").notNull(),
  whatWasWrong: text("what_was_wrong").notNull(),
  correctedAt: timestamp("corrected_at", { withTimezone: true }).defaultNow(),
});

// =============================================================================
// SENTIMENT SNAPSHOTS (from X API)
// =============================================================================

export const sentimentSnapshots = pgTable("sentiment_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  topic: text("topic").notNull(), // model name, lab name, or keyword
  sentiment: text("sentiment"), // bullish, bearish, neutral, mixed
  tweetVolume: integer("tweet_volume"),
  engagementTotal: integer("engagement_total"),
  keyQuotes: jsonb("key_quotes").default([]),
  rawData: jsonb("raw_data"),
  snapshotAt: timestamp("snapshot_at", { withTimezone: true }).defaultNow(),
});

// =============================================================================
// MONITORING ALERTS (News Radar)
// =============================================================================

export const monitoringAlerts = pgTable("monitoring_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  stream: text("stream").notNull(), // huggingface, github, x_list, rss
  priority: text("priority").notNull().default("normal"), // critical, high, normal
  modelName: text("model_name"),
  orgName: text("org_name"),
  sourceUrl: text("source_url"),
  rawData: jsonb("raw_data"),
  dedupeKey: text("dedupe_key"),
  pipelineTriggered: boolean("pipeline_triggered").default(false),
  articleId: uuid("article_id").references(() => articles.id),
  detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
});

// =============================================================================
// DISTRIBUTION LOG
// =============================================================================

export const distributionLog = pgTable("distribution_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  articleId: uuid("article_id").references(() => articles.id).notNull(),
  channel: text("channel").notNull(), // x, reddit, substack, medium, youtube, tiktok, instagram
  postUrl: text("post_url"),
  status: text("status").notNull().default("pending"), // pending, posted, failed
  postedAt: timestamp("posted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// =============================================================================
// INVITES (admin user management)
// =============================================================================

export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull().default("editor"), // admin, editor
  invitedBy: text("invited_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
