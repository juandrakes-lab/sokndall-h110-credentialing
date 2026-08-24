-- Fase 4 — billing fields on organizations. Enforcement itself
-- (provider_limit) already exists as a column from the init migration;
-- this just adds what's needed to track the Polar subscription behind it.

alter table public.organizations
  add column polar_customer_id text,
  add column polar_subscription_id text,
  add column subscription_status text,
  add column trial_ends_at timestamptz;
