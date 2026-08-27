# Reference: Brand Messaging and Copy Rules

**Last updated:** 2026-08-27

---

## Brand Identity

**Name:** AINN (AI News Network)
**Tagline options (TBD — pick one):**
- "The wire that retests the claims."
- "AI news. Verified."
- "Every claim. Checked."

**What AINN is:** An independent wire service for the AI industry that independently verifies vendor claims, retests benchmarks, and maps real-time public sentiment.

**What AINN is not:** A blog. A startup marketing site. A content farm. An opinion outlet. A PR amplification service.

**Tone:** Wire service. Authoritative, dense, factual, fast. Think Reuters financial wire or early Bloomberg terminal — not TechCrunch, not The Verge.

---

## Voice Rules

### We are:
- Factual, not interpretive
- Dense, not padded
- Direct, not clever
- Specific, not vague
- Institutional, not personal

### We never:
- Editorialize in headlines (headlines state what happened, not what it means)
- Use superlatives ("revolutionary", "game-changing", "unprecedented", "groundbreaking")
- Use startup jargon ("leverage", "synergy", "disrupt", "democratize")
- Use hype language ("mind-blowing", "insane", "wild")
- Speculate about implications without marking it as analysis
- Present a vendor claim as a fact

---

## Headline Rules

1. **Sentence case.** Title Case reads as marketing.
2. **State what happened, not what it means.** "Kestrel says Meridian-3 runs a full workday unsupervised" not "Is the AI Workday Finally Here?"
3. **Include the actor.** Who did the thing? Name them.
4. **Specific over clever.** No puns, no questions, no teases.
5. **If it's a claim test:** Lead with the claim and follow with what we found. "Kestrel says Meridian-3 runs a full workday unsupervised. We gave it eight hours."
6. **Max 110 characters** (for schema compatibility and OG card rendering).

### Examples of good headlines:
- "Meta releases Llama 4 70B. Benchmarks match GPT-5 on reasoning tasks."
- "Anthropic's Claude 4 accuracy claims hold in our testing. Latency does not."
- "X sentiment on OpenAI's o3 model shifts negative after 48 hours of production use"
- "Google withdraws Gemini 3 Pro pricing within 6 hours of announcement"

### Examples of bad headlines:
- "The AI Wars Just Got Real" (editorializing)
- "Is Kestrel's Meridian-3 the Future of Autonomous AI?" (question, speculative)
- "BREAKING: Massive New Model Changes Everything" (hype, no specifics)
- "Why This Model Release Matters More Than You Think" (opinion, clickbait)

---

## Body Copy Rules

1. **Every number gets a source or a mark.** No orphan statistics. If we cite "92% accuracy" it must be attributed: (vendor claim), (our test), (third-party report, name the outlet).
2. **Verification marks appear inline when a specific assertion's status matters.** "The model achieves 8-hour autonomy [COMPANY CLAIM] on standard office tasks."
3. **Short paragraphs.** Wire style. 2–3 sentences per paragraph maximum.
4. **Lead with the finding, not the context.** Put the news first, then explain why it matters.
5. **Active voice.** "We tested" not "tests were conducted". "Kestrel claims" not "it has been claimed by Kestrel".
6. **Name the tool.** "According to AINN testing using the IIMAGINE benchmark suite" — attribution is transparency.

---

## Button and Label Copy

- **Buttons say what happens.** "Get the wire" not "Submit". "Follow this story" not "Subscribe".
- **Labels persist through the flow.** "Follow this story" → "Following this story" (not "Subscribed!").
- **Errors name what broke.** "We couldn't verify that email address. Check the format and try again." Never: "Something went wrong."
- **Empty states are invitations.** "No corrections on this story" beats a blank space. "No updates yet — we'll add them here when the status changes."

---

## Forbidden Words and Phrases

Never use these in any AINN content (articles, CTAs, UI copy, metadata):

| Forbidden | Why | Use instead |
|-----------|-----|-------------|
| "Revolutionary" | Hype, unverifiable | Describe specifically what changed |
| "Game-changing" | Same | Same |
| "Unprecedented" | Almost always false | "First time {specific thing}" if actually true |
| "Leverage" (as verb) | Corporate jargon | "Use" |
| "Disrupt" / "disruption" | Startup branding language | Describe the specific impact |
| "Democratize" | Meaningless in this context | Describe who gains access |
| "Best-ever" | Unverifiable absolute | "{X}% improvement over {Y}" |
| "Slam" / "blast" / "destroy" (in test context) | Tabloid language | "Outperformed by {X}%" |
| "Breaking" (in headlines) | Overused, loses meaning | Just state the news |

---

## CTA Copy Patterns

### Newsletter
- Promise: "The AI wire. In your inbox. Weekly."
- Button: "Get the wire"
- Fine print: "One email per week. One-click unsubscribe."

### Follow story
- Promise: "We'll email you when this story's verification status changes."
- Button: "Follow this story"
- Subtitle: "Not a newsletter — we only write when something changes."

### Membership
- Lead: "{Cost anchor about this specific piece}"
- Headline: "This kind of testing doesn't fund itself."
- Button (primary): "Become a member"
- Button (secondary): "One-time contribution"
- Footnote: "AINN accepts no lab funding or sponsored content."

### Ask the Article (gate)
- Gate text: "Ask unlimited questions about this article. Members only."
- Button: "Subscribe to ask"
- Scope note: "Answers are drawn from this article only."

---

## Disclosure Language (Permanent)

For the standards/disclosure page footer and article boilerplate:

> AINN (AI News Network) is an independent wire service. Testing infrastructure and raw performance benchmark data are powered by IIMAGINE.AI. AINN maintains absolute editorial independence regarding analysis and reporting outcomes. We accept no lab funding, sponsored content, or vendor review units. Our testing uses the same public APIs and weights available to anyone.

---

## Corrections Policy

> When AINN makes an error of fact, we correct it publicly. Corrections appear at the bottom of the affected article with a timestamped note explaining what was wrong and what is now correct. The correction is permanent — we do not silently edit published claims. A running log of all corrections is maintained at ainn.news/corrections.

---

## SEO Title and Description Patterns

### Article pages
- `<title>`: `{headline} — AINN`
- `<meta name="description">`: `{dek}. {Primary mark status}. Data from AINN independent testing.`

### Homepage
- `<title>`: `AINN — AI News Network | Verified AI news and independent benchmarks`
- `<meta name="description">`: `Real-time AI industry coverage with independent benchmark testing and verification marks on every claim. The wire service that retests vendor claims.`

### Section pages
- `<title>`: `{Section} — AINN`
- `<meta name="description">`: `{Section} coverage from AINN. Every claim verified, every benchmark independently tested.`

---

## Social Post Copy Patterns

### X thread (auto-generated, editor can override)

**Post 1 (Hook):**
```
{STRIKING FINDING OR DATA POINT}

{One-sentence context}

We ran the full test. Data below: 👇
```

**Post 2–3 (Value):**
```
{Chart image or data table screenshot}

{2–3 bullet points of key findings}
```

**Post 4 (Link):**
```
Full verification breakdown and methodology:
ainn.news/news/{slug}
```

### Reddit (auto-generated)

Title: `{headline}`
Body: First sentence of dek + "[Full article with data]({url})"

---

## Tone Calibration Examples

### Too casual (wrong):
"Wow, so we ran the tests and honestly? Meridian-3 totally bombed. Like, it wasn't even close."

### Too academic (wrong):
"Our empirical investigation utilizing a comprehensive battery of standardized evaluation metrics suggests statistically significant underperformance relative to the manufacturer's published specifications."

### Right (wire service):
"Kestrel claims Meridian-3 sustains autonomous operation for 8+ hours. In our testing, task completion dropped below functional thresholds at hour 4. The full test log is available to members."
