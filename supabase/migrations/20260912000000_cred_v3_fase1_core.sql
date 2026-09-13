-- H110 v3 — Fase 1: the account core (alcance v3 §3.1–3.3, §4.3, §10.3).
--
-- Every table is `cred_*`, created here together with its RLS policies, one
-- policy per operation. The pre-v3 tables (organizations, providers, …) are
-- left in place untouched; nothing in the v3 app reads them.
--
-- Shape of the tenancy:
--   cred_organizations  the paying account (plan + limits live here)
--   cred_client_orgs    a client of that account. Solo/Practice have exactly
--                       one; Billing Co has one per client. Every data row
--                       carries client_org_id, and RLS isolates on it.
--   cred_practices      1:1 with a client org (group NPI, TIN, addresses)
--   cred_providers      belong to a practice
--   cred_credentials    belong to a provider
--
-- org_id / client_org_id on child rows are denormalised for cheap RLS and are
-- always derived by trigger from the parent row — never trusted from the app.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.cred_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'solo' check (plan in ('solo', 'practice', 'billing_co')),
  -- Limits are derived from `plan` by trigger (cred_apply_plan_limits) so
  -- nobody — app, webhook or SQL editor — can set them out of step.
  provider_limit integer not null default 3,
  user_limit integer not null default 1,
  storage_limit_mb integer not null default 1024,
  caqh_reattestation_interval_days integer not null default 120
    check (caqh_reattestation_interval_days between 30 and 365),
  created_at timestamptz not null default now()
);

create table public.cred_org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  -- null = every client of the org. A Billing Co member can be narrowed to a
  -- subset of clients; the owner always sees everything.
  client_ids uuid[],
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create unique index cred_org_members_one_owner
  on public.cred_org_members (org_id) where role = 'owner';

create table public.cred_client_orgs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

create table public.cred_practices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  -- unique: one practice per client org. With one client org per Solo /
  -- Practice account (trigger below) that is one practice per organization.
  client_org_id uuid not null unique references public.cred_client_orgs(id) on delete cascade,
  legal_name text not null check (length(trim(legal_name)) > 0),
  group_npi text check (group_npi ~ '^[0-9]{10}$'),
  tin text check (tin ~ '^[0-9]{9}$'),
  service_address_line1 text,
  service_address_line2 text,
  service_city text,
  service_state text check (service_state ~ '^[A-Z]{2}$'),
  service_zip text check (service_zip ~ '^[0-9]{5}([0-9]{4})?$'),
  billing_address_line1 text,
  billing_address_line2 text,
  billing_city text,
  billing_state text check (billing_state ~ '^[A-Z]{2}$'),
  billing_zip text check (billing_zip ~ '^[0-9]{5}([0-9]{4})?$'),
  -- Last NPI Registry (NPPES) record fetched for group_npi; used only to flag
  -- mismatches, never to overwrite what the user typed.
  nppes_data jsonb,
  nppes_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cred_providers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  practice_id uuid not null references public.cred_practices(id) on delete cascade,
  first_name text not null check (length(trim(first_name)) > 0),
  last_name text not null check (length(trim(last_name)) > 0),
  npi text check (npi ~ '^[0-9]{10}$'),
  caqh_id text,
  taxonomy_code text,
  specialty text,
  email text,
  phone text,
  start_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'inactive')),
  notes text,
  nppes_data jsonb,
  nppes_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cred_credentials (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  provider_id uuid not null references public.cred_providers(id) on delete cascade,
  type text not null check (type in (
    'state_license', 'dea', 'malpractice', 'board_cert', 'caqh_attestation'
  )),
  -- Generic columns, labelled per type in the UI:
  --   state_license: state, number, issue_date, expiration_date
  --   dea:           state, number, expiration_date
  --   malpractice:   issuer (carrier), number (policy), coverage, expiration_date
  --   board_cert:    issuer (board), issue_date (certified), expiration_date (recertification)
  --   caqh:          issue_date (last attestation) -> expiration_date computed
  state text check (state ~ '^[A-Z]{2}$'),
  number text,
  issuer text,
  coverage text,
  issue_date date,
  expiration_date date,
  -- Derived, never written by the app: see cred_compute_credential_fields().
  status text not null default 'active' check (status in ('active', 'expiring', 'expired')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index cred_org_members_user_idx on public.cred_org_members (user_id);
create index cred_client_orgs_org_idx on public.cred_client_orgs (org_id);
create index cred_practices_org_idx on public.cred_practices (org_id);
create index cred_providers_org_idx on public.cred_providers (org_id);
create index cred_providers_client_idx on public.cred_providers (client_org_id);
create index cred_providers_practice_idx on public.cred_providers (practice_id);
create index cred_credentials_client_idx on public.cred_credentials (client_org_id);
create index cred_credentials_provider_idx on public.cred_credentials (provider_id);
create index cred_credentials_org_idx on public.cred_credentials (org_id);
create index cred_credentials_expiration_idx on public.cred_credentials (expiration_date);

-- ---------------------------------------------------------------------------
-- Access helpers (security definer: they read cred_org_members, which the
-- policies themselves guard, so they must not recurse through RLS)
-- ---------------------------------------------------------------------------

create or replace function public.cred_is_org_member(p_org_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cred_org_members m
    where m.org_id = p_org_id and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.cred_is_org_owner(p_org_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cred_org_members m
    where m.org_id = p_org_id and m.user_id = (select auth.uid()) and m.role = 'owner'
  );
$$;

-- The one check every data policy goes through: is the caller a member of the
-- client's organization, and — for a member narrowed to a subset of clients —
-- is this client in their subset?
create or replace function public.cred_can_access_client(p_client_org_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cred_client_orgs c
    join public.cred_org_members m on m.org_id = c.org_id
    where c.id = p_client_org_id
      and m.user_id = (select auth.uid())
      and (m.role = 'owner' or m.client_ids is null or c.id = any (m.client_ids))
  );
$$;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create or replace function public.cred_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Plan -> limits (alcance §4.2). The only place these numbers exist in SQL.
create or replace function public.cred_apply_plan_limits()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  case new.plan
    when 'solo' then
      new.provider_limit := 3;  new.user_limit := 1;  new.storage_limit_mb := 1024;
    when 'practice' then
      new.provider_limit := 15; new.user_limit := 3;  new.storage_limit_mb := 5120;
    when 'billing_co' then
      new.provider_limit := 50; new.user_limit := 10; new.storage_limit_mb := 20480;
  end case;
  return new;
end;
$$;

create trigger cred_organizations_plan_limits
  before insert or update on public.cred_organizations
  for each row execute function public.cred_apply_plan_limits();

-- Solo and Practice: one client org, hence one practice, per organization.
-- A database rule, not a form check (alcance §4.3).
create or replace function public.cred_enforce_single_client()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_plan text;
begin
  select plan into v_plan from public.cred_organizations where id = new.org_id for update;

  if v_plan <> 'billing_co' and exists (
    select 1 from public.cred_client_orgs where org_id = new.org_id
  ) then
    raise exception 'SINGLE_PRACTICE_PLAN: only Billing Co accounts can hold more than one practice'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger cred_client_orgs_single_client
  before insert on public.cred_client_orgs
  for each row execute function public.cred_enforce_single_client();

create or replace function public.cred_practices_fill_scope()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  select c.org_id into new.org_id from public.cred_client_orgs c where c.id = new.client_org_id;
  return new;
end;
$$;

create trigger cred_practices_scope
  before insert or update on public.cred_practices
  for each row execute function public.cred_practices_fill_scope();

create trigger cred_practices_touch
  before update on public.cred_practices
  for each row execute function public.cred_touch_updated_at();

-- Providers: scope comes from the practice, and the plan's provider limit is
-- a hard stop on insert (alcance §4.3). The org row is locked so two
-- concurrent inserts cannot both squeeze past the limit.
create or replace function public.cred_providers_before_write()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_limit integer;
  v_count integer;
begin
  select p.client_org_id, p.org_id into new.client_org_id, new.org_id
  from public.cred_practices p where p.id = new.practice_id;

  if tg_op = 'INSERT' then
    select o.provider_limit into v_limit
    from public.cred_organizations o where o.id = new.org_id for update;

    select count(*) into v_count from public.cred_providers where org_id = new.org_id;

    if v_count >= v_limit then
      raise exception 'PROVIDER_LIMIT_REACHED: this plan allows % providers', v_limit
        using errcode = 'P0001';
    end if;
  else
    new.updated_at := now();
  end if;

  return new;
end;
$$;

create trigger cred_providers_before_write
  before insert or update on public.cred_providers
  for each row execute function public.cred_providers_before_write();

-- Credential status is derived from the expiration date, never entered by
-- hand; CAQH's next due date is last attestation + the org's interval.
create or replace function public.cred_status_for(p_expiration date)
returns text
language sql stable
set search_path = ''
as $$
  select case
    when p_expiration is null then 'active'
    when p_expiration < current_date then 'expired'
    when p_expiration <= current_date + 90 then 'expiring'
    else 'active'
  end;
$$;

create or replace function public.cred_compute_credential_fields()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_interval integer;
begin
  select p.client_org_id, p.org_id into new.client_org_id, new.org_id
  from public.cred_providers p where p.id = new.provider_id;

  if new.type = 'caqh_attestation' then
    if new.issue_date is null then
      new.expiration_date := null;
    else
      select o.caqh_reattestation_interval_days into v_interval
      from public.cred_organizations o where o.id = new.org_id;
      new.expiration_date := new.issue_date + coalesce(v_interval, 120);
    end if;
  end if;

  new.status := public.cred_status_for(new.expiration_date);

  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;

  return new;
end;
$$;

create trigger cred_credentials_compute
  before insert or update on public.cred_credentials
  for each row execute function public.cred_compute_credential_fields();

-- Changing the org's CAQH interval re-derives every CAQH due date.
create or replace function public.cred_recompute_caqh_on_interval_change()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if new.caqh_reattestation_interval_days is distinct from old.caqh_reattestation_interval_days then
    update public.cred_credentials
      set updated_at = now()
      where org_id = new.id and type = 'caqh_attestation';
  end if;
  return new;
end;
$$;

create trigger cred_organizations_caqh_interval
  after update on public.cred_organizations
  for each row execute function public.cred_recompute_caqh_on_interval_change();

-- A status computed on write goes stale as days pass; refresh it daily.
create or replace function public.cred_refresh_credential_statuses()
returns integer
language plpgsql security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  update public.cred_credentials
    set status = public.cred_status_for(expiration_date)
    where status is distinct from public.cred_status_for(expiration_date);
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- Temporary account bootstrap.
-- Until billing lands (alcance §10.1), the signed-in user creates their own
-- organization here. The billing phase drops this function: from then on an
-- organization is only ever created by the Polar webhook.
-- ---------------------------------------------------------------------------

create or replace function public.cred_bootstrap_organization(p_name text)
returns uuid
language plpgsql security definer
set search_path = ''
as $$
declare
  v_user uuid := (select auth.uid());
  v_org uuid;
begin
  if v_user is null then
    raise exception 'not signed in';
  end if;
  if exists (select 1 from public.cred_org_members where user_id = v_user) then
    raise exception 'ALREADY_MEMBER: this user already belongs to an organization';
  end if;

  insert into public.cred_organizations (name, owner_user_id, plan)
  values (trim(p_name), v_user, 'solo')
  returning id into v_org;

  insert into public.cred_org_members (org_id, user_id, role)
  values (v_org, v_user, 'owner');

  insert into public.cred_client_orgs (org_id, name)
  values (v_org, trim(p_name));

  return v_org;
end;
$$;

-- ---------------------------------------------------------------------------
-- Privileges. Nothing here is reachable anonymously; authenticated users get
-- only the columns they may change.
-- ---------------------------------------------------------------------------

revoke all on public.cred_organizations, public.cred_org_members, public.cred_client_orgs,
  public.cred_practices, public.cred_providers, public.cred_credentials from anon;

-- Plan and limits are written only by the billing webhook (service role).
revoke insert, update, delete on public.cred_organizations from authenticated;
grant update (name, caqh_reattestation_interval_days) on public.cred_organizations to authenticated;

-- Membership only changes through security-definer functions.
revoke insert, update, delete on public.cred_org_members from authenticated;

-- Client orgs are created by cred_bootstrap_organization (and, for Billing Co,
-- by the multi-client phase); no direct writes for now.
revoke insert, update, delete on public.cred_client_orgs from authenticated;

revoke execute on function
  public.cred_is_org_member(uuid), public.cred_is_org_owner(uuid),
  public.cred_can_access_client(uuid), public.cred_refresh_credential_statuses(),
  public.cred_bootstrap_organization(text)
from public, anon;

grant execute on function
  public.cred_is_org_member(uuid), public.cred_is_org_owner(uuid),
  public.cred_can_access_client(uuid), public.cred_bootstrap_organization(text)
to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security — one policy per operation.
-- ---------------------------------------------------------------------------

alter table public.cred_organizations enable row level security;
alter table public.cred_org_members enable row level security;
alter table public.cred_client_orgs enable row level security;
alter table public.cred_practices enable row level security;
alter table public.cred_providers enable row level security;
alter table public.cred_credentials enable row level security;

create policy cred_organizations_select on public.cred_organizations
  for select to authenticated using (public.cred_is_org_member(id));
create policy cred_organizations_update on public.cred_organizations
  for update to authenticated
  using (public.cred_is_org_owner(id)) with check (public.cred_is_org_owner(id));

create policy cred_org_members_select on public.cred_org_members
  for select to authenticated using (public.cred_is_org_member(org_id));

create policy cred_client_orgs_select on public.cred_client_orgs
  for select to authenticated using (public.cred_can_access_client(id));

create policy cred_practices_select on public.cred_practices
  for select to authenticated using (public.cred_can_access_client(client_org_id));
create policy cred_practices_insert on public.cred_practices
  for insert to authenticated with check (public.cred_can_access_client(client_org_id));
create policy cred_practices_update on public.cred_practices
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id));
-- No delete policy: removing a practice would cascade every provider under it.

create policy cred_providers_select on public.cred_providers
  for select to authenticated using (public.cred_can_access_client(client_org_id));
create policy cred_providers_insert on public.cred_providers
  for insert to authenticated with check (public.cred_can_access_client(client_org_id));
create policy cred_providers_update on public.cred_providers
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id));
create policy cred_providers_delete on public.cred_providers
  for delete to authenticated using (public.cred_can_access_client(client_org_id));

create policy cred_credentials_select on public.cred_credentials
  for select to authenticated using (public.cred_can_access_client(client_org_id));
create policy cred_credentials_insert on public.cred_credentials
  for insert to authenticated with check (public.cred_can_access_client(client_org_id));
create policy cred_credentials_update on public.cred_credentials
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id));
create policy cred_credentials_delete on public.cred_credentials
  for delete to authenticated using (public.cred_can_access_client(client_org_id));

-- ---------------------------------------------------------------------------
-- Daily status refresh (pg_cron, 05:00 UTC ≈ midnight US Eastern).
-- ---------------------------------------------------------------------------

create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'cred-refresh-credential-statuses',
  '0 5 * * *',
  $$select public.cred_refresh_credential_statuses()$$
);
