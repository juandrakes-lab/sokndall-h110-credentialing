-- H110 v3 — Fase 5 follow-up: Polar webhooks can arrive out of order, so the
-- sync remembers the subscription's modified_at and never lets an older state
-- overwrite a newer one (a late "updated" must not revive a revoked account).

alter table public.cred_organizations add column polar_synced_at timestamptz;

drop function public.cred_sync_subscription(uuid, text, text, text, text, text, timestamptz, timestamptz, boolean);

create or replace function public.cred_sync_subscription(
  p_user_id uuid,
  p_account_name text,
  p_customer_id text,
  p_subscription_id text,
  p_plan text,
  p_status text,
  p_trial_ends_at timestamptz,
  p_current_period_end timestamptz,
  p_cancel_at_period_end boolean,
  p_modified_at timestamptz
)
returns uuid
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_org uuid;
  v_synced timestamptz;
begin
  if p_plan not in ('solo', 'practice', 'billing_co') then
    raise exception 'UNKNOWN_PLAN: %', p_plan;
  end if;

  select id, polar_synced_at into v_org, v_synced
  from public.cred_organizations where polar_subscription_id = p_subscription_id;
  if v_org is null then
    select id, polar_synced_at into v_org, v_synced
    from public.cred_organizations where owner_user_id = p_user_id;
  end if;

  if v_org is null then
    if not exists (select 1 from auth.users where id = p_user_id) then
      raise exception 'UNKNOWN_USER: %', p_user_id;
    end if;
    if exists (select 1 from public.cred_org_members where user_id = p_user_id) then
      raise exception 'ALREADY_MEMBER: user % belongs to another organization', p_user_id;
    end if;

    insert into public.cred_organizations (
      name, owner_user_id, plan, subscription_status, polar_customer_id, polar_subscription_id,
      trial_ends_at, current_period_end, cancel_at_period_end, polar_synced_at
    ) values (
      coalesce(nullif(trim(p_account_name), ''), 'My practice'), p_user_id, p_plan, p_status,
      p_customer_id, p_subscription_id, p_trial_ends_at, p_current_period_end,
      coalesce(p_cancel_at_period_end, false), p_modified_at
    ) returning id into v_org;

    insert into public.cred_org_members (org_id, user_id, role) values (v_org, p_user_id, 'owner');
    insert into public.cred_client_orgs (org_id, name)
      values (v_org, coalesce(nullif(trim(p_account_name), ''), 'My practice'));
  elsif v_synced is null or p_modified_at is null or p_modified_at >= v_synced then
    update public.cred_organizations set
      plan = p_plan,
      subscription_status = p_status,
      polar_customer_id = coalesce(p_customer_id, polar_customer_id),
      polar_subscription_id = p_subscription_id,
      trial_ends_at = p_trial_ends_at,
      current_period_end = p_current_period_end,
      cancel_at_period_end = coalesce(p_cancel_at_period_end, false),
      polar_synced_at = coalesce(p_modified_at, polar_synced_at)
    where id = v_org;
  end if;

  return v_org;
end;
$$;

revoke execute on function public.cred_sync_subscription(uuid, text, text, text, text, text, timestamptz, timestamptz, boolean, timestamptz)
  from public, anon, authenticated;
grant execute on function public.cred_sync_subscription(uuid, text, text, text, text, text, timestamptz, timestamptz, boolean, timestamptz)
  to service_role;
