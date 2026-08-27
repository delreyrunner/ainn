# Architecture: Platform Overview

**Last updated:** 2026-08-27

---

## Executive Summary

AINN (AI News Network) is a high-speed, data-driven news site focused on AI industry coverage. It programmatically generates article drafts from proprietary benchmark data and real-time X sentiment analysis, which are then reviewed by a human editor before publishing. The site is optimized for Google News algorithmic inclusion and designed as a standalone, sellable media asset.

**Core proposition:** The only AI news source that independently retests vendor claims and maps public sentiment — with every fact labelled by its verification status.

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js (App Router, TypeScript) | SSR/ISR for Google News indexing, Vercel-native |
| Styling | Tailwind CSS | Utility-first, matches design system tokens |
| ORM | Drizzle | Type-safe, lightweight, Postgres-native |
| Database | Neon Postgres | Vercel-native, scale-to-zero, branching |
| Hosting | Vercel Pro Plan | Edge network, ISR, serverless functions |
| Auth | Better Auth (or simple email magic link) | Lightweight for membership gating |
| Email | Resend | Transactional (follow-story alerts, newsletter) |
| Payments | Stripe | Membership subscriptions |
| Icons | lucide-react | Consistent with design system |
| OG Image Generation | Satori + resvg-js | Programmatic 1200x630 PNG cards from article data |
| Data Visualization | SVG (inline) + PNG export | Charts server-rendered, PNG for social/schema |
| AI (Article Generation) | LLM via API (model TBD — ask Adam) | Draft generation from structured data |
| AI (Ask the Article) | LLM via API (model TBD — ask Adam) | RAG grounded in single article |
| X API | Official v2 API | Sentiment data collection, auto-posting |
| Video Generation | Remotion or similar (TBD) | Programmatic short-form reels |
| Monitoring/Alerts | n8n or custom cron (TBD) | New model release detection |
| Package Manager | pnpm | — |

---

## Domain Strategy

| Domain | Purpose | Auth |
|--------|---------|------|
| `ainn.news` | All content — articles, homepage, widget, membership | Session (members only for gated features) |

Single-domain architecture. No subdomains. All content lives on one origin for maximum domain authority consolidation.

---

## Architecture Principles

1. **Speed above all.** Every page must score 95+ on Core Web Vitals. Google News rewards fast sites.
2. **Server-render the content, client-render the interactivity.** Article body, headlines, schema, and data tables are SSR/ISR. Interactive widgets (model selector, Ask the Article) are client-side hydrated.
3. **48-hour news sitemap.** Articles older than 48 hours are automatically removed from the Google News sitemap and moved to the standard sitemap.
4. **Verification marks are structural, not cosmetic.** They are stored in the database as a field on every claim, rendered server-side, and included in structured data.
5. **No generated imagery.** OG cards are data-driven (headline, section, verification mark, key metric). Charts are SVG. Photography is real or absent.
6. **Institutional byline.** Articles are attributed to "AINN Research Desk" — never to a personal name unless a named reporter is on record.
7. **Editorial transparency is infrastructure.** Disclosure page, corrections page, and standards page are permanent routes that render even when empty.
8. **Decouple the wire ticker from article pages.** The real-time ticker loads client-side to avoid wasting Google's crawl budget on sidebar updates.
9. **Pre-compute what you can.** Suggested questions for Ask the Article are generated at publish time and stored. The open-ended box is the only live LLM call.
10. **Build for exit.** No dependency on Adam's personal brand. All accounts, data, and infrastructure must be transferable to a new owner.

---

## Project Structure (Planned)

```
ainn/
├── docs/
│   ├── prd/                          # This PRD system
│   ├── design/                       # Design system, CSS, HTML mockups
│   └── widget-demo/                  # Model widget prototype reference
├── public/                           # Static assets (favicon, robots.txt)
├── src/
│   ├── app/
│   │   ├── (site)/                   # Public site routes
│   │   │   ├── page.tsx              # Homepage (wire + lead + grid)
│   │   │   ├── news/[slug]/page.tsx  # Article pages
│   │   │   ├── section/[name]/       # Section index pages
│   │   │   ├── widget/              # Interactive model widget
│   │   │   ├── standards/           # Editorial standards page
│   │   │   ├── corrections/         # Corrections log
│   │   │   ├── about/               # About + disclosure
│   │   │   └── subscribe/           # Newsletter + membership
│   │   ├── (members)/               # Authenticated member routes
│   │   │   ├── archive/             # Full archive (30+ days)
│   │   │   ├── logs/                # Raw test logs
│   │   │   └── database/            # Claim-check database
│   │   ├── api/
│   │   │   ├── ask/                  # Ask the Article endpoint
│   │   │   ├── newsletter/           # Subscribe/unsubscribe
│   │   │   ├── follow/               # Follow-story registration
│   │   │   ├── og/                   # OG image generation (satori)
│   │   │   ├── sitemap/              # Dynamic sitemaps
│   │   │   └── webhook/              # Stripe webhooks, monitoring alerts
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client (shared pool)
│   │   │   ├── schema/               # Drizzle schema definitions
│   │   │   └── migrations/           # Auto-generated
│   │   ├── content/
│   │   │   ├── generator.ts          # Article draft generation pipeline
│   │   │   ├── sentiment.ts          # X API sentiment collection
│   │   │   ├── benchmarks.ts         # IIMAGINE benchmark data fetcher
│   │   │   └── publisher.ts          # Publish pipeline (draft → review → live)
│   │   ├── seo/
│   │   │   ├── schema.ts             # NewsArticle JSON-LD generator
│   │   │   ├── sitemap.ts            # News sitemap + standard sitemap logic
│   │   │   └── og.ts                 # OG card data assembly
│   │   ├── distribution/
│   │   │   ├── x-poster.ts           # Auto-post to X API
│   │   │   ├── reddit.ts             # Auto-post to subreddit
│   │   │   ├── syndication.ts        # Medium/Substack canonical push
│   │   │   └── video.ts              # Short-form reel generation
│   │   ├── monitoring/
│   │   │   ├── huggingface.ts        # HF Hub new model watcher
│   │   │   ├── github.ts             # vLLM/Ollama release watcher
│   │   │   ├── x-lists.ts            # AI lab account monitor
│   │   │   └── rss.ts                # Corporate blog RSS aggregator
│   │   ├── ask/
│   │   │   ├── engine.ts             # Grounded Q&A (single article RAG)
│   │   │   └── precompute.ts         # Generate suggested questions at publish
│   │   ├── auth/                     # Better Auth or magic link config
│   │   ├── email/                    # Resend templates (follow alerts, newsletter)
│   │   ├── billing/                  # Stripe membership integration
│   │   └── config.ts                 # Site config (from env or DB)
│   └── components/
│       ├── ui/                       # Base UI (buttons, panels, inputs)
│       ├── article/                  # Article-specific (Record, bench table, byline)
│       ├── home/                     # Homepage (wire ticker, lead, grid)
│       ├── widget/                   # Interactive model recommender
│       ├── ask/                      # Ask the Article UI
│       └── shared/                   # Layout, nav, footer, marks, share row
├── drizzle.config.ts
├── tailwind.config.ts                # Maps design tokens from ainn.css
├── next.config.ts
└── .env.local
```

---

## Naming Conventions

| Context | Convention |
|---------|-----------|
| DB tables + columns | snake_case |
| Primary keys | UUID (or cuid) |
| TypeScript | camelCase (variables), PascalCase (types/components) |
| File names | kebab-case |
| Route segments | kebab-case (e.g. `/news/kestrel-meridian-3-test`) |
| Article slugs | Auto-generated from headline, kebab-case, max 60 chars |

---

## Database Schema (High-Level)

Core tables (details in a dedicated schema doc when we build):

| Table | Purpose |
|-------|---------|
| `articles` | All published and draft articles |
| `claims` | Individual claims within an article, each with a verification mark |
| `benchmarks` | Raw test results from IIMAGINE platform |
| `sentiment_snapshots` | X sentiment data per topic/model at a point in time |
| `subscribers` | Newsletter + follow-story email registrations |
| `members` | Paid membership accounts |
| `corrections` | Correction log (append-only) |
| `suggested_questions` | Pre-computed Ask the Article questions per article |
| `distribution_log` | Track what was posted where and when |
| `monitoring_alerts` | New model release detection log |

---

## Key Infrastructure Details

**Neon Database:**
- Org: dev@s7group.com (or TBD — ask Adam)
- Project: TBD
- Database: ainn

**Vercel Deployment:**
- Plan: Pro
- Domain: ainn.news (pending registration/DNS)
- Region: Match Neon region for low latency

**External APIs:**
- X API v2 (sentiment collection + auto-posting)
- IIMAGINE API (benchmark data — internal, no cost)
- Hugging Face Hub API (model monitoring — free)
- Stripe (membership billing)
- Resend (email delivery)
- LLM provider TBD (article generation + Ask the Article)

---

## Build Phases

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 0 | PRD, design system, project setup, DB schema | In progress |
| Phase 1 | Article pages + homepage + SEO infrastructure | Planned |
| Phase 2 | Content pipeline (generation, review, publish) | Planned |
| Phase 3 | Distribution (X, Reddit, syndication, OG cards) | Planned |
| Phase 4 | Interactive features (model widget, Ask the Article) | Planned |
| Phase 5 | Membership + newsletter + follow-story | Planned |
| Phase 6 | News radar (automated monitoring) | Planned |
| Phase 7 | Video reels pipeline | Planned |

---

## Cost Considerations

| Item | Cost Model | Notes |
|------|-----------|-------|
| Vercel Pro | $20/mo | Hosting, serverless, ISR |
| Neon | Free tier initially | Scale-to-zero Postgres |
| Resend | Free tier (100/day) then $20/mo | Email delivery |
| X API | Basic tier $100/mo | Read + write access |
| LLM (article gen) | Per-token | Model TBD — minimize by caching context |
| LLM (Ask the Article) | Per-token | Subscriber-gated to control spend |
| Stripe | 2.9% + 30c per transaction | Membership billing |
| Domain | ~$30/yr | ainn.news |
| X Premium | $8–16/mo | Algorithm priority for brand account |
| Ad boosts | $2–5/day optional | Micro-budget for breakout posts |

Total baseline: ~$170/mo before LLM usage. LLM costs scale with article volume and subscriber Q&A usage.
