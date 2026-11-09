-- Interactive demo accounts (pedido 2026-11-08, H110_SANDBOX_ESPECIFICACION).
-- A demo is an ordinary organization with a row in cred_demos: created by
-- scripts/demo.mjs (service role), opened through /demo/<code>, 72 h from the
-- first open (one extension), read-only for 7 days after, then deleted with
-- its user. It never touches Polar. Sample data only.

create table public.cred_demos (
  org_id uuid primary key references public.cred_organizations(id) on delete cascade,
  firm text not null check (length(trim(firm)) between 1 and 120),
  lead_name text check (length(lead_name) <= 120),
  link_hash text not null unique,
  created_at timestamptz not null default now(),
  seeded_at timestamptz not null default now(),
  first_opened_at timestamptz,
  last_seen_at timestamptz,
  expires_at timestamptz,
  extended boolean not null default false,
  revoked_at timestamptz,
  contact_email text check (contact_email is null or length(contact_email) <= 254),
  events_done text[] not null default '{}',
  opened_notice_sent boolean not null default false,
  summary_sent_at timestamptz
);
alter table public.cred_demos enable row level security;
-- Members read their own demo's row (banner, steps); every write goes through
-- the service role or the security definer functions below.
create policy cred_demos_member_read on public.cred_demos for select to authenticated
  using (exists (select 1 from public.cred_org_members m where m.org_id = cred_demos.org_id and m.user_id = (select auth.uid())));

-- What a demo's visitor used (the spec's activity log; demo accounts only,
-- announced on entry). Never the text they type.
create table public.cred_demo_activity (
  id bigint generated always as identity primary key,
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  kind text not null check (kind in ('open', 'visit', 'blocked', 'step', 'email', 'load_real', 'event')),
  detail text check (length(detail) <= 200),
  created_at timestamptz not null default now()
);
create index cred_demo_activity_org on public.cred_demo_activity (org_id, created_at);
alter table public.cred_demo_activity enable row level security;
revoke all on public.cred_demo_activity from anon, authenticated;

create or replace function public.cred_demo_log(p_kind text, p_detail text default null)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_org uuid;
begin
  select m.org_id into v_org from public.cred_org_members m
    join public.cred_demos d on d.org_id = m.org_id
  where m.user_id = (select auth.uid()) limit 1;
  if v_org is null then return; end if;
  insert into public.cred_demo_activity (org_id, kind, detail) values (v_org, p_kind, left(p_detail, 200));
  update public.cred_demos set last_seen_at = now() where org_id = v_org;
end;
$$;
revoke execute on function public.cred_demo_log(text, text) from public, anon;
grant execute on function public.cred_demo_log(text, text) to authenticated;

-- The visitor's opt-in email for the demo's own alerts.
create or replace function public.cred_demo_set_email(p_email text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_org uuid;
begin
  select m.org_id into v_org from public.cred_org_members m
    join public.cred_demos d on d.org_id = m.org_id
  where m.user_id = (select auth.uid()) limit 1;
  if v_org is null then raise exception 'NOT_A_DEMO'; end if;
  update public.cred_demos set contact_email = nullif(left(trim(p_email), 254), '') where org_id = v_org;
end;
$$;
revoke execute on function public.cred_demo_set_email(text) from public, anon;
grant execute on function public.cred_demo_set_email(text) to authenticated;

-- Writable: a demo only while open and not expired or revoked.
create or replace function public.cred_org_writable(p_org_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cred_organizations o
    where o.id = p_org_id
      and (
        o.subscription_status in ('trialing', 'active', 'past_due')
        or (o.subscription_status = 'canceled' and o.current_period_end > now())
      )
      and not (
        o.polar_subscription_id is null
        and o.trial_ends_at is not null
        and o.trial_ends_at <= now()
      )
      and not exists (
        select 1 from public.cred_demos d
        where d.org_id = o.id and (d.revoked_at is not null or d.expires_at is null or d.expires_at <= now())
      )
  );
$$;

-- Demo limits the database enforces whatever the screen does: at most 3 new
-- providers, no documents, no invitations.
create or replace function public.cred_demo_guard()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_org uuid; v_seeded timestamptz; v_row jsonb := to_jsonb(new);
begin
  -- Read through jsonb: the tables don't share columns (practice_id,
  -- client_org_id), and plpgsql resolves every NEW.field it is given.
  v_org := coalesce(
    (v_row ->> 'org_id')::uuid,
    (select org_id from public.cred_practices where id = (v_row ->> 'practice_id')::uuid),
    (select org_id from public.cred_client_orgs where id = (v_row ->> 'client_org_id')::uuid));
  select seeded_at into v_seeded from public.cred_demos where org_id = v_org;
  if v_seeded is null then return new; end if;
  -- The seed (service role) is never limited.
  if current_setting('request.jwt.claim.role', true) = 'service_role' or (select auth.uid()) is null then return new; end if;
  if tg_table_name = 'cred_providers' then
    if (select count(*) from public.cred_providers p join public.cred_practices pr on pr.id = p.practice_id
        where pr.org_id = v_org and p.created_at > v_seeded) >= 3 then
      raise exception 'DEMO_PROVIDER_LIMIT';
    end if;
    return new;
  end if;
  raise exception 'DEMO_BLOCKED';
end;
$$;
create trigger cred_providers_demo_guard before insert on public.cred_providers for each row execute function public.cred_demo_guard();
create trigger cred_documents_demo_guard before insert on public.cred_documents for each row execute function public.cred_demo_guard();
create trigger cred_invitations_demo_guard before insert on public.cred_invitations for each row execute function public.cred_demo_guard();
create trigger cred_upload_links_demo_guard before insert on public.cred_upload_links for each row execute function public.cred_demo_guard();

-- Moves every date of a demo by p_days (whole days), so a demo seeded on one
-- day reads the same the day it is first opened: the "stalled tomorrow" and
-- "CAQH due in 3 days" moments land relative to the first open.
create or replace function public.cred_demo_shift(p_org uuid, p_days integer)
returns void
language plpgsql security definer set search_path = ''
as $$
declare iv interval := make_interval(days => p_days);
begin
  if not exists (select 1 from public.cred_demos where org_id = p_org) then raise exception 'NOT_A_DEMO'; end if;
  update public.cred_enrollments set
    submitted_date = submitted_date + p_days, effective_date = effective_date + p_days,
    next_follow_up_date = next_follow_up_date + p_days,
    status_changed_at = status_changed_at + iv, pending_request_at = pending_request_at + iv
  where org_id = p_org;
  update public.cred_communications c set contact_date = contact_date + p_days
  from public.cred_enrollments e where e.id = c.enrollment_id and e.org_id = p_org;
  update public.cred_credentials set issue_date = issue_date + p_days, expiration_date = expiration_date + p_days
  where org_id = p_org;
end;
$$;
revoke execute on function public.cred_demo_shift(uuid, integer) from public, anon, authenticated;

-- The prepared moment that needs a change (spec: day 2, a payer asks for a
-- document), plus the record of which moments have happened. Called by the
-- app on each demo page (the visitor's own session) and by the daily job
-- (service role, with p_org). Returns the moments that became due now.
-- Day 1 (stalled) and day 3 (CAQH in the alert window) need no change: the
-- seed's dates, shifted at first open, cross those lines on their own.
create or replace function public.cred_demo_tick(p_org uuid default null)
returns text[]
language plpgsql security definer set search_path = ''
as $$
declare
  d public.cred_demos;
  v_org uuid;
  v_hours numeric;
  v_due text[] := '{}';
  v_target uuid;
begin
  if (select auth.uid()) is not null then
    select m.org_id into v_org from public.cred_org_members m where m.user_id = (select auth.uid()) limit 1;
  else
    v_org := p_org;
  end if;
  select * into d from public.cred_demos where org_id = v_org for update;
  if d.org_id is null or d.first_opened_at is null or d.revoked_at is not null or d.expires_at <= now() then
    return v_due;
  end if;
  v_hours := extract(epoch from (now() - d.first_opened_at)) / 3600;
  if v_hours >= 24 and not ('stalled' = any (d.events_done)) then v_due := array_append(v_due, 'stalled'); end if;
  if v_hours >= 48 and not ('payer_request' = any (d.events_done)) then
    select id into v_target from public.cred_enrollments
      where org_id = v_org and status = 'in_review' and pending_request is null
      order by status_changed_at asc limit 1;
    if v_target is not null then
      update public.cred_enrollments
        set status = 'info_requested',
            pending_request = 'Updated malpractice certificate (COI) showing current coverage dates',
            pending_request_at = now()
        where id = v_target;
    end if;
    v_due := array_append(v_due, 'payer_request');
  end if;
  if v_hours >= 60 and not ('caqh' = any (d.events_done)) then v_due := array_append(v_due, 'caqh'); end if;
  if array_length(v_due, 1) > 0 then
    update public.cred_demos set events_done = events_done || v_due where org_id = v_org;
    insert into public.cred_demo_activity (org_id, kind, detail) select v_org, 'event', unnest(v_due);
  end if;
  return v_due;
end;
$$;
revoke execute on function public.cred_demo_tick(uuid) from public, anon;
grant execute on function public.cred_demo_tick(uuid) to authenticated;
