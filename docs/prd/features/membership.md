# Feature: Membership

**Status:** Planned
**Last updated:** 2026-08-27
**Depends on:** Auth (Better Auth or magic link), Stripe, articles feature
**Key files:** `src/lib/billing/`, `src/lib/auth/`, `src/app/(members)/`

---

## Objective

A paid membership tier that funds AINN's independent testing operations while gating premium features behind a subscription. The paywall boundary is deliberately drawn to keep the public good (verification marks, corrections, standards) free forever, while gating depth (raw logs, archive, AI assistant) for paying members. The support CTA is always anchored to the specific cost of the work the reader just consumed.

---

## Current State

| Functionality | Status | Objective | Notes |
|---------------|--------|-----------|-------|
| Membership signup | planned | Simple email + password (or magic link). Stripe checkout for payment. | Monthly or annual pricing TBD |
| Support CTA | planned | Dark ink slab at end of article. Opens with specific cost of that piece ("This retest took 14 hours of compute"). Primary + quiet secondary action. | Component: `.support` in design system |
| Free tier access | planned | All article pages, verification marks, The Record, corrections, standards page — always free. | Non-negotiable. These are the public good. |
| Premium: Raw test logs | planned | Full benchmark logs from our testing infrastructure. Linked from bench table delta. | Route: `/logs/{test-id}` (gated) |
| Premium: Claim-check database | planned | Searchable database of all claims tracked and their current verification status. | Route: `/database` (gated) |
| Premium: Full archive | planned | Articles older than 30 days (free tier shows last 30 days only). | Route: `/archive` (gated) |
| Premium: Ask the Article (open-ended) | planned | Unlimited AI Q&A on articles (suggested questions remain free). | See `features/ask-the-article.md` |
| One-off support | planned | Option to make a single contribution without subscribing. | Secondary button on support CTA |
| Billing management | planned | Cancel, upgrade, view invoices via Stripe customer portal. | Standard Stripe portal integration |

---

## Paywall Boundary (Non-Negotiable)

### Always free (never paywall these):
- Article pages (full text, all marks, The Record, bench tables)
- Verification marks and their explanations
- The corrections page
- The standards page
- The disclosure page
- The newsletter
- Follow-story email alerts
- Suggested questions (pre-computed) in Ask the Article
- The model widget

### Gated (requires membership):
- Raw test logs (the full output of our benchmarks)
- Claim-check database (structured search across all tracked claims)
- Archive beyond 30 days
- Open-ended Ask the Article (live LLM queries)
- Future premium features (API access, data exports)

### Rationale

The verification marks and transparent reporting are the public good that builds trust and earns Google News authority. Paywalling them would destroy the brand's credibility and make it impossible to go viral on X or HN. What we paywall is depth — the raw evidence, the structured database, the historical record, and the AI assistant. This gives members genuine value while keeping the surface layer accessible.

---

## Architecture

### Auth

- Magic link email (via Resend) or email + password
- Session-based (cookie)
- Better Auth is the planned library (same as IIMAGINE) but could be simpler given AINN's needs — ask Adam

### Stripe integration

| Stripe Object | AINN Purpose |
|---------------|-------------|
| Product | "AINN Membership" |
| Price (monthly) | TBD — likely $9–15/mo |
| Price (annual) | TBD — likely $89–129/yr (discount) |
| Customer | Maps to `members` table |
| Subscription | Recurring billing |
| Checkout Session | Signup flow |
| Customer Portal | Self-service cancel/upgrade |
| Webhook | `customer.subscription.created`, `customer.subscription.deleted`, `invoice.payment_failed` |

### Database: `members` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `email` | text (unique) | Member email |
| `stripe_customer_id` | text | Stripe customer reference |
| `stripe_subscription_id` | text | Active subscription |
| `plan` | enum | `monthly`, `annual` |
| `status` | enum | `active`, `past_due`, `cancelled`, `expired` |
| `created_at` | timestamptz | When they first subscribed |
| `cancelled_at` | timestamptz (nullable) | When they cancelled |
| `current_period_end` | timestamptz | When current billing period ends |

### Gating logic

```typescript
// Middleware or page-level check
function requireMember(request) {
  const session = getSession(request);
  if (!session) redirect('/subscribe');
  const member = getMember(session.userId);
  if (!member || member.status !== 'active') redirect('/subscribe');
}
```

For inline gating (Ask the Article open-ended field):
- Check membership status client-side (session cookie)
- Show `.ask__gate` with subscribe CTA if not a member
- Server validates membership before processing any LLM query

---

## Design (from design system)

### Support CTA (`.support`)
- Dark ink slab (`background: var(--ink)`)
- Opens with `.support__cost`: "This investigation used 14 hours of GPU compute and required two FOIA requests."
- Headline: "This kind of testing doesn't fund itself."
- Body: Explains what membership enables (specific, not generic)
- Actions: Primary "Become a member" + quiet "One-time contribution"
- Closes with `.support__note`: "AINN accepts no lab funding or sponsored content."

### Subscribe page (`/subscribe`)
- Clean layout explaining what's included
- Two pricing cards (monthly + annual)
- Stripe checkout integration
- Trust signals: "Verification marks stay free", "Cancel anytime", "No lab funding"

---

## Copy rules for support CTA

- **Must** open with the specific cost of the piece the reader just consumed
- **Must not** use generic "support journalism" or "help us keep the lights on"
- **Must** state the no-lab-funding policy
- The cost anchor makes the ask concrete: "This retest took 14 hours of compute" → reader understands what their $12/mo enables

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
