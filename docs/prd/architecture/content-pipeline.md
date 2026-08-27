# Architecture: Content Pipeline

**Last updated:** 2026-08-27

---

## Overview

The content pipeline is AINN's core engine. It takes raw data (benchmark results, X sentiment, model releases, industry events) and produces publication-ready articles that a human editor reviews before they go live. The pipeline must produce content that passes Google's programmatic content spam filters while being genuinely original.

---

## Pipeline Stages

```
[Data Sources] → [Article Generation] → [Editorial Review] → [Publishing] → [Distribution]
     ↓                    ↓                     ↓                  ↓               ↓
 Monitoring          LLM drafting         Human editor        DB + ISR        X, Reddit,
 (News Radar)        + data assembly       approves/edits      revalidation    video, email
```

---

## 1. Data Sources

### Benchmark data (from IIMAGINE)

- AINN calls the IIMAGINE API to pull latest model test results
- Data includes: model name, provider, test suite, scores, latency, cost metrics
- Arrives as structured JSON — no interpretation needed, just formatting
- This is the primary differentiator: exclusive first-party data nobody else has

### X Sentiment data

- Collected via X API v2 search endpoints
- Queries target specific model names, lab names, and AI industry keywords
- Raw data: tweet volume, sentiment classification (bullish/bearish/neutral), engagement metrics, key quotes
- Snapshots stored per-topic with timestamps for trend analysis
- Used to answer "what do people think about this model?" — genuinely original angle

### Monitoring alerts (News Radar)

- Automated detection of new model releases (see `features/news-radar.md`)
- Triggers article generation for the highest-priority events
- Priority: new open-weight model on HuggingFace > proprietary model announcement > infrastructure update

### Manual triggers

- Editor can manually trigger an article about any topic
- Supports ad-hoc coverage of breaking news, controversies, or editorial decisions

---

## 2. Article Generation

### Input assembly

Before the LLM writes anything, the system assembles a structured data packet:

```
{
  topic: "Kestrel Meridian-3 8-hour autonomy claim",
  benchmark_data: { ... },           // from IIMAGINE API
  sentiment_data: { ... },           // from X API snapshot
  vendor_claims: [ ... ],            // extracted from press release or announcement
  our_test_results: { ... },         // if we ran benchmarks
  related_articles: [ ... ],         // previous AINN coverage for context
  article_type: "claim-test" | "model-release" | "sentiment-report" | "breaking"
}
```

### LLM drafting

- The LLM receives the structured data + article type template + AINN editorial guidelines
- It produces: headline, dek, body paragraphs, verification mark assignments per claim, suggested Record entries
- **Critical:** The LLM does NOT invent facts. It formats and narrates the data it receives. All claims in the output must trace to a specific data source in the input.
- The draft includes explicit `[CLAIM: source=vendor]` and `[VERIFIED: source=our_test]` inline annotations that the system converts to verification marks

### Structural variation

- Templates are not fixed. The system uses multiple headline structures, paragraph orderings, and section arrangements to prevent Google from detecting a repeating template pattern
- Opening paragraphs rotate between: data-lead, finding-lead, context-lead, quote-lead
- This is a hard requirement from Google's programmatic content guidelines

### Pre-computation at draft time

- Suggested questions for Ask the Article are generated alongside the draft
- OG card data (headline, section, primary metric, verification status) is assembled
- Distribution copy (X thread text, Reddit title) is pre-written

---

## 3. Editorial Review

### Editor workflow

1. Editor receives notification (email or dashboard) that a draft is ready
2. Editor opens the review interface showing: draft + source data side by side
3. Editor can: approve as-is, edit text, upgrade/downgrade verification marks, reject entirely
4. On approval, the system sets `datePublished` and `dateModified` timestamps
5. `dateModified` only updates again if the editor makes a substantive post-publication edit

### Quality gates

- Every article must have at least one verification mark (no mark = reject)
- Every benchmark number must link to a source (our test, vendor claim, or third-party report)
- Headlines must state what happened, not what it means (per copy rules)
- No article publishes without a corrections slot (renders "None" if empty)

### Review SLA

- Breaking news: review within 30 minutes of draft
- Standard articles: review within 4 hours
- Low-priority: review within 24 hours

---

## 4. Publishing

### On publish

1. Article record status changes from `draft` → `live`
2. `datePublished` timestamp set (ISO 8601 with timezone offset)
3. Article added to Google News sitemap (stays for 48 hours)
4. ISR page revalidated — static HTML generated immediately
5. Homepage revalidated to include new article in the grid
6. OG image generated via Satori and cached
7. NewsArticle JSON-LD rendered server-side
8. Distribution pipeline triggered (async, non-blocking)

### URL structure

- `/news/{slug}` — clean, descriptive, no query parameters
- Slug auto-generated from headline: lowercase, hyphens, max 60 chars
- No date in URL (articles are evergreen references for the claim-check database)

### Content freshness

- Articles in the Google News sitemap automatically expire after 48 hours
- Expired articles move to the standard sitemap
- Articles with updated verification marks get a fresh `dateModified` and re-enter the news sitemap for another 48 hours

---

## 5. Distribution (Post-Publish)

Handled by separate distribution architecture (see `architecture/distribution.md`). Triggered automatically on publish with configurable delays:

| Channel | Delay | Format |
|---------|-------|--------|
| X (brand account) | Immediate | Data-drop thread with chart image |
| Reddit (r/AINN) | 5 minutes | Link post with summary |
| Substack/Medium | 30 minutes | Full article with canonical link back |
| Video reel | 1–4 hours (generation time) | 30–45s data narration |
| Newsletter (if topic matches follows) | Next digest or immediate for followed stories | Email with status-change summary |

---

## Anti-Spam Safeguards

These exist specifically to prevent Google from classifying AINN as a content farm:

1. **No carbon-copy templates.** Structural variation is mandatory at the generation layer.
2. **Human review is non-negotiable.** Every article passes through editorial review. The `dateModified` reflects when a human last touched it.
3. **Unique data in every article.** Either benchmark numbers from our tests, or sentiment data from X, or both. Generic news rewrites with no original data are not published.
4. **Rate limiting.** No more than 12 articles per day in the first month. Scale gradually as domain authority builds.
5. **Quality over quantity.** A single well-sourced claim-test article with original data is worth more than ten summarized press releases.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                              │
├──────────────┬──────────────┬───────────────┬──────────────────┤
│ IIMAGINE API │   X API v2   │ HuggingFace   │ RSS / GitHub     │
│ (benchmarks) │ (sentiment)  │ (new models)  │ (announcements)  │
└──────┬───────┴──────┬───────┴───────┬───────┴────────┬─────────┘
       │              │               │                │
       ▼              ▼               ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ARTICLE GENERATOR                             │
│  Assembles data packet → LLM draft → pre-computes Q&A + OG     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EDITORIAL REVIEW                              │
│  Editor approves / edits / rejects                              │
└─────────────────────────────┬───────────────────────────────────┘
                              │ (on approve)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLISHING                                    │
│  DB write → ISR revalidate → news sitemap → OG image cache     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DISTRIBUTION                                  │
│  X thread → Reddit → Substack/Medium → Video reel → Email      │
└─────────────────────────────────────────────────────────────────┘
```
