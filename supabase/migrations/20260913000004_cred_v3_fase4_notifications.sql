-- H110 v3 — Fase 4: email alerts and the weekly digest (alcance v3 §3.11).
--
--   cred_organizations.alert_days   the ladder, configurable per organization
--                                   (default 90/60/30/14/7; expired always alerts once)
--   cred_credentials.assigned_user_id  who's responsible for a credential
--                                   (null = the owner), like enrollments
--   cred_notification_log           every alert/digest sent, one row per item
--                                   and recipient; the unique key makes a
--                                   double-fired cron send nothing twice

alter table public.cred_organizations
  add column alert_days integer[] not null default '{90,60,30,14,7}'
  check (
    cardinality(alert_days) between 1 and 8
    and 1 <= all (alert_days) and 365 >= all (alert_days)
  );

grant update (alert_days) on public.cred_organizations to authenticated;

alter table public.cred_credentials
  add column assigned_user_id uuid references auth.users(id) on delete set null;
create index cred_credentials_assigned_idx on public.cred_credentials (assigned_user_id);

-- Can this user (not necessarily the caller) work on this client? Used to
-- keep assignments inside the assignee's own access.
create or replace function public.cred_user_can_access_client(p_user_id uuid, p_client_org_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cred_client_orgs c
    join public.cred_org_members m on m.org_id = c.org_id
    where c.id = p_client_org_id
      and m.user_id = p_user_id
      and (m.role = 'owner' or m.client_ids is null or c.id = any (m.client_ids))
  );
$$;

revoke execute on function public.cred_user_can_access_client(uuid, uuid) from public, anon, authenticated;

-- Credentials: same derivation as before, plus the assignee check.
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

  if new.assigned_user_id is not null
     and not public.cred_user_can_access_client(new.assigned_user_id, new.client_org_id) then
    raise exception 'ASSIGNEE_NOT_MEMBER: the assignee can''t access this client' using errcode = 'P0001';
  end if;

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

-- Enrollments: the assignee must be able to see the client, not merely
-- belong to the organization (a Billing Co member may be limited to some).
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

  if new.assigned_user_id is not null
     and not public.cred_user_can_access_client(new.assigned_user_id, new.client_org_id) then
    raise exception 'ASSIGNEE_NOT_MEMBER: the assignee can''t access this client' using errcode = 'P0001';
  end if;

  if tg_op = 'INSERT' or new.status is distinct from old.status then
    new.status_changed_at := now();
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

create table public.cred_notification_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  kind text not null check (kind in ('alert', 'digest')),
  -- What was announced, e.g. "credential:<id>:<due date>:30" or "digest:2026-09-14".
  subject_key text not null,
  recipient text not null,
  cc text,
  status text not null check (status in ('pending', 'sent', 'failed')),
  error text,
  created_at timestamptz not null default now(),
  unique (kind, subject_key, recipient)
);

create index cred_notification_log_org_idx on public.cred_notification_log (org_id, created_at desc);

-- Claims rows before sending: new keys are inserted as pending, failed ones
-- are re-armed, anything pending or sent is skipped. Returns what this run
-- may send. Service role only (the cron routes).
create or replace function public.cred_claim_notifications(p_rows jsonb)
returns setof text
language sql volatile security definer
set search_path = ''
as $$
  insert into public.cred_notification_log (org_id, kind, subject_key, recipient, cc, status)
  select (r->>'org_id')::uuid, r->>'kind', r->>'subject_key', r->>'recipient', r->>'cc', 'pending'
  from jsonb_array_elements(p_rows) r
  on conflict (kind, subject_key, recipient) do update
    set status = 'pending', error = null, created_at = now(), cc = excluded.cc
    where public.cred_notification_log.status = 'failed'
  returning subject_key;
$$;

revoke execute on function public.cred_claim_notifications(jsonb) from public, anon, authenticated;
grant execute on function public.cred_claim_notifications(jsonb) to service_role;

revoke all on public.cred_notification_log from anon;
revoke insert, update, delete on public.cred_notification_log from authenticated;

alter table public.cred_notification_log enable row level security;

-- The account owner can see what was sent; nobody writes it from the app.
create policy cred_notification_log_select on public.cred_notification_log
  for select to authenticated using (public.cred_is_org_owner(org_id));
