# Feature: Newsletter and Follow Story

**Status:** Planned
**Last updated:** 2026-08-27
**Depends on:** Articles feature, email infrastructure (Resend)
**Key files:** `src/lib/email/`, `src/app/api/newsletter/`, `src/app/api/follow/`

---

## Objective

Two distinct email products: (1) a general newsletter for readers who want regular AI news updates, and (2) a "follow this story" mechanism that emails subscribers when a specific story's verification status changes. The follow-story product is the unique differentiator — no other news outlet offers status-change alerts because no other outlet tracks verification status.

---

## Current State

| Functionality | Status | Objective | Notes |
|---------------|--------|-----------|-------|
| Newsletter signup | planned | Single email field + submit button. Sidebar or end-of-article placement. Promise: curated AI news, weekly (or daily digest). One-click unsubscribe. | CTA component: `.signup` in design system |
| Follow this story | planned | Email-first mechanism. Promise: "We email you when this story's verification status changes." Not a general notification — highly specific. | CTA component: `.follow` in design system |
| Browser push (secondary) | planned | Text link beneath follow-story. Only fires permission request on explicit click. Hidden entirely if permission already denied. | Never a cold prompt. Never on page load. |
| Status-change email | planned | When an article's verification mark changes (claim → verified, or claim → unconfirmed), all followers of that story receive an email. | Event-driven, not scheduled |
| Weekly digest | planned | Compilation of top 5 stories from the past week. Clean mono-styled email. | Lower priority than follow-story |
| Unsubscribe | planned | One-click unsubscribe link in every email. Immediate effect, no confirmation page. | Legal requirement |
| Double opt-in | planned | Confirmation email after signup to verify email address. | Anti-spam best practice |

---

## Architecture

### Newsletter vs Follow — two separate lists

| Product | Trigger | Content | Frequency |
|---------|---------|---------|-----------|
| Newsletter | User signs up via `.signup` CTA | Weekly digest of top stories | Weekly (or configurable) |
| Follow story | User enters email on `.follow` CTA for a specific article | Status-change notification for that article only | Event-driven (when mark changes) |

A user can be on both lists. They are separate opt-ins with separate unsubscribe paths.

### Database: `subscribers` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `email` | text (unique) | Subscriber email |
| `type` | enum | `newsletter` or `follow_story` |
| `article_id` | uuid (nullable) | FK to articles (only for `follow_story` type) |
| `confirmed` | boolean | Whether double opt-in completed |
| `confirmation_token` | text | Token for double opt-in email |
| `unsubscribe_token` | text | One-click unsubscribe token |
| `created_at` | timestamptz | When they subscribed |
| `unsubscribed_at` | timestamptz (nullable) | When they unsubscribed (soft delete) |

### Follow-story event flow

```
[Editor changes article verification mark]
        │
        ▼
[System detects mark change on article]
        │
        ▼
[Query subscribers WHERE type='follow_story' AND article_id=X AND confirmed=true AND unsubscribed_at IS NULL]
        │
        ▼
[Send status-change email via Resend to each subscriber]
        │
        ▼
[Email content: "The story '{headline}' has been updated. 
 Previous status: Company claim
 New status: Verified by AINN
 What changed: {brief explanation}
 Read the full update: {link}"]
```

### Email templates (via Resend)

| Template | Trigger | Content |
|----------|---------|---------|
| Confirmation | On signup/follow | "Confirm your email to follow this story" + confirmation link |
| Status change | On mark change | Story title + old mark → new mark + what changed + read link |
| Weekly digest | Cron (Sunday evening) | Top 5 stories with headlines + marks + links |
| Welcome | After confirmation | Brief welcome + what to expect + standards page link |

### Browser push (secondary, low priority)

- Only appears as a text link: "Or get browser notifications" beneath the follow-story email field
- On click: calls `Notification.requestPermission()`
- If already denied: hide the option entirely (check `Notification.permission === 'denied'`)
- If granted: subscribe to push via service worker
- Same trigger as email: fires on verification mark change
- Never fires on page load. Never fires on scroll. Never fires without explicit click.

---

## Design (from design system)

### Newsletter CTA (`.signup`)
- Placement: sidebar or end-of-article
- Single email field + submit button
- Promise: "The AI wire. In your inbox. Weekly."
- Fine print: frequency + one-click unsubscribe

### Follow story (`.follow`)
- Placement: within or after the article body
- Left border: 3px solid `--signal` (oxblood)
- Headline: "Follow this story"
- Subtitle: "We'll email you when the verification status changes — not when we publish more."
- Email field + "Follow" button
- Secondary push link below (`.follow__push`)

---

## Copy rules

- Newsletter CTA promises attention: "The AI wire. In your inbox."
- Follow-story CTA promises specificity: "We'll email you when this story's status changes."
- Never use generic "Subscribe for updates" — always state exactly what the reader will receive
- Unsubscribe link text: "Unsubscribe instantly" (not "manage preferences")

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
