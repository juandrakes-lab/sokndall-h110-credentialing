-- Functions for the ICP's pain points (pedido 2026-11-17). Every one is
-- optional: left empty or off, the app behaves exactly as before.
--
--   B1  cred_payers_org.follow_up_every_days — logging a call on that payer's
--       application proposes today + N as the next follow-up (editable).
--   C3  cred_providers.go_live_date and cred_organizations.at_risk_days — an
--       application not yet approved within N days of the provider's start
--       is "At risk".
--   C4  cred_organizations.ready_to_bill_step and, on each application,
--       effective_confirmed + linked_to_group — when the step is on, Approved
--       reads "Approved · not ready to bill" until both are checked.

alter table public.cred_payers_org
  add column follow_up_every_days integer check (follow_up_every_days between 1 and 180);

alter table public.cred_providers
  add column go_live_date date; -- "Scheduled to start"; start_date (joined the practice) already existed

alter table public.cred_organizations
  add column at_risk_days integer not null default 30 check (at_risk_days between 7 and 180),
  add column ready_to_bill_step boolean not null default false;

alter table public.cred_enrollments
  add column effective_confirmed boolean not null default false,
  add column linked_to_group boolean not null default false;

-- The owner sets the two account options (cred_organizations has no update
-- grant for signed-in users; billing keeps it that way).
create or replace function public.cred_set_workflow_options(p_at_risk_days integer, p_ready_to_bill boolean)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_org uuid;
begin
  select m.org_id into v_org from public.cred_org_members m where m.user_id = auth.uid() and m.role = 'owner' limit 1;
  if v_org is null then
    raise exception 'OWNER_ONLY: only the account owner can change this' using errcode = 'P0001';
  end if;
  if p_at_risk_days is null or p_at_risk_days < 7 or p_at_risk_days > 180 then
    raise exception 'BAD_DAYS: choose between 7 and 180 days' using errcode = 'P0001';
  end if;
  update public.cred_organizations
    set at_risk_days = p_at_risk_days, ready_to_bill_step = coalesce(p_ready_to_bill, false)
    where id = v_org;
end;
$function$;

revoke all on function public.cred_set_workflow_options(integer, boolean) from public;
grant execute on function public.cred_set_workflow_options(integer, boolean) to authenticated;
