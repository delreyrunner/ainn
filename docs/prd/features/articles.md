# Feature: Articles

**Status:** Planned
**Last updated:** 2026-08-27
**Depends on:** Content pipeline, SEO infrastructure, design system
**Key files:** `src/app/(site)/news/[slug]/page.tsx`, `src/lib/content/`, `src/components/article/`

---

## Objective

The article page is AINN's core product. Every article presents AI news with explicit verification marks on each claim, a structured "Record" showing what's confirmed vs. claimed, and benchmark data tables when applicable. The page must serve as both a credible news experience for readers and a technically perfect specimen for Google News indexing.

---

## Current State

| Functionality | Status | Objective | Notes |
|---------------|--------|-----------|-------|
| Article page layout | planned | Three-column layout: status rail / prose / aside. Responsive to single column on mobile. | HTML mockup exists at `docs/design/ainn-article.html` |
| Verification marks | planned | Four marks (Verified, Company Claim, Reported, Unconfirmed) on every story teaser, wire item, and article header. | Core differentiator — defined in design system |
| The Record panel | planned | Two-column ledger (confirmed vs claimed) above the article body. Each line cites how it was confirmed. | Appears on any story where a vendor makes a claim |
| Claim check table | planned | Three-column table: vendor's number, our number, delta. Delta is oxblood when claim fails, muted when it holds. | Always links to raw logs. Never publish delta without logs link. |
| Headline block | planned | H1 headline + dek + verification mark + kicker (section) + byline with timestamps | Static server-rendered. Never dynamic. |
| Byline and timestamps | planned | Institutional byline ("AINN Research Desk") + datePublished + dateModified (UTC, minute-level) | Feeds directly into JSON-LD schema |
| Progress bar | planned | Reading progress indicator at top of article | Non-essential but improves dwell time |
| Update log | planned | Chronological list of substantive changes to the article | Renders even when empty ("No updates") |
| Sourcing slab | planned | End-of-article block naming sources and methodology | Transparency signal for E-E-A-T |
| Share row | planned | Copy link (primary) → X → LinkedIn → Bluesky → HN → "Share The Record" | No third-party widgets. Plain anchors. navigator.share on mobile. |
| Corrections slot | planned | Permanent section. Reads "None" when no corrections exist. Never removed. | Renders on every article regardless of corrections |
| Inline claim tags | planned | Mid-sentence `.claimtag` labels on individual assertions within body text | Lets readers see verification status per-statement |
| Read next | planned | 2–3 related article cards at bottom of page | Based on section + recency |
| NewsArticle JSON-LD | planned | Full structured data in page head (see architecture/seo-and-indexing.md) | Required for Google News inclusion |
| OG image | planned | Programmatic 1200x630 PNG via Satori (headline + mark + metric) | Cached, bust on dateModified change |
| Canonical URL | planned | `<link rel="canonical">` on every article, clean slug format `/news/{slug}` | No query parameters |

---

## Architecture

### Data model: `articles` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `slug` | text (unique) | URL slug, auto-generated from headline, max 60 chars |
| `status` | enum | `draft`, `review`, `live`, `archived` |
| `headline` | text | Max 110 chars (for schema compatibility) |
| `dek` | text | Subheadline, max 200 chars |
| `body` | text | Markdown/MDX article body |
| `section` | text | Section name (Models, Benchmarks, Sentiment, Infrastructure) |
| `verification_mark` | enum | Primary article-level mark: `verified`, `claim`, `reported`, `unconfirmed` |
| `date_published` | timestamptz | ISO 8601 with timezone |
| `date_modified` | timestamptz | Only updates on genuine editorial changes |
| `byline` | text | Default: "AINN Research Desk" |
| `sources` | jsonb | Array of source citations for the sourcing slab |
| `og_image_url` | text | Cached URL to generated OG PNG |
| `related_article_ids` | uuid[] | Manual or auto-generated related articles |
| `created_at` | timestamptz | Record creation time |

### Data model: `claims` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `article_id` | uuid | FK to articles |
| `claim_text` | text | The assertion being evaluated |
| `mark` | enum | `verified`, `claim`, `reported`, `unconfirmed` |
| `source` | text | Who/what sourced this (vendor name, our test, reporter) |
| `citation` | text | How it was confirmed (e.g. "Tested by AINN, 2026-08-27") |
| `is_record_item` | boolean | Whether it appears in The Record panel |
| `record_column` | enum | `confirmed` or `claimed` (only if `is_record_item`) |
| `delta_vendor` | text | Vendor's claimed number (for bench table) |
| `delta_ours` | text | Our measured number (for bench table) |
| `delta_value` | text | The difference (displayed in delta column) |
| `delta_passed` | boolean | Whether the claim held up (controls color) |
| `logs_url` | text | Link to raw test logs (required if delta exists) |

### Rendering strategy

- **Server-side:** Headline, body, marks, timestamps, schema, The Record, bench table, sourcing slab, corrections
- **Client-side:** Progress bar, share row (Copy link button), Ask the Article, wire ticker sidebar
- **ISR:** Revalidate on publish or edit. Default revalidation: 1 hour for live articles.

### URL routing

- `/news/[slug]` → article page
- Slug is immutable after publish (never change URLs)
- If an article's headline changes, the slug does NOT update — only `dateModified` changes

---

## Verification Marks — Rules of Use

These are non-negotiable editorial and technical constraints:

1. **Every article has a primary mark** in its header and in schema metadata
2. **Every claim within an article** can carry its own inline mark via `.claimtag`
3. **Marks are stored in the database**, not derived from content — they are editorial decisions
4. **Only an editor can assign or change a mark** — the generation pipeline can suggest, but the editor approves
5. **When a mark changes** (e.g. "Company claim" → "Verified"), the article gets a new `dateModified`, re-enters the 48-hour news sitemap, and follow-story subscribers are emailed
6. **The four marks are final.** Never invent a fifth. Never combine marks. Never use colour alone to distinguish them.

---

## Article Types

| Type | Trigger | Contains |
|------|---------|----------|
| **Claim test** | We tested a vendor's benchmark claim | The Record + bench table + delta + logs link |
| **Model release** | New model dropped (open or proprietary) | Specs, initial bench data, sentiment snapshot |
| **Sentiment report** | Significant shift in X sentiment on a topic | Sentiment charts, key quotes, trend analysis |
| **Breaking** | Major news requiring fast coverage | Minimal — headline + verified facts + marks. Flesh out later. |
| **Analysis** | Longer-form editorial on a trend or pattern | Body-heavy, fewer data panels, still carries marks on every claim |

---

## Known Issues

| Functionality | Type | Description | Priority |
|---------------|------|-------------|----------|
| — | — | No issues yet (feature is planned) | — |

---

## History

| Date | Change |
|------|--------|
| 2026-08-27 | Feature specified in PRD |
