# H110 — Credentialing & Enrollments (MVP, Fase 1)

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
- Full data model + RLS for Fase 3+ tables (notification_log) so no
  destructive migrations are needed later

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

3. **Install & run** (requires Node.js 18.18+)

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`, sign up, create an organization, add a
   provider, and add a credential with a past/near expiration date to see it
   show up on the dashboard. Add a payer and open `/enrollments` to see the
   matrix.

## Deliberately not built yet (see spec, Fase 3+)

- CSV import/export
- Weekly digest / expiration alert emails
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
