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

**Copy and links on marketing pages.** Copy strings carry inline links as
`[text](/route)` or `[text](src:key)`, rendered by `components/neo/rich.jsx`;
every external source lives in `components/neo/sources.js`, which decides
`nofollow` (competitors, review directories) once per source. JSON-LD comes
from `components/neo/schema.jsx`, reading the same data the page renders.

**No PHI, ever, anywhere.** Only provider identity/credential data — that's what keeps this out of HIPAA/BAA territory. Never add patient data, and never add scraping of CAQH/NPPES/payer portals/state boards — manual entry and CSV import only.

### Styling systems — do not cross them

1. **The authenticated app** (`app/(app)/*`, `app/login`, `app/onboarding`) uses **Tailwind v4**, configured via `@theme` in `app/globals.css` (not a `tailwind.config.js` — that's the v4 way). Classes like `ink-900`, `brand-600`, `status-active` come from there.
2. **The live marketing site** runs on the **neo skin**: `components/neo/neo.css`, `.sk-*`-prefixed, scoped under a single `.sokndall-neo` wrapper. **This is what every marketing route renders today** — see "The neo marketing skin" below. Start there.
3. **The forest/gold system** described in the next paragraph (`components/site/*`, `.lp-*` under `.sokndall-landing`) is the skin the marketing site used before the neo rebuild. It is still in the tree and still compiles, but **no route imports it any more.** It is kept because every page's copy still lives in the `data.js` files beside those pages, and because reverting a route is a one-line import change. Do not add pages to it, and do not mix `.lp-*` and `.sk-*` in one page.

The pre-neo marketing site (`/landing`, `/pricing`, `/payer-enrollment-software`, `/credential-expiration-tracking`, `/credentialing-spreadsheet-template`) runs on a **separate, portable design system** rooted at `design-system/` (read `design-system/readme.md` and `SKILL.md` first) and its own CSS: `components/site/site.css` (the visual skin: forest/gold/paper tokens, type scale, buttons, image treatments) plus `components/site/site-pages.css` (page-level layout patterns, imported *after* `site.css` so it can override). Both are `.lp-*`-prefixed and scoped under a single `.sokndall-landing` wrapper div — nothing here touches Tailwind, and nothing from `app/globals.css` should leak into these pages.

### The neo marketing skin

Everything under `components/neo/` — one stylesheet (`neo.css`), one wrapper
(`.sokndall-neo`), one prefix (`.sk-`). It shares nothing with `site.css` or
with the Tailwind `@theme`; the three never meet.

**The shape of the page.** The grey `--page` ground is the page; a single white
rounded card (`.sk-shell`, via `components/neo/Shell.jsx`) is the document, and
nothing renders outside it. Every route is `<Shell>` wrapping either a landing
(hero panel → sections → `Footer`) or an `<Article>`.

**The signature block** is `HeroPanel`: a saturated blue rounded panel whose
top-left corner is squared so a white *notch* can seat flush into it and carry
the wordmark, with the nav riding on the blue beside it and a small blue tongue
(`.sk-hero__tab`) dropping below the panel's bottom edge. The notch/nav pair
lives in one absolutely-positioned row so the notch sizes itself to the
wordmark. Do not reimplement this per page — `HeroPanel` is the only copy, and
the homepage and all three product-ish landings go through it.

**Four page categories, and they are not interchangeable.**

- *Landings* (`/`, `/pricing`, `/credentialing-spreadsheet-template`,
  `/payer-enrollment-software`, `/for-billing-companies`) — `LandingTemplate`
  (`components/neo/LandingTemplate.jsx`) plus the section kit in
  `landingSections.jsx`. Every page is a `page.jsx` that only composes, and a
  sibling data file with the approved copy (`app/homeData.js` for `/`).
  `app/page.jsx` is the fullest example. Prices are `PlanListSection`, a
  vertical list — never three cards. Photography on a landing only where
  DESIGN_RULES §19 allows it (the home's hero and its photo slots, Pexels via
  `components/neo/photos.js`, credited) — never in a `ScreenSlot`.
- *Editorial* (the six guides and the four comparison pages) —
  `components/neo/Editorial.jsx`, composed per page by
  `components/neo/EditorialPage.jsx` from the page's `data.js` (the old
  `Article` component still exists; no route of the v3.1 map uses it). A 1040px masthead over a 288px sticky contents
  sidebar and a 720px reading column, capped rather than fluid. Pieces come from
  `EditorialBits`; `EditorialToc` is the scroll-spy.
  **`variant="comparison"`** serves the three competitor pages off the same
  frame: nothing about the mould changes, but the last three blocks of the
  reading column are fixed — our own price, the closing CTA, the FAQ — with
  `RelatedGuides` below them. The price section is rendered unconditionally
  rather than passed in, and the template throws when `faq` or `cta` is missing,
  so the shape cannot erode by omission. The comparison body is built from
  `SourcedPricingDisclosure`, `GoodFitSection` and `PurchaseModelCompare` in
  `ComparisonBits`, which are plain `<section>`s and drop into the column like
  any prose section. `MultiVendorComparison` lives there too and belongs to
  `/best-credentialing-software` alone.
  Three rules the whole category carries: no competitor logos or screenshots
  (the components take names as text and have no image prop), no adjective
  characterizing a competitor negatively, and no figure without its provenance
  in the same row — `SourcedPricingDisclosure` throws otherwise, and no cell in
  `MultiVendorComparison` may be empty or estimated.
- *Institutional* (`/security`, `/about`) — `components/neo/Institutional.jsx`.
  One centred 36rem column, 300–600 words, no sidebar and **no CTA anywhere on
  the page**, at the foot included: a page that answers a trust objection and
  then asks for the sale has answered it in order to ask. Composed from
  `PageHeader` and `ProseSection`, plus one portrait slot on `/about` — a real
  photograph of the founder or of the desk this is built on, or nothing. Never
  stock. It ships empty at a declared 4:5.

The earlier `ComparisonTemplate.jsx` (its own 780px column) and `Comparison.jsx`
(an `Article` wrapper) both did this job before and are **deleted** — there is
one comparison mould now, not three.

**Client components, and only these four:** `Faq` (the accordion — every answer
is in the SSR HTML whether open or not, `hidden` rather than absent, so the copy
stays crawlable), `Toc` / `EditorialToc` (the scroll-spy), `EmailCapture` (the
form) and `FloatingNav` (the sticky petrol-ink nav bar; on the home it appears
once the hero has scrolled away). Everything else renders on the server.

**Round 2 of the landing polish (2026-09-11)** added: `HeroPanel` variants
(`panel` for the home, `light` for the product pages), `ScreenSlot` (closed
frame for a product screen), `InkTile` (dark tile inside a light section),
`PhotoFrame` + `components/neo/photos.js` (Pexels photos with credits),
`Schematics.jsx`, and the `surface="block"` grey band. The rules they carry are
DESIGN_RULES.md §13-§19.

**Diagrams stay diagrams.** The matrix, timeline, follow-up log, cadence chart,
alert ladder, digest and portal-check are deliberately real HTML/CSS at low
fidelity. They get replaced with actual product screenshots once the
corresponding screen exists — never with better-drawn mockups now.

**Two CSS traps this skin hit, both fixed and both easy to reintroduce:**

- `.sk-on-blue` sets white text, but light cards float *inside* the blue panel,
  so every on-blue rule is countered by a higher-specificity
  `.sk-on-blue .sk-card:not(.sk-card--blue)` block. Any new text utility needs
  an entry in both.
- A one-column grid's implicit `auto` track takes its minimum from min-content,
  so a wide child pushes the track past its container instead of being
  constrained by it. Every single-column grid here declares
  `grid-template-columns: minmax(0, 1fr)`. For the same reason a list item that
  holds several inline children uses an absolutely-positioned `::before` marker
  rather than a marker column — as a grid cell, each inline child becomes its
  own grid item and the running text lands in the 16px marker column.

**Photography** is real and already in `public/`: `landing/positioning.png` and
`pages/hub-hero.png` are framed documentary shots (4:3 and 3:2);
`landing/hero-photo.png`, `pages/enrollment-hero.png`,
`pages/expiration-hero.png` and `landing/problem-figure.png` are transparent
portrait cut-outs that stand on the blue hero panel with their feet on its
bottom edge. Route them through `components/neo/Photo.jsx`, which renders a real
`<img>` when given a `src` and a labelled, art-directed placeholder when not.
The direction is fixed: documentary, real clinic back office, available light,
nobody looking at or smiling into the camera.

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

### Authenticated app: data model and access control (v3, `cred_*` tables)

The source of truth for scope is the founder's `H110_ALCANCE_FUNCIONAL.md` (v3). The
v3 app reads **only `cred_*` tables**; the pre-v3 tables (`organizations`,
`providers`, `credentials`, `payers`, `enrollments`, …) are still in the database,
untouched and unread — do not delete them, do not read them.

RLS is the only access-control layer — there is no service-role bypass anywhere in normal request paths. `lib/supabase/admin.js` (the service-role client) is imported *only* by `app/api/cron/*`, the Polar webhook route and `app/api/billing/sync` (the webhook fallback: asks Polar for the signed-in user's own subscription, via `lib/polar-sync.js`); never import it from a page, layout, or Server Action that runs inside a logged-in user's request.

- **Tenancy:** `cred_organizations` (the paying account: plan + limits) → `cred_client_orgs` (one for Solo/Practice, one per client for Billing Co) → `cred_practices` (1:1 with a client org) → `cred_providers` → `cred_credentials`. Every data row carries `client_org_id`, and every data policy goes through `cred_can_access_client(client_org_id)` — owner sees all clients, a member sees all unless `cred_org_members.client_ids` narrows them. `org_id`/`client_org_id` on child rows are derived by trigger from the parent; never trust them from the app.
- **Plan rules live in the database:** limits are derived from `plan` by `cred_apply_plan_limits`; the provider limit is a hard stop in `cred_providers_before_write` (so CSV import can't bypass it); a second client org on a non-Billing-Co plan is refused by `cred_enforce_single_client`. Customers can only update `name` and `caqh_reattestation_interval_days` on their organization (column privileges) — never plan or limits.
- Membership is never written directly (no insert policy on `cred_org_members`). An organization is born only from a Polar subscription (`cred_sync_subscription`, called by the webhook); members join only through `cred_accept_invitation`. There is no org without a subscription.
- **Billing (Polar):** the Polar customer's external id is the **auth user id** (not the org id). Signup is account-first: `/login?mode=signup` → `/start` (plans) → Polar checkout with a 14-day trial (`startTrial` in `lib/billing-actions.js`) → `/welcome` polls `accountReady` until the webhook has created the org → `/onboarding`. `app/api/webhooks/polar/route.js` verifies the signature (403), records the delivery id in `cred_polar_events` (a duplicate is a 200 no-op), and calls `cred_sync_subscription(..., p_modified_at)`, which ignores events older than the last one applied (Polar doesn't guarantee order); on failure it removes the event row and returns 500 so Polar retries. Plan changes go through `subscriptions.update` (upgrade invoiced now, downgrade prorated) and only take effect when the webhook arrives.
- **Read-only states:** `accountAccess(org)` in `lib/billing.js` is the one place that turns `subscription_status`/`trial_ends_at`/`cancel_at_period_end` into a state and a banner. Enforcement is in the database — `cred_org_writable()` / `cred_provider_writable()` / `cred_enrollment_writable()` gate every write policy — so a past-due/ended account, or providers above the limit after a downgrade (the oldest N stay writable), can read and export but not write. The UI mirrors it with `readOnly` props and `ReadOnlyNotice`; never rely on the UI alone.
- **Team:** invitations store only the SHA-256 of the token (`cred_invitations`); the link is `/invite/<token>`, previewed by `cred_invitation_preview` and accepted by `cred_accept_invitation`, which enforces the plan's user limit. Deleting the account (`deleteAccount`) revokes the Polar subscription, removes the org's Storage files, then calls `cred_delete_organization()` (owner only, cascades).
- Local webhook testing: Polar can't reach localhost, so `scripts/relay-polar-webhooks.mjs --watch` replays the real deliveries from Polar's API to the dev server, re-signed with the local secret. `scripts/verify-billing.mjs` covers the webhook/state machine end to end.
- `cred_credentials.status` and the CAQH due date are computed by `cred_compute_credential_fields` — never set from app code — and refreshed nightly by the pg_cron job `cred-refresh-credential-statuses` (05:00 UTC). App-side "today" is US Eastern (`todayISO()` in `lib/credentials.js`).
- **Payers:** `cred_payers_global` is our curated catalog (read-only to customers, seeded by migration); `cred_payers_org` is a **client's** list (`client_org_id`, since 2026-09-18 — a Billing Co's clients don't share payers) — a catalog pick (`payer_global_id`, details read from the catalog via `resolvePayer()`) or its own payer (details on the row). A write without `client_org_id` lands in the active client or the account's only client (`cred_payers_org_before_write`). Enrollments reference `cred_payers_org` only, with no cascade, so a payer in use can't be removed, and an enrollment's payer must be on its own client's list (`PAYER_OTHER_CLIENT`).
- **Seats:** inactive providers don't take a seat (`cred_provider_usage`, `cred_providers_before_write`); reactivating one needs a free seat (`PROVIDER_LIMIT_REACHED`).
- **Credentials:** types include `cds` and `other` (`custom_name` required, 2–80 chars, DB check). `renewed_at` is stamped by the compute trigger when the expiration date moves later; the onboarding checklist (`lib/checklist.js`) only counts a current credential whose copy was uploaded after that.
- **Enrollments:** one row per provider × payer, created on first touch. `pending_request` / `pending_request_at` hold what the payer asked for while the status is `info_requested` (the trigger clears them on any other status); `markInfoRequested` / `resolveRequest` in `app/(app)/enrollments/actions.js`. `cred_enrollments_before_write` derives scope, checks the payer and the assignee belong to the org, stamps `status_changed_at` (drives "stalled": in-flight and unchanged 30+ days), clears the follow-up on approval and computes `revalidation_due_date`. History (`cred_enrollment_events`) is written only by trigger; nobody can insert or edit it. The side panel (`EnrollmentPanel`) opens on any page via `?open=<providerId>.<payerId>`.
- **Documents:** files live in the private bucket `cred-documents` at `<org>/<client>/<provider>/<uuid>-<name>`, uploaded straight from the browser (never through a server action — Vercel caps request bodies at 4.5 MB) and served only through 60-second signed URLs (`/documents/[id]/download`). The bucket enforces 10 MB and the file types; the storage insert policy (`cred_storage_can_upload`) refuses uploads once the org's *stored* bytes reach its plan quota, and the `cred_documents` trigger takes size and type from Storage, not the app. Storage files don't cascade: anything that deletes a provider must remove its files first (see `deleteProvider`).
- **Checklist** (`lib/checklist.js`) is computed from what's on file (documents by category, verified NPI, current CAQH) — nothing is ticked by hand.
- **CSV:** every export is one view in `app/(app)/export/[view]/route.js` (through the user's RLS); importers are `ImportWizard` + `app/(app)/import-export/actions.js`, which trim provider rows to the plan's room before inserting (the DB would refuse the whole batch otherwise).
- **Email (alerts + weekly digest):** `lib/notifications/` — `data.js` gathers one org's data (explicit org filters, so it works with the cron's service-role client and with an owner's RLS client for the Settings preview), `compute.js` decides what's due (ladder = `cred_organizations.alert_days`, expired always once; an item is announced once per rung, keyed item+due date+rung), `email.js` renders HTML + text, `send.js` groups by responsible person (unassigned → owner; owner always cc'd) and claims each email in `cred_notification_log` via `cred_claim_notifications()` before sending, so a double-fired cron sends nothing twice and failures retry next run. `scripts/verify-notifications.mjs` runs the real cron routes against a throwaway org using Resend's `delivered+…@resend.dev` inbox. Until sokndall.com is verified in Resend, real mail only reaches the Resend account's own address.
- NPPES: `lib/nppes.js` calls CMS's public NPI Registry API (allowed by alcance §3.9 — it is an official API, not scraping). The snapshot is stored in `nppes_data` on providers/practices; `lib/consistency.js` flags mismatches from it. The registry proposes, the user confirms — never auto-overwrite.
- **Billing Co multi-client (alcance §4.4):** clients are `cred_client_orgs` rows, each with its practice (the client's name follows the practice's legal name). The *active client* lives in the `cred_client` cookie; `getAppContext()` validates it against the clients the user can reach and, when there is more than one, returns a `supabase` client that sends it as the `x-cred-client` header. Every client-scoped SELECT policy narrows to that header (`cred_in_active_client`), so pages never filter by client by hand — and the header can only narrow what `cred_can_access_client` allows. `supabaseAll` (no header) is for cross-client views: the Clients panel (`/clients`) and the email preview. Account-wide numbers (the provider limit spans all clients) come from `cred_provider_usage`, never from counting visible rows. `/clients` and `/clients/new` call `forbidden()` (a real 403, `experimental.authInterrupts`) on any plan but Billing Co. Members can be limited to some clients (`client_ids`, set at invitation or via `cred_set_member_clients`); `null` means all, including clients added later.
- **Extra users (Billing Co, founder decision 2026-09-14):** $39/user/month beyond the 10 included, on the *same* Polar subscription. The Billing Co product is a $699 fixed price plus a graduated seat price (seats 1–10 at $0, 11+ at $39), so `seats` = users on the plan; `cred_organizations.seats` mirrors Polar and `user_limit = max(10, seats)` (`cred_apply_plan_limits`). `lib/seats.js` is the only code that moves seats: up with `prorationBehavior: "invoice"` (charged now, prorated), down with `"next_period"` (Polar keeps the paid seat until renewal, as a `pendingUpdate`). The owner's 11th invitation first returns the cost, then on confirm raises seats and the form waits (polling `/api/billing/sync` + `seatReady`) before sending; removing a member / cancelling an invitation / the daily cron (`reconcileExpiredSeats`, expired invitations) schedule the decrease. Checkout and a switch into Billing Co always set 10 seats (Polar starts a switch at 1). Solo/Practice keep hard limits.
- **Archived and deleted clients (Billing Co):** `cred_client_orgs.archived_at`. `cred_can_access_client` excludes archived clients for everyone (so nothing in them can be written, and members lose them); the SELECT policies let the *owner* read an archived client only when it is named as the active client (the export). Archived clients don't count toward the provider limit (`cred_providers_before_write`, `cred_provider_usage`, `cred_provider_writable`) or storage (`cred_storage_used_bytes`). `cred_archive_client` (keeps ≥1 active client), `cred_restore_client` (refused with a count if it would pass the provider limit), `cred_delete_client` (archived only, exact name, refuses while Storage files remain; cascades everything; leaves only `cred_client_deletions`: name, date, who; strips the id from members' subsets). The export (`/clients/[id]/export`) returns CSVs + 10-minute signed URLs and the browser builds the ZIP (`lib/zip.js`), so no Vercel response-size limit applies. A member left with no clients sees an empty state (`NoClients` in the app layout).
- **Field rules, three layers (Fase 7):** `lib/validation.js` holds the format rules (NPI check digit, DEA format/check digit/last-name initial, EIN prefixes, CAQH, taxonomy, ZIP, US phone, dates) and display masks; `lib/{provider,credential,practice,enrollment}-rules.js` compose them per form. The same functions run live in the browser (every data-entry form uses `components/app/useSmartForm.js`: controlled values submitted by hand — never `action={…}`, whose automatic form reset empties controlled inputs —, errors after leaving a field or trying to save, save blocked with focus on the first bad field), again in the server action, and the formats are CHECK constraints in the database (migration `20260915000001`). The CSV importers run the same rules per row. Closed choices wherever the value set is known: alert days (checkboxes), revalidation cycles, malpractice limits, certifying boards, specialty = the provider's own NPPES taxonomies (the NUCC list itself needs a commercial licence, so it isn't bundled).
- **Access:** `/signup` is the newcomer's entry (name, email, password rules in `lib/password-rules.js`, confirmation, Terms/Privacy acceptance stamped with `TERMS_VERSION`), `/login` signs in only, `/forgot-password` → `/reset-password` via `/auth/callback`. Messages never reveal whether an account exists. Cloudflare Turnstile is wired behind `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (off until Supabase CAPTCHA is enabled with its secret). `/terms` and `/privacy` render `lib/legal.js`, a structured draft (noindex) until the final text is written.
- **Accounts never come back:** `cred_delete_organization` records the subscription in `cred_ended_subscriptions`, and `cred_sync_subscription` only creates an organization from a live (trialing/active) event for a subscription not in that table — Polar's revoke after a deletion, or a late older event, changes nothing.
- `scripts/verify-rls.mjs` proves tenant isolation, client-subset isolation and the plan rules against the real project with throwaway users, and cleans up after itself. Run it (and extend it) before closing every phase.
- Migrations live in `supabase/migrations/`, applied in filename order (v3 ones were applied through the Supabase MCP `apply_migration`).

### Known live discrepancy

`lib/plans.js` and the Polar sandbox products behind `POLAR_PRODUCT_*` now agree on the v3 prices ($79/$299/$699). The old $49/$99/$199 sandbox products still exist in Polar (archive them with `scripts/setup-polar.mjs --archive-old` at launch), and Vercel's env vars still point at them until the launch phase updates `POLAR_PRODUCT_*`.
