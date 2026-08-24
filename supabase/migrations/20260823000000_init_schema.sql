-- H110 credentialing — initial schema (spec section 1)
-- All tables are RLS-gated by org_members. No PHI. No direct writes that bypass RLS.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'trial',
  provider_limit integer not null default 3,
  caqh_reattestation_interval_days integer not null default 120,
  created_at timestamptz not null default now()
);

create table public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  npi text,
  caqh_id text,
  specialty text,
  email text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  notes text,
  created_at timestamptz not null default now()
);

create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  type text not null check (type in (
    'state_license', 'dea', 'malpractice', 'board_cert',
    'caqh_attestation', 'bls_acls', 'other'
  )),
  identifier text,
  state text,
  issue_date date,
  expiration_date date,
  status text not null default 'active' check (status in ('active', 'expiring', 'expired')),
  notes text,
  created_at timestamptz not null default now()
);

create table public.payers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  payer_type text not null check (payer_type in ('commercial', 'medicare', 'medicaid', 'other'))
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  payer_id uuid not null references public.payers(id) on delete cascade,
  status text not null default 'not_started' check (status in (
    'not_started', 'submitted', 'in_review', 'info_requested',
    'approved', 'denied', 'revalidation_due'
  )),
  submitted_date date,
  effective_date date,
  next_revalidation_date date,
  external_ref text,
  notes text
);

create table public.enrollment_events (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  from_status text,
  to_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.notification_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  type text not null,
  payload jsonb,
  sent_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index idx_org_members_user_id on public.org_members(user_id);
create index idx_org_members_org_id on public.org_members(org_id);
create index idx_providers_org_id on public.providers(org_id);
create index idx_credentials_provider_id on public.credentials(provider_id);
create index idx_credentials_expiration_date on public.credentials(expiration_date);
create index idx_payers_org_id on public.payers(org_id);
create index idx_enrollments_provider_id on public.enrollments(provider_id);
create index idx_enrollments_payer_id on public.enrollments(payer_id);
create index idx_enrollment_events_enrollment_id on public.enrollment_events(enrollment_id);
create index idx_notification_log_org_id on public.notification_log(org_id);

-- ---------------------------------------------------------------------------
-- Helper functions (security definer so RLS policies can check membership
-- without recursive-policy issues)
-- ---------------------------------------------------------------------------

create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.org_members m
    where m.org_id = p_org_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.provider_org_id(p_provider_id uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select org_id from public.providers where id = p_provider_id;
$$;

create or replace function public.enrollment_org_id(p_enrollment_id uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select public.provider_org_id(e.provider_id)
  from public.enrollments e
  where e.id = p_enrollment_id;
$$;

-- Self-serve org creation: creates the org and the owner membership row
-- atomically, bypassing the chicken-and-egg problem of RLS on both tables.
create or replace function public.create_organization(org_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  insert into public.organizations (name, owner_user_id)
  values (org_name, auth.uid())
  returning id into v_org_id;

  insert into public.org_members (org_id, user_id, role)
  values (v_org_id, auth.uid(), 'owner');

  return v_org_id;
end;
$$;

grant execute on function public.create_organization(text) to authenticated;

-- Derives credential status from expiration_date (never entered by hand),
-- and computes CAQH re-attestation due dates from the org's configurable
-- interval (default 120 days) instead of hardcoding it.
create or replace function public.compute_credential_fields()
returns trigger
language plpgsql
as $$
declare
  v_interval integer;
begin
  if new.type = 'caqh_attestation' and new.issue_date is not null then
    select o.caqh_reattestation_interval_days into v_interval
    from public.organizations o
    where o.id = public.provider_org_id(new.provider_id);

    new.expiration_date := new.issue_date + make_interval(days => coalesce(v_interval, 120));
  end if;

  if new.expiration_date is null then
    new.status := 'active';
  elsif new.expiration_date < current_date then
    new.status := 'expired';
  elsif new.expiration_date <= current_date + interval '90 days' then
    new.status := 'expiring';
  else
    new.status := 'active';
  end if;

  return new;
end;
$$;

create trigger trg_compute_credential_fields
  before insert or update on public.credentials
  for each row execute function public.compute_credential_fields();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.organizations enable row level security;
alter table public.org_members enable row level security;
alter table public.providers enable row level security;
alter table public.credentials enable row level security;
alter table public.payers enable row level security;
alter table public.enrollments enable row level security;
alter table public.enrollment_events enable row level security;
alter table public.notification_log enable row level security;

create policy "org_select_members" on public.organizations
  for select using (public.is_org_member(id));
create policy "org_insert_self" on public.organizations
  for insert with check (owner_user_id = auth.uid());
create policy "org_update_owner" on public.organizations
  for update using (owner_user_id = auth.uid());

-- org_members has no direct insert/update/delete policy: membership is only
-- ever granted via create_organization() (security definer). Invite flows
-- (Fase 2+) should add a dedicated security-definer function, not a raw policy.
create policy "org_members_select" on public.org_members
  for select using (public.is_org_member(org_id));

create policy "providers_select" on public.providers
  for select using (public.is_org_member(org_id));
create policy "providers_insert" on public.providers
  for insert with check (public.is_org_member(org_id));
create policy "providers_update" on public.providers
  for update using (public.is_org_member(org_id));
create policy "providers_delete" on public.providers
  for delete using (public.is_org_member(org_id));

create policy "credentials_select" on public.credentials
  for select using (public.is_org_member(public.provider_org_id(provider_id)));
create policy "credentials_insert" on public.credentials
  for insert with check (public.is_org_member(public.provider_org_id(provider_id)));
create policy "credentials_update" on public.credentials
  for update using (public.is_org_member(public.provider_org_id(provider_id)));
create policy "credentials_delete" on public.credentials
  for delete using (public.is_org_member(public.provider_org_id(provider_id)));

create policy "payers_select" on public.payers
  for select using (public.is_org_member(org_id));
create policy "payers_insert" on public.payers
  for insert with check (public.is_org_member(org_id));
create policy "payers_update" on public.payers
  for update using (public.is_org_member(org_id));
create policy "payers_delete" on public.payers
  for delete using (public.is_org_member(org_id));

create policy "enrollments_select" on public.enrollments
  for select using (public.is_org_member(public.provider_org_id(provider_id)));
create policy "enrollments_insert" on public.enrollments
  for insert with check (public.is_org_member(public.provider_org_id(provider_id)));
create policy "enrollments_update" on public.enrollments
  for update using (public.is_org_member(public.provider_org_id(provider_id)));
create policy "enrollments_delete" on public.enrollments
  for delete using (public.is_org_member(public.provider_org_id(provider_id)));

-- enrollment_events is an append-only audit trail: select + insert only.
create policy "enrollment_events_select" on public.enrollment_events
  for select using (public.is_org_member(public.enrollment_org_id(enrollment_id)));
create policy "enrollment_events_insert" on public.enrollment_events
  for insert with check (public.is_org_member(public.enrollment_org_id(enrollment_id)));

-- notification_log is written server-side with the service role (digests,
-- alerts in Fase 3), so authenticated users only get read access.
create policy "notification_log_select" on public.notification_log
  for select using (public.is_org_member(org_id));
