-- A card-free trial, granted by hand to one account at a time (founder decision
-- 2026-11-04). The account exists before any Polar subscription: it is created
-- by cred_start_cardless_trial, which nobody but the service role can run — no
-- screen offers it. It is "trialing" with a trial end and no subscription id.
--
--   until trial_ends_at   writable, like any trial
--   after trial_ends_at   read-only (view and export), nothing deleted
--   card added            the usual resubscribe checkout; the webhook links the
--                         subscription to this account by owner, and from then
--                         on it is an ordinary subscribed account
--
-- No other account is affected: every subscribed account has a subscription id,
-- and accounts without one and without a trial end keep today's behaviour.

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
  );
$$;

create or replace function public.cred_start_cardless_trial(p_email text, p_plan text default 'billing_co', p_days integer default 7)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid;
  v_name text;
  v_org uuid;
begin
  if p_plan not in ('solo', 'practice', 'billing_co') then
    raise exception 'UNKNOWN_PLAN: %', p_plan;
  end if;
  if p_days not between 1 and 14 then
    raise exception 'BAD_DAYS: %', p_days;
  end if;

  select id, coalesce(
           nullif(trim(raw_user_meta_data->>'full_name'), ''),
           nullif(trim(concat_ws(' ', raw_user_meta_data->>'first_name', raw_user_meta_data->>'last_name')), ''),
           split_part(email, '@', 1))
    into v_user, v_name
  from auth.users where lower(email) = lower(trim(p_email));
  if v_user is null then
    raise exception 'UNKNOWN_EMAIL: %', p_email;
  end if;
  if exists (select 1 from public.cred_org_members where user_id = v_user) then
    raise exception 'ALREADY_MEMBER: % already belongs to an account', p_email;
  end if;

  insert into public.cred_organizations (
    name, owner_user_id, plan, seats, subscription_status, trial_ends_at, cancel_at_period_end
  ) values (
    v_name, v_user, p_plan, case when p_plan = 'billing_co' then 10 end, 'trialing',
    now() + make_interval(days => p_days), false
  ) returning id into v_org;

  insert into public.cred_org_members (org_id, user_id, role) values (v_org, v_user, 'owner');
  insert into public.cred_client_orgs (org_id, name) values (v_org, v_name);
  return v_org;
end;
$$;

revoke execute on function public.cred_start_cardless_trial(text, text, integer) from public, anon, authenticated;
