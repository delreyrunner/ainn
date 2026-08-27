# AINN Design System

Instructions for building pages on ainn.news. Read this fully before writing any markup.

**Import `ainn.css`. Do not redefine its tokens or components in page files.** Page files may add layout-only CSS scoped to that page. If you need a new component, add it to `ainn.css` and document it here — never fork it inline.

---

## 1. What AINN is

A wire service for AI news. Its one differentiating claim: **every story is labelled with how much of it we can stand behind, and we retest vendor benchmarks ourselves.**

Every design decision follows from that. The reader's job is fast triage of a firehose. Our job is to make the epistemic status of each claim impossible to miss. Density and typography carry credibility here — not photography, not gradients, not illustration.

**If a design choice makes the site look more like a tech startup and less like a wire service, it is wrong.**

---

## 2. Non-negotiables

1. **One accent colour.** Oxblood `--signal`. Never add a second hue. Semantic difference is carried by shape, weight, and rule style — not colour.
2. **Never use colour alone** to distinguish verification marks. The four marks differ by fill and border style so they survive greyscale and colour blindness.
3. **No generated or stock imagery. Ever.** No AI-generated art, no glowing brains, no robot hands. An outlet that tells readers what is real cannot illustrate with fabrications. Permitted images: data graphics, documentary photography of real subjects, and document scans.
4. **No third-party social or share widgets.** Build share links as plain anchors. No tracking embeds.
5. **Border-radius is 0 everywhere.** No shadows except none. Depth comes from rules and ground colour.
6. **No cold permission prompts.** Never call `Notification.requestPermission()` on load or on scroll. Only after an explicit user click on an opt-in control.
7. **Corrections are permanent.** A corrections slot renders even when empty, reading "None". Never remove it.

---

## 3. Tokens

Defined in `ainn.css`. Use the variables, never raw hex.

| Role | Token | Value |
|---|---|---|
| Page ground | `--paper` | `#E7EAEE` |
| Content surface | `--card` | `#FCFCFB` |
| Text, rules, dark panels | `--ink` | `#10141A` |
| Metadata | `--mute` | `#626C79` |
| Structural hairline | `--rule` | `#CBD1D9` |
| Internal divider | `--rule-soft` | `#E0E4E9` |
| Accent | `--signal` | `#8A1C2B` |
| Claim panel ground | `--signal-tint` | `#F3E7E8` |
| Accent on dark | `--signal-lift` | `#D08A93` |

**Type has three roles and no exceptions:**

- `--sans` **Archivo** — headlines, buttons, UI labels, section rules. Weights 600–800, tight tracking.
- `--serif` **Newsreader** — body prose only. Light 300 for deks, 400 for running text.
- `--mono` **IBM Plex Mono** — every timestamp, status, number, byline, benchmark figure, and small label. This is the AI beat's native vernacular. If it's data or metadata, it's mono.

Body text sets at `--measure` (70ch). Deks at 56ch. Never run prose full-width.

**Spacing** uses the `--s1`…`--s8` scale (4px base). Page gutters use `--pad`.

---

## 4. Verification marks — the core system

Four marks. Never invent a fifth. Never change what they mean.

```html
<span class="status"><span class="mark mark--verified"></span>Verified</span>
<span class="status status--claim"><span class="mark mark--claim"></span>Company claim</span>
<span class="status"><span class="mark mark--reported"></span>Reported</span>
<span class="status"><span class="mark mark--unconfirmed"></span>Unconfirmed</span>
```

| Mark | Shape | Means |
|---|---|---|
| Verified | Filled ink square | We saw the document, ran the test, or confirmed with two independent sources |
| Company claim | Hollow oxblood square | A lab or vendor says so; untested by us |
| Reported | Half-filled square | Sourced to named people or a credible outlet; not independently confirmed |
| Unconfirmed | Dashed grey square | Circulating and consequential, but unsettled |

**Rules of use:**
- Every story teaser, wire item, and article header carries a mark. No exceptions.
- On dark grounds, wrap in `.on-dark`.
- Marks may appear **inline mid-sentence** via `.claimtag` to label an individual assertion.
- Status text is always mono uppercase, always paired with the glyph — never the glyph alone.
- A page that explains the marks (footer legend or standards page) must be reachable from every page.

---

## 5. Components

### The Record — `.panel .panel--record`
Two-column ledger splitting confirmed from claimed. Sits **above** the article body, never below. Left column plain, right column `--signal-tint`. Each line carries a `<cite>` naming how it was confirmed.

Use on: any story where a vendor or third party has made a claim. That's most of them.

### Claim check table — `table.bench`
Their number, our number, delta. Delta is oxblood when the claim fails, `.ok` mute when it holds. Always followed by a caption linking to method and raw logs. **Never publish a delta without a link to the logs.**

### Share row — `.share`
Order is fixed: **Copy link** first (marked `.is-primary`), then X, LinkedIn, Bluesky, Reddit, Hacker News, then "Share The Record" pushed right.

```html
<div class="share">
  <span class="share__label">Share</span>
  <button class="is-primary" data-share-copy>Copy link</button>
  <a href="https://x.com/intent/post?text=…&url=…" rel="noopener">X</a>
  <a href="https://www.linkedin.com/sharing/share-offsite/?url=…" rel="noopener">LinkedIn</a>
  <a href="https://bsky.app/intent/compose?text=…" rel="noopener">Bluesky</a>
  <a href="https://news.ycombinator.com/submitlink?u=…&t=…" rel="noopener">Hacker News</a>
  <button class="share__record" data-share-record>Share The Record ↗</button>
</div>
```

On mobile, if `navigator.share` exists, replace Copy link with a native share trigger. Placement: once at the end of the article body. Not floating, not sticky, not in the header.

### Follow this story — `.follow`
**Email is the primary mechanism.** The promise is specific: *we email you when this story's verification status changes* — not when we publish more.

Browser push appears only as a secondary text link, `.follow__push`, and only fires the permission request on click. If permission is already denied, hide the option entirely rather than showing a dead control.

### Newsletter CTA — `.signup`
Sidebar or end-of-article. Promise attention, not money. One field, one button. Fine print states frequency and one-click unsubscribe.

### Support CTA — `.support`
Dark ink slab. **Must be anchored to the specific work the reader just consumed** — open with `.support__cost` stating what this piece cost (compute hours, reporter days, FOI fees). Generic "support journalism" copy is not acceptable.

Two actions: a primary membership button and a quiet one-off option. Close with a `.support__note` stating no lab funding.

**Never paywall:** verification marks, The Record, correction logs, the standards page. Those are the public good and the reason anyone trusts us.
**Paywall:** raw test logs, the claim-check database, the archive beyond 30 days, Ask the article.

### Ask the article — `.ask`
Conversational access to a single article's contents. This is the highest-risk component on the site.

**Hard constraints on the model behind it:**
1. Grounded strictly in this article and its cited sources. No outside knowledge.
2. Every answer cites the section it drew from, rendered in `.ask__cite`.
3. Out-of-scope questions get an explicit refusal that names the limit — never a plausible guess.
4. **It must respect the verification marks.** Asked about an unconfirmed detail, it says the detail is single-sourced and unconfirmed. It never launders a claim into a fact.
5. It never speculates about what happens next, and never restates a vendor claim without its mark.

**Interface:** 3–4 precomputed questions render as `.ask__suggested` buttons, free to all readers. The open-ended field is subscriber-gated via `.ask__gate`. `.ask__limits` states in plain text that answers come only from this article.

### Social links — `.social`
**Footer only.** Never in the masthead — that space belongs to sections. May also appear once at the end of an article. Text labels, not icons.

---

## 6. Page templates

**Home:** wire ticker → masthead → nav → lead + wire column → claim check → filtered story grid → standards legend → footer.

**Article:** wire ticker → compact masthead → progress bar → headline block with marks → The Record → three-column body (status rail / prose / aside) → inline claim check → update log → share row → sourcing slab → support CTA → read next → footer.

**Section index:** masthead → section rule → lead story → dense grid with marks → footer.

Common to all: `.shell` wrapper, `--pad` gutters, footer with legend link and standards link.

---

## 7. Copy rules

- **Sentence case in headlines.** Title Case reads as marketing.
- Headlines state what happened, not what it means. Specific over clever, always.
- Every number gets a source or a mark. No orphan statistics.
- Buttons say what happens: "Get the wire", not "Submit". The label persists through the flow — "Follow this story" produces "Following this story".
- Errors name what broke and how to fix it. They do not apologise and they are never vague.
- Empty states are invitations: "No corrections on this story" beats a blank space.
- Never write "revolutionary", "game-changing", "unprecedented", or "leverage". This is a wire service.

---

## 8. Quality floor

Non-optional on every page:

- Responsive to 360px. Three-column layouts collapse to one; tables drop their note column before they scroll.
- Visible keyboard focus everywhere — `:focus-visible` with a 2px oxblood ring at 3px offset.
- `prefers-reduced-motion` kills the ticker animation, the pulse, and smooth scroll. The ticker becomes horizontally scrollable rather than disappearing.
- Contrast: `--mute` on `--card` passes AA at 10px+ mono. Never place `--mute` on `--signal-tint`.
- All interactive controls are real `<button>` or `<a>` elements. No clickable divs.
- Marks carry accessible text — the glyph is decorative, the adjacent status label is the accessible name.
- Article pages ship `max-image-preview:large`, an OG card, and NewsArticle structured data.

---

## 9. Anti-patterns

Do not, under any circumstances:

- Add a second accent colour, or use green/red for pass/fail
- Round any corner or add a box-shadow
- Use icon-only buttons for share or social
- Put social icons in the masthead
- Fire a notification permission prompt without a click
- Illustrate a story with generated or stock imagery
- Show a benchmark number without its source or a delta without its logs
- Let the AI assistant answer beyond the article
- Hide a correction, or silently edit a published claim
- Use a serif for headlines or a sans for body prose — the pairing is deliberately inverted
- Add hero images to the wire column or the dense grid; density is the product
