# H110 — Credentialing & Enrollments (MVP, Fase 1)

Provider credential and payer enrollment tracking for 1-10 provider practices
and small billing companies. No PHI, no scraping, no onboarding call.

Stack: Next.js App Router (JSX, no TypeScript), Tailwind v4 (`@theme` in
`app/globals.css`), Supabase (Postgres + Auth), Vercel.

## What's built (Fase 1)

- Google OAuth + email/password auth (Supabase Auth)
- Self-serve organization creation on first login
- Provider CRUD
- Credential CRUD per provider, with status (`active` / `expiring` /
  `expired`) derived automatically from `expiration_date` by a database
  trigger — never entered by hand
- CAQH attestation expiration is computed from the org's configurable
  re-attestation interval (default 120 days), not hardcoded
- Expiration dashboard: overdue / 30 / 60 / 90-day buckets
- Full data model + RLS for Fase 2+ tables (payers, enrollments,
  enrollment_events, notification_log) so no destructive migrations are
  needed later — only Fase 1 UI is built against them so far

Everything is server-rendered with Server Actions (no client-side state
libraries, no API routes beyond the OAuth callback) so RLS is the only access
control layer — there is no service-role backdoor in the app code.

## Setup

1. **Supabase project**
   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL editor, run [`supabase/migrations/20260823000000_init_schema.sql`](supabase/migrations/20260823000000_init_schema.sql).
   - Under Authentication → Providers, enable **Google** and set the redirect
     URL to `<your-app-url>/auth/callback` (and `http://localhost:3000/auth/callback`
     for local dev).
   - Under Authentication → Providers, email/password is enabled by default.

2. **Environment variables**
   - Copy `.env.local.example` to `.env.local`.
   - Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     from Supabase → Project Settings → API.

3. **Install & run** (requires Node.js 18.18+; not installed in this
   environment — run these on a machine that has it)

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`, sign up, create an organization, add a
   provider, and add a credential with a past/near expiration date to see it
   show up on the dashboard.

## Deliberately not built yet (see spec, Fase 2+)

- Enrollments matrix (providers × payers)
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
