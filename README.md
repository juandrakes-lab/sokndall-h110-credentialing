# H110 — Credentialing & Enrollments (MVP, Fase 1-3)

Provider credential and payer enrollment tracking for 1-10 provider practices
and small billing companies. No PHI, no scraping, no onboarding call.

Stack: Next.js App Router (JSX, no TypeScript), Tailwind v4 (`@theme` in
`app/globals.css`), Supabase (Postgres + Auth), Vercel.

## What's built (Fase 1 + Fase 2)

Fase 1:
- Google OAuth + email/password auth (Supabase Auth)
- Self-serve organization creation on first login
- Provider CRUD
- Credential CRUD per provider, with status (`active` / `expiring` /
  `expired`) derived automatically from `expiration_date` by a database
  trigger — never entered by hand
- CAQH attestation expiration is computed from the org's configurable
  re-attestation interval (default 120 days), not hardcoded
- Expiration dashboard: overdue / 30 / 60 / 90-day buckets

Fase 2:
- Payer CRUD
- Enrollments matrix (providers × payers, one status chip per cell,
  changes on select — no modal, no extra page)
- Every status change is written to `enrollment_events` automatically by a
  database trigger (who via `created_by`, when via `created_at`, from/to
  status) — the app never writes history rows itself
- Filter the matrix by payer and/or by status via URL query params

Fase 3:
- CSV import for providers and credentials: upload → auto-guessed column
  mapping (editable) → preview → import, with per-row errors reported
  instead of failing the whole file (missing required fields, unrecognized
  credential type, unmatched provider). Credential rows match an existing
  provider by NPI first, then by first+last name.
- CSV export for providers, credentials, payers, and the enrollments matrix
- Weekly digest and 90/60/30/7-day expiration alert emails via Resend,
  triggered by Vercel Cron (`vercel.json`) hitting `app/api/cron/*`. **Code
  is written but unverified** — no Resend account was available yet, so the
  send path itself has not been exercised. See "Setup" below before trusting
  this works.

Everything is server-rendered with Server Actions (no state management
library, no API routes beyond the OAuth callback) so RLS is the only access
control layer — there is no service-role backdoor in the app code. The
enrollments matrix has a couple of small client components (the status
dropdown, the payer/status filters) for instant interactivity, but they call
the same server actions directly.

## Setup

1. **Supabase project**
   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL editor, run every file under `supabase/migrations/` **in
     filename order** (currently `20260823000000_init_schema.sql`, then
     `20260823000001_fase2_enrollments_matrix.sql`).
   - Under Authentication → Providers, enable **Google** and set the redirect
     URL to `<your-app-url>/auth/callback` (and `http://localhost:3000/auth/callback`
     for local dev).
   - Under Authentication → Providers, email/password is enabled by default.

2. **Environment variables**
   - Copy `.env.local.example` to `.env.local`.
   - Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     from Supabase → Project Settings → API.
   - For the email digest/alerts (optional for local dev, required in
     production): `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API — keep
     this out of the client, it bypasses RLS), `RESEND_API_KEY` and
     `RESEND_FROM_EMAIL` from [resend.com](https://resend.com), and a random
     `CRON_SECRET` (must match what you configure in Vercel's cron settings).
   - To test the cron routes locally: `curl -H "Authorization: Bearer
     $CRON_SECRET" http://localhost:3000/api/cron/weekly-digest` (and
     `/api/cron/expiration-alerts`). In production, Vercel Cron calls these
     automatically per `vercel.json`'s schedule and sends that header itself.

3. **Install & run** (requires Node.js 18.18+)

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`, sign up, create an organization, add a
   provider, and add a credential with a past/near expiration date to see it
   show up on the dashboard. Add a payer and open `/enrollments` to see the
   matrix.

## Deliberately not built yet (see spec, Fase 4+)

- Pricing page, Polar checkout, plan limit enforcement
- Free spreadsheet template funnel page

## Data model notes

- `organizations.caqh_reattestation_interval_days` defaults to 120 and is
  used by a trigger to compute `credentials.expiration_date` for
  `type = 'caqh_attestation'` rows from `issue_date`.
- RLS is enabled on every table. Membership is granted only through the
  `create_organization()` Postgres function (`security definer`) — there is
  no direct insert policy on `org_members`, so a future invite flow should
  add its own `security definer` function rather than opening that table up.
- `enrollments` has a unique `(provider_id, payer_id)` constraint — the
  matrix has at most one enrollment row per cell. A cell showing "Not
  started" has no row yet; it's created on the first status change via
  upsert. Every insert/update is logged to `enrollment_events` automatically
  by the `log_enrollment_event()` trigger, so the app code never writes
  history rows directly.
- `SUPABASE_SERVICE_ROLE_KEY` is only ever read in `lib/supabase/admin.js`,
  which only the two `app/api/cron/*` routes import. It bypasses RLS, so it
  must never be imported from a page, layout, or Server Action that runs in
  a logged-in user's request.
