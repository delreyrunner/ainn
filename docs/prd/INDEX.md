# AINN — AI News Network PRD

**Start here.** This document explains what this PRD is, how it's structured, and how to find what you need.

**Last updated:** 2026-08-27

---

## What is this?

This is the product documentation for AINN (AI News Network) — an independent AI-focused wire service that verifies vendor claims using proprietary benchmark testing and real-time X sentiment analysis. AINN exists to produce credible, data-driven AI news that doubles as organic promotion for the founder's AI testing platform (IIMAGINE.AI).

**Codebase:** `/Users/adam/Documents/ainn`
**Domain:** ainn.news (planned)
**Hosting:** Vercel Pro Plan
**Database:** Neon Cloud (Postgres)

---

## Before you do anything

1. **Read `guides/terminology-and-status.md`** — it defines the hierarchy (feature → functionality → step), the five statuses (live, in-development, planned, paused, withdrawn), and the rules for modifying PRD files.
2. **Read the design system** (`docs/design/ainn-design-system.md`) — it defines all visual components, tokens, and constraints. Every page must conform.
3. **Technical constraints are in the Coding SOP** (`.kiro/steering/coding-sop.md`, auto-loaded when it exists). The PRD does not repeat architecture rules — those live in the SOP.
4. **If you are unsure about the status of a feature or functionality, ask Adam.** Do not guess from code.

---

## Strategic context

AINN is a side project with a dual purpose:

1. **Short-term:** Produce genuine AI industry news that organically promotes IIMAGINE.AI's model testing capabilities. AINN runs exclusive benchmarks using IIMAGINE's infrastructure and publishes results before anyone else can.
2. **Long-term:** Build an independent, sellable media asset with institutional authority. The brand is decoupled from Adam personally — structured as a standalone entity that can grow, hire editors, and be exited independently.

**The editorial proposition:** Every story carries a verification mark. We retest vendor benchmarks ourselves. We map real-time X sentiment. We never use generated or stock imagery. We never launder a company claim into a fact.

**Revenue model:** Free tier (verification marks, The Record, corrections, standards page) + paid membership (raw logs, claim-check database, archive beyond 30 days, Ask the Article AI assistant).

**Traffic strategy:** Google News (primary organic), X brand account (data-drop posts + micro-budget boosts), Reddit subreddit (auto-syndication), Substack/Medium (canonical syndication), short-form video reels (YouTube Shorts, TikTok, Instagram Reels).

---

## Folder structure

```
docs/prd/
  INDEX.md              ← You are here
  decisions.md          — Product and architecture decisions log
  architecture/         — How things are built (technical reference)
  features/             — One file per feature (the definitive record)
  guides/               — Procedural guides for coding agents
  reference/            — Non-feature reference material (messaging, brand)
```

### What goes where

| I need to... | Go to |
|--------------|-------|
| Understand a specific feature (what it does, what's live, what's planned) | `features/{feature-name}.md` |
| Understand how something is built technically | `architecture/` |
| Follow a procedure (update content, build a specific thing) | `guides/` |
| Find brand voice, copy guidance, or supplementary reference material | `reference/` |
| See what product decisions were made and why | `decisions.md` |

### Rules for adding files

1. **Never create a new file in `docs/prd/` without Adam's approval.** Ask first.
2. **New feature?** → Create it in `features/`. Use the template in `guides/terminology-and-status.md`.
3. **New procedure for coding agents?** → Create it in `guides/`.
4. **New reference material?** → Create it in `reference/`.
5. **Never add files to the root of `docs/prd/`** — everything belongs in a subfolder (except INDEX.md and decisions.md).
6. **Never remove content from a PRD file.** Add, update, correct — but don't delete history.

---

## Features

All features are documented in `features/` — one file per feature. Each file contains the feature's status, objective, current state (functionality breakdown with statuses), architecture, known issues, and history.

| Feature | File | Status |
|---------|------|--------|
| Articles | `features/articles.md` | Planned |
| Homepage | `features/homepage.md` | Planned |
| Model Widget | `features/model-widget.md` | Planned |
| Ask the Article | `features/ask-the-article.md` | Planned |
| Newsletter & Follow | `features/newsletter.md` | Planned |
| Membership | `features/membership.md` | Planned |
| News Radar | `features/news-radar.md` | Planned |

---

## Architecture Index

Technical reference for how things are built. Read these when making structural decisions.

| Topic | File |
|-------|------|
| Platform overview + stack + project structure | `architecture/overview.md` |
| Content pipeline (article generation, publishing) | `architecture/content-pipeline.md` |
| SEO and indexing (Google News, schema, sitemaps) | `architecture/seo-and-indexing.md` |
| Distribution (X, Reddit, video, syndication) | `architecture/distribution.md` |

---

## Guides Index

| Guide | File | When to use |
|-------|------|-------------|
| Terminology and status definitions | `guides/terminology-and-status.md` | **Read first.** Defines all terms and rules for this PRD. |

---

## Reference Index

| Document | File | Purpose |
|----------|------|---------|
| Brand messaging + copy rules | `reference/messaging.md` | Voice, tone, positioning, copy constraints |

---

## Design system

The design system lives at `docs/design/` (not inside `docs/prd/`):

| File | Purpose |
|------|---------|
| `docs/design/ainn-design-system.md` | Complete component and token reference |
| `docs/design/ainn.css` | Single source of truth for CSS tokens and components |
| `docs/design/ainn-homepage.html` | Homepage mockup |
| `docs/design/ainn-article.html` | Article page mockup |

---

## Conventions

- **Stack:** Next.js (App Router, TypeScript, Tailwind)
- **Database:** Neon Cloud (Postgres)
- **ORM:** Drizzle
- **Hosting:** Vercel Pro Plan
- **Package manager:** pnpm
- **DB naming:** snake_case for all tables and columns
- **No hardcoding:** API keys → .env; models, prompts, limits → DB config table or env
- **Icons:** lucide-react
- **Design:** Follow `docs/design/ainn-design-system.md` exactly — no deviations
- **Images:** No generated or stock imagery. Data graphics, documentary photography, or nothing.
- **Article URLs:** Clean descriptive paths (e.g. `/news/kestrel-meridian-3-test`)

---

## Relationship to IIMAGINE.AI

AINN uses IIMAGINE.AI's model testing infrastructure as a data source. The relationship is disclosed on a permanent editorial transparency page. AINN does not compare IIMAGINE with competitors. AINN publishes objective model-vs-model comparisons using IIMAGINE's testing tools, with clear attribution of where the data originates.

The two entities share:
- A founder (Adam Radly)
- Testing infrastructure (IIMAGINE provides benchmark data)
- Nothing else (separate domains, separate branding, separate audiences)
