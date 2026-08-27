# Architecture: SEO and Indexing

**Last updated:** 2026-08-27

---

## Overview

AINN's primary traffic source is Google News algorithmic inclusion. There is no manual application process — Google shifted to fully automated, algorithmic discovery. Our job is to send every technical signal that forces Google's Newsbot to index us rapidly and classify us as a legitimate news publisher.

---

## Google News Inclusion Strategy

### The "Freshness Exception"

Google treats news indexing differently from standard organic search. The news algorithm prioritizes real-time freshness and topical relevance over historical domain authority. This is our entry point as a new domain.

### Required Signals (Every Article Page)

1. **Google News Sitemap** — dedicated sitemap containing only articles from the last 48 hours
2. **NewsArticle Structured Data** — comprehensive JSON-LD with exact timestamps
3. **E-E-A-T Signals** — institutional byline, author page, transparency pages
4. **WebSub (PubSubHubbub)** — instant ping to Google hub on publish
5. **High Core Web Vitals** — sub-second LCP, zero CLS, fast FID
6. **`max-image-preview:large`** — meta robots tag for Google Discover eligibility

---

## 1. Sitemaps

### Google News Sitemap (`/api/sitemap/news.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://ainn.news/news/kestrel-meridian-3-test</loc>
    <news:news>
      <news:publication>
        <news:name>AINN</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2026-08-27T09:41:00+00:00</news:publication_date>
      <news:title>Kestrel says Meridian-3 runs a full workday unsupervised. We gave it eight hours.</news:title>
    </news:news>
  </url>
</urlset>
```

**Rules:**
- Only articles published within the last 48 hours
- Automatically evict articles when they hit 48 hours old
- Maximum 1000 URLs
- Regenerated on every publish event (ISR or on-demand)

### Standard Sitemap (`/api/sitemap/index.xml`)

- All article URLs (including those evicted from news sitemap)
- Section pages, standards, about, corrections
- Updated daily
- `lastmod` reflects `dateModified` on each article

### robots.txt

```
User-agent: *
Allow: /

Sitemap: https://ainn.news/api/sitemap/news.xml
Sitemap: https://ainn.news/api/sitemap/index.xml
```

---

## 2. Structured Data (JSON-LD)

Every article page must serve this in the `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://ainn.news/news/{slug}"
  },
  "headline": "{article headline — max 110 chars}",
  "image": [
    "https://ainn.news/api/og/{slug}.png"
  ],
  "datePublished": "2026-08-27T09:41:00+00:00",
  "dateModified": "2026-08-27T11:20:00+00:00",
  "author": {
    "@type": "Organization",
    "name": "AINN Research Desk",
    "url": "https://ainn.news/about#editorial"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AINN",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ainn.news/logo.png"
    },
    "sameAs": [
      "https://x.com/aaboratory",
      "https://www.reddit.com/r/AINN/"
    ]
  },
  "description": "{article dek — max 200 chars}",
  "mentions": [
    {
      "@type": "Thing",
      "name": "{entity name}",
      "sameAs": "{wikipedia or wikidata URL if available}"
    }
  ]
}
```

### FactCheck Schema (Optional, for Claim-Test Articles)

When an article explicitly tests a vendor's claim:

```json
{
  "@context": "https://schema.org",
  "@type": "ClaimReview",
  "claimReviewed": "{the exact claim text}",
  "itemReviewed": {
    "@type": "Claim",
    "author": {
      "@type": "Organization",
      "name": "{vendor name}"
    }
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "{1-5 scale}",
    "bestRating": 5,
    "alternateName": "{Verified | Partly Verified | Under Review | Unsubstantiated}"
  },
  "author": {
    "@type": "Organization",
    "name": "AINN Research Desk"
  }
}
```

This can earn specialized rich snippets in Google search results.

---

## 3. Meta Tags (Per Article)

```html
<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta property="og:type" content="article">
<meta property="og:title" content="{headline}">
<meta property="og:description" content="{dek}">
<meta property="og:image" content="https://ainn.news/api/og/{slug}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://ainn.news/news/{slug}">
<meta property="article:published_time" content="{ISO 8601}">
<meta property="article:modified_time" content="{ISO 8601}">
<meta property="article:section" content="{section name}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@aaboratory">
<meta name="twitter:title" content="{headline}">
<meta name="twitter:description" content="{dek}">
<meta name="twitter:image" content="https://ainn.news/api/og/{slug}.png">
<link rel="canonical" href="https://ainn.news/news/{slug}">
```

**`max-image-preview:large` is critical.** Google Discover requires it for large image cards — a major traffic source for tech news.

---

## 4. OG Image Generation

Every article gets a programmatically generated 1200x630 PNG card via Satori:

**Card layout:**
- Oxblood top rule (brand recognition in feeds)
- Archivo headline (truncated to 2 lines)
- Verification status glyph + label
- Key metric in IBM Plex Mono (e.g. "AINN RETEST: −11.2%")
- "AINN" wordmark bottom-left

**Why programmatic, not photographic:**
- Consistent brand in every feed (Google Discover, X cards, LinkedIn previews)
- Carries the verification claim INTO the feed — the whole brand proposition
- Costs nothing per article
- Never looks like stock
- Instantly recognisable at scroll speed

**Implementation:** Satori (JSX → SVG) + resvg-js (SVG → PNG), served from `/api/og/[slug].png` with aggressive caching (immutable after first generation, bust on `dateModified` change).

---

## 5. WebSub (PubSubHubbub)

On every publish event, ping the Google-supported hub:

```
POST https://pubsubhubbub.appspot.com/
Content-Type: application/x-www-form-urlencoded

hub.mode=publish&hub.url=https://ainn.news/feed.xml
```

This tells Googlebot exactly where to look within seconds of publishing. Requires maintaining an Atom or RSS feed that supports WebSub.

### Feed (`/feed.xml`)

Standard Atom feed with WebSub headers:

```xml
<feed xmlns="http://www.w3.org/2005/Atom">
  <link rel="hub" href="https://pubsubhubbub.appspot.com/" />
  <link rel="self" href="https://ainn.news/feed.xml" />
  <!-- entries -->
</feed>
```

---

## 6. Page Performance Requirements

| Metric | Target | Why |
|--------|--------|-----|
| LCP | < 1.2s | Google News ranking factor |
| FID/INP | < 100ms | Interaction responsiveness |
| CLS | < 0.05 | No layout shifts (no lazy images in viewport) |
| TTFB | < 200ms | Vercel edge + ISR ensures this |
| Page size | < 150KB initial HTML | Dense text, minimal assets |

### How we achieve this:

- **ISR (Incremental Static Regeneration):** Articles are pre-rendered as static HTML. Revalidation on publish or edit.
- **No heavy JS on initial load:** Charts are inline SVG. The ticker, Ask the Article, and widget hydrate after first paint.
- **Font subsetting:** Only load weights actually used (Archivo 600–800, Newsreader 300–400, Plex Mono 400–500).
- **No third-party scripts:** No analytics trackers, no social embeds, no ad networks on launch.

---

## 7. E-E-A-T Infrastructure

### Required permanent pages

| Route | Purpose |
|-------|---------|
| `/about` | Organization description, founding, mission, team |
| `/about#editorial` | Author profile for "AINN Research Desk" (the institutional byline) |
| `/standards` | Verification mark definitions, editorial methodology, sourcing policy |
| `/corrections` | Append-only corrections log (renders "No corrections" when empty) |
| `/disclosure` | Ownership disclosure: relationship with IIMAGINE.AI, funding sources, no lab sponsorship |

### Organization Schema (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "name": "AINN",
  "alternateName": "AI News Network",
  "url": "https://ainn.news",
  "logo": "https://ainn.news/logo.png",
  "sameAs": [
    "https://x.com/aaboratory",
    "https://www.reddit.com/r/AINN/"
  ],
  "foundingDate": "2026",
  "founder": {
    "@type": "Person",
    "name": "Adam Radly",
    "sameAs": ["https://x.com/adamradly", "https://linkedin.com/in/adamradly"]
  },
  "ethicsPolicy": "https://ainn.news/standards",
  "correctionsPolicy": "https://ainn.news/corrections",
  "ownershipFundingInfo": "https://ainn.news/disclosure"
}
```

---

## 8. Domain Authority Building (First 90 Days)

### Week 1–2: Foundation
- Deploy site with 5–10 seed articles (high-quality, original benchmark data)
- Submit news sitemap
- Set up WebSub pings
- Create Reddit subreddit + auto-syndication
- Register with Google Publisher Center (branding/logo only — inclusion is algorithmic)

### Week 3–4: Volume ramp
- Scale to 2–3 articles per day
- Each article must contain unique data (benchmarks or sentiment)
- Monitor Google Search Console for indexing status
- Ensure no "Crawled but not indexed" issues

### Month 2–3: Authority signals
- Syndicate to Medium/Substack with canonical links back
- Build inbound links from Reddit threads, HN submissions
- Monitor Google Discover traffic (requires `max-image-preview:large` + consistent publishing)
- Scale to 5–8 articles per day if quality holds

### Ongoing
- Never exceed 12 articles/day without monitoring spam signals
- If Google flags any pages as "Excluded by 'noindex' tag" or "Duplicate without user-selected canonical" — investigate immediately
- `dateModified` must ONLY update on genuine editorial changes. Never fake freshness.
