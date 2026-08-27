# Architecture: Distribution

**Last updated:** 2026-08-27

---

## Overview

Distribution is the automated fan-out that happens after an article is published. AINN does not rely on a single traffic channel — it pushes content to multiple platforms in format-native ways. The primary organic traffic source is Google News/Discover. Distribution channels exist to build brand equity, generate backlinks, and capture audiences where they already are.

---

## Channel Strategy

| Channel | Role | Format | Link behaviour |
|---------|------|--------|----------------|
| Google News / Discover | Primary organic traffic | Article page (via sitemap + schema) | Direct to site |
| X (brand account) | Brand equity + sentiment loop | Data-drop thread with chart image | Link at thread end |
| Reddit (r/AINN) | Backlinks + early indexing | Link post with summary | Direct to site |
| Substack | Email audience + SEO authority | Full article with canonical back | Canonical to site |
| Medium | SEO authority + discovery | Full article with canonical back | Canonical to site |
| YouTube Shorts | Visual audience + brand | 30–45s data narration reel | Verbal CTA only |
| TikTok | Visual audience + brand | Same reel as Shorts | Verbal CTA only |
| Instagram Reels | Visual audience + brand | Same reel as Shorts | Verbal CTA only |
| Hacker News | High-value tech traffic | Article link (manual, selective) | Direct to site |

---

## 1. X (Brand Account)

### Account setup
- Handle: TBD (institutional, not personal — e.g. @aaboratory or @aaboratory)
- X Premium: Required (algorithmic priority)
- Bio: Clear entity description linking to ainn.news + IIMAGINE disclosure
- Pinned: Introduction thread explaining what AINN is and the verification system

### Post format: "Value-First Thread"

Never post naked links. X suppresses outbound links. Instead:

**Post 1 (Hook):** Striking finding or chart image. No link.
```
AINN BENCHMARK ALERT: Kestrel Meridian-3

Claimed: 8-hour unsupervised workday
Actual: Failed at hour 4, task completion dropped to 31%

We ran the full test. Here's the raw data: 👇
```

**Post 2–3 (Value):** Chart images, sentiment data, key numbers. Give 80% of the value on-platform.

**Post 4 (Link):** "Full verification breakdown and interactive model comparisons live at ainn.news/news/{slug}"

### Automation

- Triggered automatically on article publish
- System generates: hook text, chart PNG (via Satori), thread copy
- Posts via X API v2 `POST /2/tweets` (threaded)
- Editor can override auto-generated copy before it posts (optional queue)

### Tagging strategy

- Tag company accounts and founders when publishing objective test results about their models
- This triggers notifications and potential quote-tweets from large accounts
- Only tag when the data is rigorous and the framing is neutral

### Boosting

- $2–5/day micro-budget on breakout posts (optional)
- Only boost: exclusive benchmark results, head-to-head comparisons, viral-potential threads
- Target: followers of major AI figures, labs, tech journalists
- Do NOT boost everyday summary articles

---

## 2. Reddit

### Subreddit: r/AINN (or r/AINN_News)

- Owned community space — no moderation risk from external subreddits
- Auto-post every article as a link post with a 2-sentence summary
- Pin an introduction post explaining AINN and the verification system
- Zero manual maintenance required

### Auto-syndication flow

1. Article publishes
2. 5-minute delay (avoid appearing automated)
3. Bot posts to r/AINN: link + headline + first sentence of dek
4. Flair set to article section (Models, Benchmarks, Sentiment, etc.)

### Cross-posting to larger subreddits (manual, selective)

- r/MachineLearning, r/singularity, r/LocalLLaMA — only for major findings
- Post the raw findings as a text post (Reddit hates link drops)
- Bio links back to ainn.news
- Only do this for genuinely interesting original research

### SEO benefit

Google indexes Reddit threads within minutes. Each r/AINN post creates a high-quality backlink that signals crawl urgency to Google for the target article URL.

---

## 3. Substack and Medium (Canonical Syndication)

### Purpose
- Build email audience (Substack)
- Leverage high domain authority for SEO (Medium DA 95+)
- Reach audiences who browse these platforms natively

### Implementation

1. Article publishes on ainn.news (the canonical source)
2. 30-minute delay
3. Full article text pushed to Substack newsletter post and Medium publication via their APIs
4. **Critical:** Both syndicated copies include `<link rel="canonical" href="https://ainn.news/news/{slug}">` pointing back to AINN
5. This tells Google the copies are legitimate syndication, not duplicates

### Substack newsletter

- Acts as the "free newsletter" referenced in the newsletter CTA
- Readers who subscribe on Substack get the same content as those who subscribe on-site
- Substack's built-in audience discovery helps with growth

### Medium publication

- Publication name: "AINN — AI News Network"
- Clean formatting matching AINN's wire-service tone
- Medium's internal recommendation algorithm surfaces content to relevant readers

---

## 4. Video Reels (YouTube Shorts, TikTok, Instagram Reels)

### Purpose
- Reach visual-first audiences who don't read text news
- Build brand recognition through consistent visual identity
- Zero direct link traffic expected — this is pure brand equity

### Format: 30–45 second data narration

**Structure:**
- 0–3s: Hook (striking finding stated as text + voiceover)
- 3–30s: Data display (chart scrolls, metrics highlight line-by-line, synced to VO)
- 30–45s: Institutional outro (AINN terminal interface mockup + verbal CTA "Full database at AINN.news")

**Visual layer:**
- 9:16 vertical format
- Styled to match AINN design system (dark ink background, Archivo headlines, mono metrics)
- Charts and tables animate in — not flashy, just functional reveals
- No stock footage, no AI-generated imagery, no human presenter needed

**Audio layer:**
- AI voiceover (ElevenLabs or similar — model TBD, ask Adam)
- Clean, neutral, authoritative tone — wire-service newsreader, not YouTuber energy
- No background music (feels more credible for a data service)

### Generation pipeline

1. Article publishes
2. System extracts: headline, 3 key data points, primary chart, verdict
3. Remotion (or equivalent) renders the video programmatically from a React template
4. AI voiceover generated from script
5. Combined into final MP4
6. Uploaded to YouTube, TikTok, Instagram via their APIs
7. Description contains "Full analysis: ainn.news/news/{slug}"

### Timing
- Video generation takes 1–4 hours (render + upload)
- Not all articles get videos — only those with clear visual data (benchmarks, comparisons)
- Target: 3–5 videos per week initially

---

## 5. Email Distribution

### Follow-story alerts

- When a followed story's verification status changes, subscribed readers get an email
- This is the unique promise: "We'll email you when this story's status changes"
- Not a regular newsletter — it's event-driven notification
- See `features/newsletter.md` for full spec

### Weekly digest (optional, lower priority)

- Compilation of the week's top 5 stories
- Clean, mono-styled email matching the site's aesthetic
- Sent via Resend

---

## 6. Hacker News (Manual)

- Not automated — HN detects and penalises bot submissions
- Editor manually submits the most interesting original research pieces
- Only 1–2 per week maximum
- Title format: "Show HN: We retested {model}'s claimed benchmark and found {finding}"
- HN upvotes can drive 10,000+ highly targeted visitors in hours

---

## Distribution Timing Summary

```
T+0:00  Article publishes
        → ISR revalidation
        → Google News sitemap updated
        → WebSub ping fired
        → OG image generated

T+0:01  X thread auto-posted (or queued for editor review)

T+0:05  Reddit r/AINN link post

T+0:30  Substack + Medium syndication (with canonical)

T+1:00  Follow-story email alerts (if status changed)

T+1-4h  Video reel rendered and uploaded (if applicable)

Manual  Hacker News submission (selective, editor decision)
```

---

## Anti-Spam Safeguards for Distribution

1. **Delays between channels** — never post everywhere simultaneously. Stagger over 30+ minutes.
2. **No identical copy across platforms** — X thread text ≠ Reddit summary ≠ Medium intro. Each is format-native.
3. **Reddit account age** — the bot account must be aged (30+ days, some karma) before posting to external subreddits.
4. **X rate limits** — respect API rate limits. No more than 10 threads per day.
5. **Canonical discipline** — every syndicated copy MUST point canonical back to ainn.news. No exceptions.

---

## Metrics to Track

| Metric | Source | Purpose |
|--------|--------|---------|
| Google News impressions | Search Console | Primary traffic health |
| Google Discover clicks | Search Console | Large-image card performance |
| X thread impressions | X Analytics | Brand reach |
| X engagement rate | X Analytics | Content resonance |
| Reddit r/AINN subscribers | Reddit | Community size |
| Substack subscribers | Substack dashboard | Email audience |
| Video views (Shorts/TikTok) | Platform analytics | Visual brand reach |
| Referral traffic by source | Vercel Analytics | Channel attribution |
| Dwell time from X referrals | Vercel Analytics | Content quality signal to Google |
