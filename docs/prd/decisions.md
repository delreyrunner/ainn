# Product and Architecture Decisions

**Purpose:** Log of significant product and architecture decisions with rationale. Newest first.

---

## 2026-08-27 — No generated or stock imagery, ever

**Decision:** AINN will never use AI-generated images, stock photography, or illustration on the site. Permitted visuals: data graphics (SVG charts), documentary photography of real subjects, and document scans.

**Rationale:** An outlet whose entire proposition is telling readers what's real cannot illustrate its stories with fabrications. This extends to OG cards — they are programmatic data cards (headline + mark + metric), not decorative art. The restriction is a differentiator, not just a constraint. It will be stated on the standards page.

---

## 2026-08-27 — Institutional byline, not personal

**Decision:** All articles are attributed to "AINN Research Desk" (or the specific reporter if one is on record). Never to Adam personally, and never to "Admin" or a generic name.

**Rationale:** AINN must be sellable independently. Tying the brand to a single person undermines institutional authority and makes the asset non-transferable. Google's E-E-A-T guidelines accept institutional bylines for news organizations. The editorial team may rotate; the byline persists.

---

## 2026-08-27 — Email-first for follow-story, not browser push

**Decision:** The "follow this story" feature uses email as the primary mechanism. Browser push is a secondary text link that only fires the permission prompt on explicit click.

**Rationale:** Web push has low opt-in rates. An unprompted permission dialog on first visit reads as spammy — the wrong signal for a trust-focused outlet. Email lets us make a specific promise that push can't: "We'll email you when this story's status changes." That's a genuinely novel product promise. Push is offered as an option after follow, never cold.

---

## 2026-08-27 — Paywall depth, not surface

**Decision:** Verification marks, The Record, full article text, corrections, and standards are always free. Raw logs, claim-check database, archive beyond 30 days, and Ask the Article (open-ended) are gated behind membership.

**Rationale:** The verification marks ARE the brand. Paywalling them would prevent virality on X and HN, destroy trust, and eliminate Google News eligibility. What readers pay for is depth — the evidence behind the marks, the historical record, and the AI assistant. This model mirrors successful implementations at The Information and Stratechery.

---

## 2026-08-27 — Single domain, no subdomains

**Decision:** Everything lives on `ainn.news`. No `app.ainn.news` or `api.ainn.news`.

**Rationale:** Maximum domain authority consolidation. Every page, every backlink, every Google News impression builds authority on one domain. The site is simple enough (content + membership) that subdomain separation adds complexity without benefit.

---

## 2026-08-27 — ISR over SSR for article pages

**Decision:** Article pages use Incremental Static Regeneration with on-demand revalidation on publish/edit.

**Rationale:** Static pages are faster (better Core Web Vitals), cheaper (less compute), and more reliable. Revalidation happens on publish events so content is always fresh. The wire ticker and Ask the Article hydrate client-side after the static content loads. Google indexes the static HTML immediately.

---

## 2026-08-27 — Wire ticker isolated from server render

**Decision:** The real-time wire ticker loads client-side via a lightweight API endpoint (`/api/wire`), not server-rendered.

**Rationale:** If the ticker were SSR, every page would have different HTML on every crawl (because the ticker updates constantly). Google would waste crawl budget re-indexing sidebar content. By isolating it client-side, the core article HTML stays stable and cacheable.

---

## 2026-08-27 — Satori for OG images, not screenshots or templates

**Decision:** OG cards are generated via Satori (JSX → SVG → PNG) at publish time.

**Rationale:** Programmatic generation from article data means: consistent brand in every feed, zero per-article design cost, carries the verification mark into the feed (the whole brand), and never looks like stock. Bloomberg and The Information use similar approaches.

---

## 2026-08-27 — X API for distribution, not just monitoring

**Decision:** AINN uses the X API for both reading (sentiment collection) and writing (auto-posting threads).

**Rationale:** The value-first thread format (hook → data → link at end) is the highest-leverage distribution on X. Automating it ensures every article gets distributed within minutes of publishing. The $100/mo Basic API tier covers both read and write needs.

---

## 2026-08-27 — Reddit subreddit as owned distribution channel

**Decision:** Create and maintain r/AINN (or r/AINN_News) as an auto-syndication target.

**Rationale:** (1) Google indexes Reddit threads within minutes — instant backlinks for new articles. (2) No moderation risk from external subreddits. (3) Zero maintenance — auto-post on publish. (4) Builds a community asset over time.

---

## 2026-08-27 — Pre-compute Ask the Article questions at publish time

**Decision:** 3–4 suggested questions and their answers are generated alongside the article draft, stored in the database, and served at zero marginal cost. Only the open-ended field triggers live LLM calls.

**Rationale:** Free users clicking suggested questions should not incur LLM costs. By pre-computing, we can offer the feature to all readers as a dwell-time booster while keeping the expensive open-ended version behind the subscriber gate. Also improves latency — answers are instant from DB.

---

## 2026-08-27 — Canonical syndication to Substack and Medium

**Decision:** Full articles push to Substack and Medium with `<link rel="canonical">` pointing back to ainn.news.

**Rationale:** Substack builds an email audience via its internal discovery. Medium (DA 95+) provides SEO authority via backlinks. Canonical tags ensure Google credits ainn.news as the source. This is pure leverage — the same content serves three audiences with no additional creation cost.

---

## 2026-08-27 — Programmatic video reels for short-form platforms

**Decision:** Generate 30–45 second data narration videos (AI voiceover + motion graphics) from article data for YouTube Shorts, TikTok, and Instagram Reels.

**Rationale:** Short-form feeds are algorithmic — a brand-new account can get 10,000+ views on its first upload. No direct link traffic expected, but pure brand equity with visual-first audiences who don't read text news. Cost: AI voiceover + render time, no human editing needed.
