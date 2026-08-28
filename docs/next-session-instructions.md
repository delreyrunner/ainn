# AINN — Next Session Instructions

## Project

- Path: `/Users/adam/Documents/ainn`
- Domain: ainewsnet.com
- Repo: https://github.com/delreyrunner/ainn.git
- Stack: Next.js 16, TypeScript, Tailwind v4, Drizzle, Neon Postgres, Better Auth, Resend, Vercel
- Package manager: pnpm

## Before you start

1. Read `docs/prd/INDEX.md` — the master PRD with all features, architecture, and decisions
2. Read `docs/design/ainn-design-system.md` — the design system with all component specs and rules
3. Read `src/lib/get-current-user.ts` — RBAC roles and permission helpers
4. Do NOT use EVE framework. This project does NOT use EVE. It's a standalone Next.js site.

## Current state (as of 2026-08-28)

### What's built and working:
- Public site with `(site)` route group: homepage, article page (`/news/[slug]`), standards, corrections, about, disclosure
- Admin panel with `(app)` route group: dashboard, articles list, new/edit article, team management, profile
- Sidebar with collapsible nav, logout, mobile bottom nav
- Auth: signup, login, forgot/reset password, email verification (via Resend, domain verified: ainewsnet.com)
- RBAC: super_admin, admin, team_member, subscriber (permission helpers in `get-current-user.ts`)
- DB: 11 AINN tables + Better Auth tables (user, session, account, verification) in Neon
- Google News sitemap at `/api/sitemap/news.xml` (48-hour window)
- Standard sitemap at `/api/sitemap/index.xml`
- robots.txt pointing to both sitemaps
- NewsArticle JSON-LD on article pages
- OG image generation at `/api/og/[slug].png` (Satori + ImageResponse, edge runtime)
- Share row (Copy link, X, LinkedIn, Bluesky, HN)
- Verification marks system (4 marks: verified, claim, reported, unconfirmed)
- The Record panel (confirmed vs claimed two-column ledger)
- Bench table (vendor claim vs our test, delta with color)
- Design system tokens in `globals.css` (Archivo, Newsreader, IBM Plex Mono, oxblood accent)

### What's NOT built yet (priority order):
1. **Publish flow enforcement** — team_members should only save as draft/review, not push to live. Use `canPublishArticles()` from get-current-user.ts.
2. **Newsletter/follow-story** — email collection UI + API endpoints + Resend templates
3. **Content pipeline** — LLM-based article generation from structured data (needs OPENAI_API_KEY)
4. **News Radar** — automated monitoring (HuggingFace Hub, GitHub releases, X lists, RSS feeds)
5. **Model Widget** — interactive comparison tool at `/widget`
6. **Ask the Article** — AI Q&A grounded in article content (subscriber-gated)
7. **Membership/Stripe** — paid tier with paywall boundaries
8. **Distribution** — X auto-posting, Reddit, Substack/Medium syndication, video reels

## Key files to understand

| File | Purpose |
|------|---------|
| `src/db/schema.ts` | All Drizzle table definitions |
| `src/db/index.ts` | DB connection (postgres driver, globalThis cache) |
| `src/lib/auth.ts` | Better Auth config (email/password, hooks, Resend) |
| `src/lib/auth-client.ts` | Client-side auth (signIn, signUp, signOut, useSession) |
| `src/lib/get-current-user.ts` | Server-side user + role helpers |
| `src/lib/session.ts` | Session helpers (getSessionUserId, requireUserId) |
| `src/lib/email.ts` | Resend email utility |
| `src/middleware.ts` | Route protection (public vs protected) |
| `src/components/sidebar.tsx` | Admin sidebar with nav, logout, collapse |
| `src/components/marks.tsx` | Verification marks (Mark, Status, MarkLegend) |
| `src/components/record-panel.tsx` | The Record two-column panel |
| `src/components/share-row.tsx` | Share buttons (client component) |
| `src/components/masthead.tsx` | Public site header |
| `src/components/footer.tsx` | Public site footer |
| `src/components/shell.tsx` | Max-width container with side borders |
| `src/app/(site)/layout.tsx` | Public layout (Shell + Masthead + Footer) |
| `src/app/(app)/layout.tsx` | Admin layout (Sidebar + main content) |

## Route structure

```
(site)/                     — Public pages (uses Shell + Masthead + Footer)
  page.tsx                  — Homepage
  news/[slug]/page.tsx      — Article page
  standards/page.tsx        — Editorial standards
  corrections/page.tsx      — Corrections log
  about/page.tsx            — About AINN
  disclosure/page.tsx       — Ownership disclosure

(app)/                      — Admin panel (uses Sidebar layout, auth required)
  admin/page.tsx            — Dashboard
  admin/articles/page.tsx   — Article list
  admin/articles/new/page.tsx — Create article
  admin/articles/[id]/page.tsx — Edit article
  admin/team/page.tsx       — Team management (super_admin only)
  profile/page.tsx          — User profile

api/
  auth/[...all]/route.ts    — Better Auth handler
  me/route.ts               — Current user
  articles/route.ts         — POST create article
  articles/[id]/route.ts    — PATCH update article
  users/route.ts            — GET all users (super_admin)
  users/[id]/route.ts       — DELETE user
  users/[id]/role/route.ts  — PUT change role
  invite/route.ts           — POST send invite
  og/[slug]/route.tsx       — OG image generation (edge)
  sitemap/news.xml/route.ts — Google News sitemap
  sitemap/index.xml/route.ts — Standard sitemap

login/page.tsx              — Login form
signup/page.tsx             — Signup form
forgot-password/page.tsx    — Forgot password
reset-password/page.tsx     — Reset password
```

## RBAC roles

| Role | Admin panel | Articles | Publish to live | Subscribers | Team management |
|------|-------------|----------|-----------------|-------------|-----------------|
| super_admin | Yes | Create/Edit | Yes | View | Invite, roles, delete |
| admin | Yes | Create/Edit | Yes | View | No |
| team_member | Yes | Create/Edit | No (draft/review only) | No | No |
| subscriber | No | No | No | No | No |

Default for uninvited signups: `subscriber`

## Design system rules (critical)

- Import tokens from `globals.css`, never redefine
- Fonts: Archivo (headlines, UI), Newsreader (body prose), IBM Plex Mono (data, timestamps, labels)
- One accent colour: oxblood `--signal` (#8A1C2B). Never add a second hue.
- No rounded corners. No shadows. No dark mode on public site.
- No generated or stock imagery ever.
- Border-radius 0 everywhere.
- See `docs/design/ainn-design-system.md` for full component specs.

## Database

- Neon Cloud, pooler endpoint
- Tables: articles, claims, widget_benchmarks, subscribers, members, suggested_questions, corrections, sentiment_snapshots, monitoring_alerts, distribution_log, invites
- Better Auth tables: user, session, account, verification
- Run migrations: `export $(grep "^DATABASE_URL" .env.local | xargs) && pnpm db:generate && pnpm db:migrate`

## Deployment

- Push to `main` branch → Vercel auto-deploys
- Build: `next build` (Turbopack)
- Env vars in Vercel dashboard and `.env.local` locally
- NEXT_PUBLIC_APP_URL must be set to `https://ainewsnet.com` in Vercel

## Known issues

- Middleware shows deprecation warning ("middleware" → "proxy") — non-blocking, ignore for now
- `pg` library shows SSL warning about `sslmode=require` — cosmetic, ignore
- Profile page uses EC's glassmorphism styling (rounded corners, backdrop blur) — doesn't match AINN design system, low priority to restyle
- No `package-lock.json` — uses pnpm (pnpm-lock.yaml exists)

## What NOT to do

- Do NOT install EVE or any agent runtime
- Do NOT use dark mode on public pages
- Do NOT add rounded corners or shadows to public-facing components
- Do NOT use generated or stock images
- Do NOT hardcode API keys, models, or prompts
- Do NOT overwrite .env.local — use str_replace or fs_append only
- Do NOT push until Adam says so (unless fixing a build error)
