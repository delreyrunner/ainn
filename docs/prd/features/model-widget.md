# Feature: Model Widget

**Status:** Planned
**Last updated:** 2026-08-27
**Depends on:** IIMAGINE API (benchmark data), articles feature
**Key files:** `src/app/(site)/widget/`, `src/components/widget/`

---

## Objective

An interactive tool that helps readers determine which AI model is best for their use case. Users answer simple questions or click use-case toggles to see how benchmark results shift based on different priorities (speed, accuracy, cost, creativity, code generation, etc.). This is a high-dwell-time engagement tool, a unique content asset for SEO, and a natural integration point for IIMAGINE's testing data.

---

## Current State

| Functionality | Status | Objective | Notes |
|---------------|--------|-----------|-------|
| Use-case selector | planned | Buttons/toggles at the bottom of a comparison view. Clicking a use case triggers a different chart/table to appear. | Core interaction described in conversations. Prototype reference at `docs/widget-demo/` |
| Benchmark comparison table | planned | Table showing models ranked by a composite score that changes based on selected use case | Data from IIMAGINE API |
| Chart visualization | planned | SVG chart (bar or radar) showing model performance across dimensions | Updates on use-case toggle |
| Model recommendation | planned | "Best for you" output based on selected use-case priorities | Simple weighted scoring, not ML |
| Embeddable in articles | planned | Widget can appear inline within article pages (below The Record or before body) | Especially relevant for model-release and comparison articles |
| Standalone page | planned | `/widget` route with full-page version for direct traffic and SEO | Evergreen page, updated as new models are tested |
| Data freshness indicator | planned | Shows when the benchmark data was last updated | "Data current as of {date}" |

---

## Architecture

### Data source

- All model benchmark data comes from the IIMAGINE platform API
- Data is cached in AINN's database (refreshed on new test completion or daily cron)
- The widget never calls IIMAGINE in real-time from the client — always serves cached data

### Database: `widget_benchmarks` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `model_name` | text | Display name (e.g. "GPT-5.4 Mini") |
| `provider` | text | Lab/company name |
| `use_case` | text | Use case category (e.g. "code_generation", "creative_writing") |
| `score` | numeric | Composite score for this model in this use case (0–100) |
| `latency_ms` | integer | Average response latency |
| `cost_per_1k_tokens` | numeric | USD cost |
| `accuracy_score` | numeric | Accuracy metric (0–100) |
| `last_tested` | timestamptz | When this benchmark was run |
| `raw_data` | jsonb | Full test result details |

### Rendering strategy

- **Server-side:** Default view (no use case selected) renders as static HTML with the full table
- **Client-side:** Use-case toggles swap the visible chart/table without a page reload
- This ensures Google indexes the default data table while users get the interactive experience

### Interaction flow

```
[Page loads with default "All-round" view]
        │
        ▼
[User clicks "Code Generation" use case]
        │
        ▼
[Table re-sorts by code_generation scores]
[Chart updates to show code-relevant dimensions]
[Recommendation updates: "Best for code: {model}"]
        │
        ▼
[User clicks "Creative Writing"]
        │
        ▼
[Table re-sorts by creative_writing scores]
[Chart updates]
[Recommendation updates]
```

### Use-case categories (initial set — expandable)

| Category | Dimensions weighted |
|----------|-------------------|
| All-round | Equal weight across all |
| Code generation | Accuracy, instruction following, code-specific benchmarks |
| Creative writing | Fluency, creativity, coherence, style |
| Data analysis | Accuracy, structured output, reasoning |
| Customer support | Latency, cost, instruction following, tone |
| Research & reasoning | Multi-step reasoning, factual accuracy, citation |
| Cost-optimized | Heavy weight on cost, minimum quality threshold |
| Speed-optimized | Heavy weight on latency, minimum quality threshold |

### Widget in articles

When embedded in an article (e.g. a model-release article), the widget:
- Pre-selects the relevant model for comparison
- Shows that model highlighted against the current top performers
- Links to the full standalone widget page for deeper exploration

---

## Design constraints

- Matches the AINN design system (mono type for data, sans for labels, no rounded corners)
- Charts are inline SVG (server-rendered default state, client-side interaction)
- Use-case buttons use `.btn` styling from `ainn.css`
- Table uses `table.bench` styling (or a variant)
- No flashy animations — data updates are instant swaps, not transitions
- Mobile: table becomes scrollable horizontal, chart stacks vertically

---

## SEO value

- The standalone `/widget` page is an evergreen, high-utility page that attracts backlinks
- Title: "Which AI model is best for you? Interactive comparison — AINN"
- Updated data keeps it fresh for Google without changing the URL
- Schema: `WebApplication` or `Dataset` structured data (TBD)

---

## Relationship to IIMAGINE

- The widget is the most visible integration point between AINN and IIMAGINE
- Data attribution: "Benchmark data from IIMAGINE.AI model testing platform" (linked)
- This is NOT a comparison of IIMAGINE vs competitors — it's model vs model
- The widget drives awareness of IIMAGINE's testing capabilities by demonstrating the data quality

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
