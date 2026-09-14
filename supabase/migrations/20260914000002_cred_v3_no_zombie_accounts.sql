-- Deleting an account revokes its Polar subscription, and Polar then sends
-- subscription.revoked (and may deliver older events late). With no
-- organization left to match, cred_sync_subscription created a new one — a
-- "zombie" account for a user who had just deleted theirs.
--
-- 1. Deleting an organization records its subscription as ended for good.
-- 2. cred_sync_subscription never creates an organization for an ended
--    subscription, nor from an event that isn't a live one (trialing/active).

create table if not exists public.cred_ended_subscriptions (
  subscription_id text primary key,
  ended_at timestamptz not null default now()
);
alter table public.cred_ended_subscriptions enable row level security;
-- No policies: only security-definer functions touch it.

create or replace function public.cred_delete_organization()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org uuid;
  v_sub text;
begin
  select m.org_id into v_org from public.cred_org_members m
  where m.user_id = (select auth.uid()) and m.role = 'owner';
  if v_org is null then
    raise exception 'OWNER_ONLY' using errcode = 'P0001';
  end if;
  select polar_subscription_id into v_sub from public.cred_organizations where id = v_org;
  if v_sub is not null then
    insert into public.cred_ended_subscriptions (subscription_id) values (v_sub) on conflict do nothing;
  end if;
  delete from public.cred_organizations where id = v_org;
end;
$$;

create or replace function public.cred_sync_subscription(p_user_id uuid, p_account_name text, p_customer_id text, p_subscription_id text, p_plan text, p_status text, p_trial_ends_at timestamp with time zone, p_current_period_end timestamp with time zone, p_cancel_at_period_end boolean, p_modified_at timestamp with time zone)
returns uuid
language plpgsql
security definer
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
    -- Only a live subscription opens an account; the end of one, or any event
    -- for a subscription whose account was deleted, changes nothing.
    if p_status not in ('trialing', 'active')
       or exists (select 1 from public.cred_ended_subscriptions where subscription_id = p_subscription_id) then
      return null;
    end if;
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
    -- Webhooks can arrive out of order: an older state never overwrites a newer one.
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
