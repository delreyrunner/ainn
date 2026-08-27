# Feature: Homepage

**Status:** Planned
**Last updated:** 2026-08-27
**Depends on:** Articles feature, design system
**Key files:** `src/app/(site)/page.tsx`, `src/components/home/`

---

## Objective

The homepage is a high-density wire service terminal that lets readers triage AI news at speed. It communicates institutional authority through density, typography, and the verification system — not through photography or marketing copy. A reader landing from Google Discover or X should immediately understand: this is a serious, data-driven news operation.

---

## Current State

| Functionality | Status | Objective | Notes |
|---------------|--------|-----------|-------|
| Wire ticker | planned | Animated horizontal scroll of timestamped breaking items. Each carries a verification mark. | Client-side only (avoid crawl budget waste). `prefers-reduced-motion` makes it static scrollable. |
| Masthead | planned | AINN wordmark + compact nav (sections + search). No social icons in header. | Must pass 360px without breaking |
| Section navigation | planned | Horizontal list of sections: Models, Benchmarks, Sentiment, Infrastructure, Wire | Links to `/section/{name}` |
| Lead story | planned | Large headline + dek + verification mark + The Record preview for top story | Takes 60% width on desktop, full width on mobile |
| Wire column | planned | Right-column list of 8–10 timestamped items from the last 24h. Text only — no images. | Each item carries a mark. Purely typographic. |
| Header density metrics | planned | Top-right display: "X stories logged this week / Y claims independently retested" | Programmatic counters from DB. Updates on each publish. |
| Claim check highlight | planned | One featured benchmark comparison below the lead (mini bench table) | Rotates daily or on publish |
| Story grid | planned | 3-column (2-col on tablet, 1-col on mobile) grid of story cards with headline + dek + mark + timestamp | Dense. No images. Cards link to article pages. |
| Section filter | planned | Click a section in nav to filter the grid to that section only | Client-side filter on pre-rendered grid, or link to section index |
| Standards legend | planned | Small box in footer area explaining the four verification marks with visual key | Links to full `/standards` page |
| Footer | planned | Footer with: social links, standards link, corrections link, disclosure link, copyright | Social links text-only, not icons |

---

## Architecture

### Rendering strategy

- **Server-side (ISR):** Masthead, lead story, story grid, section nav, footer, standards legend, density metrics
- **Client-side:** Wire ticker (fetches from API on hydration), section filter interaction
- **Revalidation:** Homepage revalidates on every article publish event (on-demand ISR)

### Data requirements

| Data | Source | Freshness |
|------|--------|-----------|
| Lead story | Latest `live` article with highest priority/editorial pick flag | Real-time (revalidated on publish) |
| Wire items | Last 10 articles ordered by `date_published` desc | Real-time |
| Story grid | Last 9–12 articles (excluding lead and wire duplicates) | Real-time |
| Density metrics | COUNT of articles this week + COUNT of claim-test articles this week | Computed on revalidation |
| Claim check highlight | Latest article with `claim_type = 'claim-test'` that has a bench table | Real-time |

### Layout structure (desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│ [WIRE TICKER — full width, animated]                            │
├─────────────────────────────────────────────────────────────────┤
│ AINN                              [Models] [Benchmarks] [...]   │
├─────────────────────────────────────────────────────────────────┤
│                                   │ 412 stories / 31 retested   │
├──────────────────────────────┬────┴─────────────────────────────┤
│                              │                                  │
│   LEAD STORY                 │   THE WIRE                       │
│   [mark] Headline            │   09:41 — Item [mark]            │
│   Dek text...                │   08:55 — Item [mark]            │
│                              │   08:12 — Item [mark]            │
│   [The Record preview]       │   07:44 — Item [mark]            │
│                              │   ...                            │
├──────────────────────────────┴──────────────────────────────────┤
│ ─── CLAIM CHECK ───                                             │
│ [mini bench table with one featured comparison]                 │
├─────────────────────────────────────────────────────────────────┤
│ ─── LATEST ───                                                  │
│ [card] [card] [card]                                            │
│ [card] [card] [card]                                            │
│ [card] [card] [card]                                            │
├─────────────────────────────────────────────────────────────────┤
│ [mark legend]                                                   │
├─────────────────────────────────────────────────────────────────┤
│ [FOOTER: social · standards · corrections · disclosure · ©]     │
└─────────────────────────────────────────────────────────────────┘
```

### Wire ticker isolation

The wire ticker is loaded client-side after hydration to prevent Google from wasting crawl budget re-indexing it on every page visit. It fetches from a lightweight API endpoint (`/api/wire`) that returns the last 20 items with timestamps and marks.

---

## Design constraints (from design system)

- No images in the story grid or wire column. Density IS the product.
- Lead story may include a data graphic (SVG chart) but never a photograph
- Grid cards: headline + 1-line dek + mark + timestamp. No images, no byline, no excerpt.
- Wire items: timestamp + headline + mark. One line each. No dek.
- All text. The homepage should feel like a Bloomberg terminal for AI news.

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
