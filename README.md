# H110 — Credentialing & Enrollments (MVP, Fase 1-4)

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
  triggered by Vercel Cron (`vercel.json`) hitting `app/api/cron/*`. The
  whole pipeline is verified — cron auth, org iteration, data queries, and
  the call into Resend's API all confirmed working — **except actually
  seeing an email land in an inbox**. That last hop is blocked locally only
  because the Resend account's test mode restricts delivery to its own
  signup address, which doesn't match the test org's owner email; verifying
  a domain in Resend (or aiming a test org's owner at the account's own
  address) closes that gap. See "Setup" below.

Fase 4:
- Public pricing page (`/pricing`, no auth required, numbers visible, no
  contact form) for the 3 plans from the spec: Solo ($49/mo, 3 providers),
  Practice ($99/mo, 15), Billing Co ($199/mo, 50).
- Polar checkout with a real 14-day trial (card required, auto-charged on
  day 15) — configured on the product itself via `scripts/setup-polar.mjs`,
  not hand-set in the Polar dashboard, so all 3 products stay consistent.
  Verified against real Polar sandbox: checkout creation, redirect to
  Polar's hosted page, and the trial terms Polar itself renders back
  ("14 days free, then $49/month starting <date>") all confirmed correct.
- Self-serve billing portal (`openBillingPortal` in `app/pricing/actions.js`,
  via Polar's customer session API) for cancellation — no email required.
- Webhook handler (`app/api/webhooks/polar/route.js`) syncs `plan` /
  `provider_limit` / `subscription_status` on `subscription.created`,
  `.updated`, and `.revoked`. Verified locally with a schema-correct,
  correctly-signed test payload (`scripts/test-webhook.mjs`) — confirmed
  the org's plan/limit update on create and revert to the floor plan on
  revoke, and confirmed the signature check rejects bad/missing signatures.
  **Not yet verified: a real webhook delivered by Polar itself** — that
  needs a public URL to register the endpoint against, so it's untested
  until this is deployed. See "Setup" below.
- Provider-limit enforcement (`app/(app)/providers/actions.js`): blocks new
  providers past `provider_limit`, both via the form and CSV import; never
  blocks reads or exports.

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
     filename order** (`20260823000000_init_schema.sql`,
     `20260823000001_fase2_enrollments_matrix.sql`,
     `20260824000000_fase4_billing.sql`).
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
   - For billing: `POLAR_ACCESS_TOKEN` from polar.sh → Settings →
     Developers (use a sandbox token while testing — set `POLAR_SERVER=sandbox`
     to match). Then run `POLAR_ACCESS_TOKEN=... node scripts/setup-polar.mjs`
     once to create the 3 products with their 14-day trial pre-configured,
     and paste the printed IDs in as `POLAR_PRODUCT_SOLO` /
     `POLAR_PRODUCT_PRACTICE` / `POLAR_PRODUCT_BILLING_CO`. Don't create the
     products by hand in the dashboard — the script is what keeps the trial
     settings consistent across all 3.
   - `POLAR_WEBHOOK_SECRET` can't be obtained until this app has a public
     URL: deploy first, then in Polar go to Settings → Webhooks → Add
     Endpoint, URL = `<your-app-url>/api/webhooks/polar`, events
     `subscription.created`, `subscription.updated`, `subscription.revoked`,
     then copy the secret it gives you. `scripts/test-webhook.mjs
     <org-id> [event-type]` sends a schema-correct, correctly-signed fake
     event to the local route if you want to test the sync logic without a
     live Polar call — it's not a substitute for the deploy-and-register
     step, since that's the only way to prove the *real* delivery path.

3. **Install & run** (requires Node.js 18.18+)

   ```bash
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000`, sign up, create an organization, add a
   provider, and add a credential with a past/near expiration date to see it
   show up on the dashboard. Add a payer and open `/enrollments` to see the
   matrix.

## Deliberately not built yet (see spec, Fase 5)

- Free Google Sheet template + its landing page (acquisition asset, not
  part of the product itself)

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
- `organizations.plan` (`solo`/`practice`/`billing_co`) and `provider_limit`
  are the source of truth the app reads from — they're kept in sync with
  Polar by the webhook, not read live from Polar on each request. The org
  is linked to Polar via `customerExternalId = organizations.id` at
  checkout time (see `lib/plans.js` for the plan → Polar product ID map),
  so the webhook never needs a separate lookup table.
