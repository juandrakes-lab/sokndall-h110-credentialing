-- 1) The demo's first-session guide (pedido 2026-11-16, demo onboarding).
--    guide_state: null = not shown yet (every demo already created, opened or
--    not, gets it once on its next visit), then step1 → step2 → done, or
--    skipped (never shown again). prev_seen_at: when the previous session
--    ended, for "Since your last visit" — a session starts when the visitor
--    comes back after 2 hours or more.
-- 2) "Stalled" per payer: stalled_after_days on the account's payer; null
--    keeps the default of 30 days.

alter table public.cred_demos
  add column guide_state text check (guide_state in ('step1', 'step2', 'done', 'skipped')),
  add column guide_updated_at timestamptz,
  add column prev_seen_at timestamptz;

alter table public.cred_demo_activity drop constraint cred_demo_activity_kind_check;
alter table public.cred_demo_activity add constraint cred_demo_activity_kind_check
  check (kind in ('open', 'visit', 'blocked', 'step', 'email', 'load_real', 'event', 'guide', 'ask'));

create or replace function public.cred_demo_log(p_kind text, p_detail text default null)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_org uuid;
begin
  select m.org_id into v_org from public.cred_org_members m
    join public.cred_demos d on d.org_id = m.org_id
  where m.user_id = (select auth.uid()) limit 1;
  if v_org is null then return; end if;
  insert into public.cred_demo_activity (org_id, kind, detail) values (v_org, p_kind, left(p_detail, 200));
  update public.cred_demos
    set prev_seen_at = case when last_seen_at < now() - interval '2 hours' then last_seen_at else prev_seen_at end,
        last_seen_at = now()
    where org_id = v_org;
end;
$function$;

-- The visitor moves their own guide forward, or skips it. Never backwards.
create or replace function public.cred_demo_guide(p_state text)
returns text
language plpgsql
security definer
set search_path to ''
as $function$
declare
  d public.cred_demos;
  v_rank constant text[] := array['step1', 'step2', 'done'];
begin
  select x.* into d from public.cred_demos x
    join public.cred_org_members m on m.org_id = x.org_id and m.user_id = (select auth.uid())
  for update of x;
  if d.org_id is null then return null; end if;
  if p_state not in ('step1', 'step2', 'done', 'skipped') then raise exception 'BAD_STATE'; end if;
  if d.guide_state in ('done', 'skipped') then return d.guide_state; end if;
  if p_state <> 'skipped' and d.guide_state is not null
     and array_position(v_rank, p_state) <= array_position(v_rank, d.guide_state) then
    return d.guide_state;
  end if;
  update public.cred_demos set guide_state = p_state, guide_updated_at = now() where org_id = d.org_id;
  insert into public.cred_demo_activity (org_id, kind, detail) values (d.org_id, 'guide', p_state);
  return p_state;
end;
$function$;

revoke all on function public.cred_demo_guide(text) from public;
grant execute on function public.cred_demo_guide(text) to authenticated;

alter table public.cred_payers_org
  add column stalled_after_days integer check (stalled_after_days between 7 and 365);
