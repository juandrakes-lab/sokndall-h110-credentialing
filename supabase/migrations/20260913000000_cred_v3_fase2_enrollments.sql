-- H110 v3 — Fase 2: payers, enrollments, follow-up engine, communications log
-- (alcance v3 §3.4–3.7, §3.13).
--
--   cred_payers_global       the catalog we curate; read-only for customers
--   cred_payers_org          the payers an organization works with: either a
--                            pick from the catalog or its own regional payer
--   cred_enrollments         provider × payer, the core of the product
--   cred_enrollment_events   automatic status history (who, when, from, to)
--   cred_communications      the call / portal / email log per enrollment

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.cred_payers_global (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  payer_type text not null check (payer_type in ('commercial', 'medicare', 'medicaid', 'other')),
  -- Default revalidation / recredentialing cycle; overridable per enrollment.
  revalidation_months integer not null check (revalidation_months > 0),
  state text check (state ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now()
);

create table public.cred_payers_org (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  payer_global_id uuid references public.cred_payers_global(id) on delete restrict,
  -- Own payers carry their own details; catalog picks read them from the catalog.
  name text,
  payer_type text check (payer_type in ('commercial', 'medicare', 'medicaid', 'other')),
  revalidation_months integer check (revalidation_months > 0),
  created_at timestamptz not null default now(),
  check (
    payer_global_id is not null
    or (name is not null and length(trim(name)) > 0 and payer_type is not null and revalidation_months is not null)
  )
);

create unique index cred_payers_org_catalog_once
  on public.cred_payers_org (org_id, payer_global_id) where payer_global_id is not null;
create unique index cred_payers_org_name_once
  on public.cred_payers_org (org_id, lower(name)) where payer_global_id is null;

create table public.cred_enrollments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  provider_id uuid not null references public.cred_providers(id) on delete cascade,
  -- No cascade: a payer with enrollments can't be removed from the list by
  -- accident (the check runs at end of statement, so deleting a whole
  -- organization still cascades cleanly).
  payer_id uuid not null references public.cred_payers_org(id),
  status text not null default 'not_started' check (status in (
    'not_started', 'submitted', 'in_review', 'info_requested', 'approved', 'denied'
  )),
  -- Null = the organization's owner is responsible (alcance §3.5).
  assigned_user_id uuid references auth.users(id) on delete set null,
  next_follow_up_date date,
  submitted_date date,
  effective_date date,
  external_ref text,
  notes text,
  revalidation_months_override integer check (revalidation_months_override > 0),
  -- Derived by trigger: effective date + the payer's cycle (or the override).
  revalidation_due_date date,
  -- Last time the status actually changed; drives the "stalled" flag.
  status_changed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id, payer_id)
);

create table public.cred_enrollment_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  enrollment_id uuid not null references public.cred_enrollments(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.cred_communications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  enrollment_id uuid not null references public.cred_enrollments(id) on delete cascade,
  contact_date date not null default current_date,
  channel text not null check (channel in ('phone', 'portal', 'email')),
  contact_person text,
  reference_number text,
  outcome text,
  requested text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index cred_payers_org_org_idx on public.cred_payers_org (org_id);
create index cred_enrollments_client_idx on public.cred_enrollments (client_org_id);
create index cred_enrollments_payer_idx on public.cred_enrollments (payer_id);
create index cred_enrollments_follow_up_idx on public.cred_enrollments (next_follow_up_date);
create index cred_enrollments_assigned_idx on public.cred_enrollments (assigned_user_id);
create index cred_enrollment_events_enrollment_idx on public.cred_enrollment_events (enrollment_id);
create index cred_enrollment_events_client_idx on public.cred_enrollment_events (client_org_id);
create index cred_communications_enrollment_idx on public.cred_communications (enrollment_id);
create index cred_communications_client_idx on public.cred_communications (client_org_id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create or replace function public.cred_enrollments_before_write()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_payer_org uuid;
  v_months integer;
begin
  select p.client_org_id, p.org_id into new.client_org_id, new.org_id
  from public.cred_providers p where p.id = new.provider_id;

  select po.org_id, coalesce(po.revalidation_months, pg.revalidation_months)
    into v_payer_org, v_months
  from public.cred_payers_org po
  left join public.cred_payers_global pg on pg.id = po.payer_global_id
  where po.id = new.payer_id;

  if v_payer_org is distinct from new.org_id then
    raise exception 'PAYER_OTHER_ORG: the payer belongs to another organization' using errcode = 'P0001';
  end if;

  if new.assigned_user_id is not null and not exists (
    select 1 from public.cred_org_members m
    where m.org_id = new.org_id and m.user_id = new.assigned_user_id
  ) then
    raise exception 'ASSIGNEE_NOT_MEMBER: the assignee is not a member of this organization' using errcode = 'P0001';
  end if;

  if tg_op = 'INSERT' or new.status is distinct from old.status then
    new.status_changed_at := now();
    -- An approved application has nothing left to chase.
    if new.status = 'approved' then
      new.next_follow_up_date := null;
    end if;
  end if;

  if new.effective_date is null then
    new.revalidation_due_date := null;
  else
    new.revalidation_due_date :=
      (new.effective_date + make_interval(months => coalesce(new.revalidation_months_override, v_months)))::date;
  end if;

  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;

  return new;
end;
$$;

create trigger cred_enrollments_before_write
  before insert or update on public.cred_enrollments
  for each row execute function public.cred_enrollments_before_write();

-- Every status change is written to the history automatically; the app never
-- writes history rows itself.
create or replace function public.cred_log_enrollment_event()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.cred_enrollment_events
      (org_id, client_org_id, enrollment_id, from_status, to_status, changed_by)
    values
      (new.org_id, new.client_org_id, new.id,
       case when tg_op = 'UPDATE' then old.status end, new.status, (select auth.uid()));
  end if;
  return new;
end;
$$;

create trigger cred_enrollments_log_event
  after insert or update on public.cred_enrollments
  for each row execute function public.cred_log_enrollment_event();

create or replace function public.cred_communications_before_write()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  select e.client_org_id, e.org_id into new.client_org_id, new.org_id
  from public.cred_enrollments e where e.id = new.enrollment_id;
  if tg_op = 'INSERT' then
    new.created_by := (select auth.uid());
  end if;
  return new;
end;
$$;

create trigger cred_communications_before_write
  before insert or update on public.cred_communications
  for each row execute function public.cred_communications_before_write();

-- Who can be assigned: the members of the caller's organizations, with their
-- email (auth.users is not readable directly).
create or replace function public.cred_org_directory()
returns table (org_id uuid, user_id uuid, email text, role text)
language sql stable security definer
set search_path = ''
as $$
  select m.org_id, m.user_id, u.email::text, m.role
  from public.cred_org_members m
  join auth.users u on u.id = m.user_id
  where m.org_id in (
    select mm.org_id from public.cred_org_members mm where mm.user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- Privileges
-- ---------------------------------------------------------------------------

revoke all on public.cred_payers_global, public.cred_payers_org, public.cred_enrollments,
  public.cred_enrollment_events, public.cred_communications from anon;

-- The catalog is ours to curate.
revoke insert, update, delete on public.cred_payers_global from authenticated;
-- History is written by trigger only, and never edited.
revoke insert, update, delete on public.cred_enrollment_events from authenticated;

revoke execute on function
  public.cred_enrollments_before_write(), public.cred_log_enrollment_event(),
  public.cred_communications_before_write()
from public, anon, authenticated;

revoke execute on function public.cred_org_directory() from public, anon;
grant execute on function public.cred_org_directory() to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security — one policy per operation.
-- ---------------------------------------------------------------------------

alter table public.cred_payers_global enable row level security;
alter table public.cred_payers_org enable row level security;
alter table public.cred_enrollments enable row level security;
alter table public.cred_enrollment_events enable row level security;
alter table public.cred_communications enable row level security;

create policy cred_payers_global_select on public.cred_payers_global
  for select to authenticated using (true);

-- An organization's payer list is shared by all its clients.
create policy cred_payers_org_select on public.cred_payers_org
  for select to authenticated using (public.cred_is_org_member(org_id));
create policy cred_payers_org_insert on public.cred_payers_org
  for insert to authenticated with check (public.cred_is_org_member(org_id));
create policy cred_payers_org_update on public.cred_payers_org
  for update to authenticated
  using (public.cred_is_org_member(org_id)) with check (public.cred_is_org_member(org_id));
create policy cred_payers_org_delete on public.cred_payers_org
  for delete to authenticated using (public.cred_is_org_member(org_id));

create policy cred_enrollments_select on public.cred_enrollments
  for select to authenticated using (public.cred_can_access_client(client_org_id));
create policy cred_enrollments_insert on public.cred_enrollments
  for insert to authenticated with check (public.cred_can_access_client(client_org_id));
create policy cred_enrollments_update on public.cred_enrollments
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id));
create policy cred_enrollments_delete on public.cred_enrollments
  for delete to authenticated using (public.cred_can_access_client(client_org_id));

create policy cred_enrollment_events_select on public.cred_enrollment_events
  for select to authenticated using (public.cred_can_access_client(client_org_id));

create policy cred_communications_select on public.cred_communications
  for select to authenticated using (public.cred_can_access_client(client_org_id));
create policy cred_communications_insert on public.cred_communications
  for insert to authenticated with check (public.cred_can_access_client(client_org_id));
create policy cred_communications_update on public.cred_communications
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id));
create policy cred_communications_delete on public.cred_communications
  for delete to authenticated using (public.cred_can_access_client(client_org_id));
