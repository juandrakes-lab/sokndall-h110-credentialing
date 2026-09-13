-- H110 v3 — Fase 1 follow-up.

-- Trigger functions are never meant to be called over the REST API.
revoke execute on function
  public.cred_touch_updated_at(),
  public.cred_apply_plan_limits(),
  public.cred_enforce_single_client(),
  public.cred_practices_fill_scope(),
  public.cred_providers_before_write(),
  public.cred_compute_credential_fields(),
  public.cred_recompute_caqh_on_interval_change(),
  public.cred_refresh_credential_statuses()
from public, anon, authenticated;

-- Leftover from an unrelated app that used to share this Supabase project: it
-- inserted every new auth user into public.profiles, a table removed on
-- 2026-08-24. Since then every signup failed with "Database error creating
-- new user". The function is kept (harmless, unreferenced); only the trigger
-- goes.
drop trigger if exists on_auth_user_created on auth.users;
