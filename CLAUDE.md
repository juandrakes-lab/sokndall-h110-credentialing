# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # Next dev server — see the note below before combining with a build
npm run build    # Next production build
npm run lint     # next lint (eslint-config-next)
npm start        # serve a production build
```

No test suite exists yet — there is no `test` script and no test framework installed.

**Never run `npm run build` while `npm run dev` is also running against this repo.** `next build` overwrites the `.next` directory a live `next dev` server is reading from, and the already-loaded page in the browser breaks with `Cannot find module './996.js'` or `__webpack_modules__[moduleId] is not a function` — it looks exactly like a code bug but isn't. If it happens: stop the dev server, `rm -rf .next`, restart. Sessions in this environment sometimes have another chat's dev server already bound to port 3000 sharing the same `.next` — check for that before assuming a build failure is real.

Testing the two Vercel Cron routes locally requires the bearer token: `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/weekly-digest` (and `/api/cron/expiration-alerts`). `scripts/setup-polar.mjs`, `scripts/register-webhook.mjs`, and `scripts/test-webhook.mjs` are one-off/verification scripts, not part of the regular dev loop — see the README's Setup section before touching billing.

## Architecture

**Stack:** Next.js App Router, plain JSX (no TypeScript), Supabase (Postgres + Auth), Polar for billing, Resend for email, deployed on Vercel with Vercel Cron. Everything is server-rendered with Server Actions — no client-side state management library, and no API routes beyond `/auth/callback` and the cron/webhook endpoints. `@/*` resolves to the repo root (`jsconfig.json`).

**No PHI, ever, anywhere.** Only provider identity/credential data — that's what keeps this out of HIPAA/BAA territory. Never add patient data, and never add scraping of CAQH/NPPES/payer portals/state boards — manual entry and CSV import only.

### Two unrelated styling systems — do not cross them

1. **The authenticated app** (`app/(app)/*`, `app/login`, `app/onboarding`) uses **Tailwind v4**, configured via `@theme` in `app/globals.css` (not a `tailwind.config.js` — that's the v4 way). Classes like `ink-900`, `brand-600`, `status-active` come from there.
2. **The marketing site** (`/landing`, `/pricing`, `/payer-enrollment-software`, `/credential-expiration-tracking`, `/credentialing-spreadsheet-template`) runs on a **separate, portable design system** rooted at `design-system/` (read `design-system/readme.md` and `SKILL.md` first) and its own CSS: `components/site/site.css` (the visual skin: forest/gold/paper tokens, type scale, buttons, image treatments) plus `components/site/site-pages.css` (page-level layout patterns, imported *after* `site.css` so it can override). Both are `.lp-*`-prefixed and scoped under a single `.sokndall-landing` wrapper div — nothing here touches Tailwind, and nothing from `app/globals.css` should leak into these pages.

A marketing page's shape: a `page.jsx` that imports both CSS files, wraps its content in `<div className="sokndall-landing">`, opens with `<SiteNav />` and closes with `<SiteFooter />` (both from `components/site/`), and keeps its copy/content data in a sibling `data.js`. `app/pricing/page.jsx` is the fullest current example to copy from.

**Two page categories, and they are not interchangeable.** The above describes a *landing* — home, `/pricing`, the two product pages, `/for-billing-companies` — where alternating section backgrounds, cards, schematics and repeated CTAs are correct. Everything else (`/payer-enrollment/` and its four payer guides, the three competitor-pricing pages, `/security`, `/about`) is an *article*: content meant to be read, not converted against. Articles import `site.css` + **`components/site/site-article.css`** instead of `site-pages.css`, and wrap in `<div className="sokndall-landing lp-article-page">`. `SiteNav` and `SiteFooter` render with no `variant` prop (the same full-weight header and CTA colour as the landing pages — a dimmed "slim" nav variant existed briefly and was removed after review; `SiteFooter` still takes `variant="slim"` on every article page to drop the price badge, which reads as a sales unit stapled to a document otherwise). No alternating section backgrounds, no cards inside body copy, no CTA between sections — the only conversion point is the closing `.lp-cta-block` and, on the payer-enrollment cluster, the "Explore more guides" cards after it.

Within the article category there are two weights, chosen by how long and how interlinked the content is:
- **Full editorial** (the five payer-enrollment pages): a centered masthead (`.lp-article-head`, `text-align:center`, kicker → H1 → standfirst, an optional lead image sitting *above* the closing `.lp-article-rule`, never below it) followed by `.lp-shell` — a main reading column plus a sticky, scroll-spy contents sidebar (`ArticleSidebar`, "use client", a floating white card) above ~1220px, collapsing to a collapsible `<details>` (`MobileToc`) below it. `ExploreMore` renders the end-of-cluster interlinking cards; there is no per-page "related guides" list any more — it duplicated `ExploreMore` in a second, less legible spot and was removed. Structural pieces: `Observed` (the tinted pull-quote card that carries every "observed" case), and the plain `.lp-list` / `.lp-numbered` / `.lp-labelled` (a two-column label + content grid, not a stacked label) / `.lp-a-table` article elements.
- **Solo shell** (the three competitor-pricing pages, `/security`, `/about`): the same centered masthead and prose typography, but wrapped in `.lp-solo-shell` — a single ~42rem column that never switches to two columns, because a 400–900 word page doesn't need a locked contents sidebar. `/security` and `/about` skip even the kicker/centering, just a plain left-aligned `<h1>`/`.lp-lead` — "low visual ambition by design," per their own brief. The three competitor-pricing pages (`/symplr-pricing`, `/modio-health-pricing`, `/medtrainer-pricing`) share one section order (public pricing info → what the competitor does well → who it's right for → Sokndall's price, via `CompetitorPricingTable` → FAQ via the shared `Faq` component) and three hard rules carried from the copy: no competitor logos or screenshots, no adjectives characterizing a competitor negatively, and every competitor price/estimate cites its source inline in the same sentence, never a detached footnote.

Imagery in the article category is editorial, not decorative: at most one lead image per page (most pages ship with none — see `docs/image-brief-marketing-pages.md` for prompts and placement per page) and never one per section.

**`design-system/guidelines/section-layout.html`** (and the matching section in `design-system/readme.md`) codifies the layout rules learned from building these pages — when a text section splits into a two-column head vs. gets centered, which edge a body paragraph aligns to, why dark/forest sections never carry an eyebrow pill, why an accordion or lone figure narrower than the container is centered rather than left-aligned. Read it before laying out a new marketing section; the rules exist because every one of them was a real visual bug first.

Shared marketing-page components live in `components/site/`: `SiteNav`/`SiteFooter`/`siteData.js` (nav links, footer columns, the trial CTA href), `StatusBadge` (the six enrollment states + five credential states — colour + shape + monospace count, reused verbatim from the authenticated app's own status vocabulary), `EnrollmentMatrix` (the provider × payer grid schematic, parameterized by rows/cols so it can render at different sizes per page), `Faq` (the one `"use client"` island — an accordion), `ImgSlot` (a placeholder for a photo slot, replaced by a real `<img>` once art exists).

**Image treatments on marketing pages** — three kinds, picked by what the image is doing:
- `bleed` — a transparent cutout anchored to the seam between two sections (`.lp-img-bleed`); the subject's feet/waist land right on the section boundary.
- `framed` — a normal photo in a rounded card with a soft shadow (`.lp-img-framed`); used when the photo isn't anchored to a seam.
- `tile` — an opaque icon/graphic on a forest-green card, used inside dark sections.

Diagrams and schematics on these pages (the enrollment matrix, timelines, follow-up logs, digest previews, alert ladders) are deliberately real HTML/CSS at low fidelity, not styled to look like product screenshots — they get replaced with actual screenshots once the corresponding feature exists in the product UI, not with better-drawn mockups now.

### Authenticated app: data model and access control

RLS is the only access-control layer — there is no service-role bypass anywhere in normal request paths. `lib/supabase/admin.js` (the service-role client) is imported *only* by `app/api/cron/*`; never import it from a page, layout, or Server Action that runs inside a logged-in user's request.

- Org membership is granted exclusively through the `create_organization()` Postgres function (`security definer`) — there's no direct insert policy on `org_members`. A future invite flow needs its own `security definer` function rather than opening that table up.
- `credentials.status` (`active`/`expiring`/`expired`) and CAQH `expiration_date` are computed by a `before insert or update` trigger (`compute_credential_fields`) — never set from application code. `organizations.caqh_reattestation_interval_days` (default 120) drives that computation.
- `enrollments` has a unique `(provider_id, payer_id)` constraint; the matrix has at most one row per cell, created via upsert on first status change. Every insert/update is written to `enrollment_events` automatically by the `log_enrollment_event()` trigger — application code never writes history rows directly.
- `organizations.plan`/`provider_limit` are the source of truth the app reads; they're kept in sync with Polar by the webhook handler (`app/api/webhooks/polar/route.js`), not read live from Polar per-request. The org ↔ Polar link is `customerExternalId = organizations.id` (see `lib/plans.js` for the plan-key → Polar-product-ID map), so there's no separate customer-mapping table.
- Migrations live in `supabase/migrations/`, applied in filename order — there's no migration tool wired up, they're pasted into the Supabase SQL editor by hand (see README's Setup section).

### Known live discrepancy

`lib/plans.js` (and the actual Polar sandbox products) price the three plans at $49/$99/$199, but the public marketing pages (`/pricing` and others) publish $79/$299/$699 — a pricing change that was applied to the marketing copy but not yet propagated to the checkout config. Reconcile before treating either number as authoritative.
