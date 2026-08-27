# Feature: Ask the Article

**Status:** Planned
**Last updated:** 2026-08-27
**Depends on:** Articles feature, membership feature (for gating), LLM provider (TBD)
**Key files:** `src/lib/ask/`, `src/components/ask/`, `src/app/api/ask/`

---

## Objective

An AI-powered Q&A interface on each article page that lets readers ask questions and receive answers grounded exclusively in that article's content. This is the highest-risk component on the site — an outlet built on catching AI claims cannot have its own AI hallucinate. The feature exists to increase dwell time, demonstrate the depth of AINN's coverage, and provide premium value for subscribers.

---

## Current State

| Functionality | Status | Objective | Notes |
|---------------|--------|-----------|-------|
| Suggested questions | planned | 3–4 pre-computed question buttons (free to all readers). Answers are pre-generated at publish time — zero LLM cost per click. | Generated alongside the article draft |
| Open-ended question field | planned | Text input for subscribers to ask any question about the article. Live LLM call. | Subscriber-gated to control costs |
| Answer rendering | planned | Response displayed with inline citation of the paragraph it drew from. Mono-styled citation link. | Must respect verification marks in answers |
| Scope boundary | planned | Clear statement that answers come only from this article. Explicit refusal for out-of-scope questions. | "Answers are drawn from this article only" |
| Subscriber gate | planned | Free users see suggested questions. Open-ended field shows gate: "Subscribe to ask unlimited questions" | Links to membership page |
| Mark-aware responses | planned | When asked about an unconfirmed detail, the AI must state the detail is single-sourced/unconfirmed. Never launders a claim into a fact. | Non-negotiable editorial constraint |

---

## Architecture

### Tiered access model

```
[Free reader]
  └── See 3–4 suggested question buttons
  └── Click → instant display of pre-computed answer (zero LLM cost)
  └── Open-ended field is visible but gated

[Subscriber]
  └── All suggested questions (same as free)
  └── Open-ended text input unlocked
  └── Live LLM call per question (cost tracked per subscriber)
  └── Rate limited: 10 questions per article per day
```

### Pre-computed questions (zero cost)

At article publish time, the content pipeline generates:
1. 3–4 likely questions a reader would ask about this article
2. Pre-written answers grounded in the article text
3. Stored in `suggested_questions` table

These render as clickable buttons. On click, the pre-stored answer displays immediately from the database — no LLM call, no latency, no cost.

### Live Q&A (subscriber only)

- User submits question via text input
- Server receives question + article ID
- System retrieves the article's full text (cached in context)
- LLM generates answer with strict grounding constraints
- Answer is returned with citation to the specific paragraph(s) used

### LLM constraints (non-negotiable)

The system prompt for the Q&A model must enforce:

1. **Grounded strictly in this article and its cited sources.** No outside knowledge, no training data recall.
2. **Every answer cites the section/paragraph it drew from.** Rendered as `.ask__cite` with a link/anchor to that paragraph.
3. **Out-of-scope questions get an explicit refusal:** "This question goes beyond the scope of this article. I can only answer based on what's reported here."
4. **Must respect verification marks.** If the reader asks about an unconfirmed detail, the answer must say: "According to this article, this claim is [unconfirmed / single-sourced / a vendor claim that has not been independently verified]."
5. **Never speculate about what happens next.** No predictions, no "implications", no editorializing.
6. **Never restate a vendor claim without its mark.** If the article says "Company X claims Y [UNCONFIRMED]", the AI must include that status in its answer.

### Database: `suggested_questions` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `article_id` | uuid | FK to articles |
| `question` | text | The pre-computed question text (displayed on button) |
| `answer` | text | Pre-generated answer (displayed on click) |
| `citation_paragraph` | integer | Paragraph index in article body |
| `order` | integer | Display order (1–4) |

### Cost control

| Mechanism | Purpose |
|-----------|---------|
| Pre-computed questions (free tier) | Zero marginal cost per reader |
| Subscriber gate on open-ended | Only paying users trigger LLM calls |
| Rate limit (10/article/day) | Prevent abuse |
| Prompt caching (if supported by LLM provider) | Reduce per-query cost by caching article context |
| Short context window | Only pass the single article text, not the entire site |

### Estimated costs

- Pre-computed: $0 per query (served from DB)
- Live query: ~$0.005–$0.02 per question (depending on article length and model — TBD)
- At 100 subscribers averaging 3 questions/day: ~$1.50–$6/day

---

## Design (from design system)

- Component: `.ask` container with `.ask__bar` header
- Suggested questions: `.ask__suggested` list of buttons
- Answer: `.ask__answer` block with `.ask__cite` citation
- Gate: `.ask__gate` bar with subscribe CTA
- Limits disclosure: `.ask__limits` ("Answers are drawn from this article only")
- Border-top: 3px solid `--ink` (distinguishes from The Record's `--signal` border)

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
