-- Where each new account came from (utm_*, gclid/msclkid, landing page).
--
-- The organization is created by the Polar webhook, which carries none of the
-- visitor's cookies. So the attribution is recorded one step earlier: when the
-- signed-in person picks a plan (startTrial), the Server Action reads the
-- first-party sk_attr cookie and calls cred_record_signup_attribution(), keyed
-- by auth.uid(). When the webhook then creates the organization, a trigger
-- copies it onto the new row. No change to cred_sync_subscription.

alter table public.cred_organizations
  add column utm_source text,
  add column utm_medium text,
  add column utm_campaign text,
  add column utm_term text,
  add column click_id text,
  add column landing_path text;

create table public.cred_signup_attribution (
  user_id uuid primary key references auth.users (id) on delete cascade,
  utm_source text check (length(utm_source) <= 200),
  utm_medium text check (length(utm_medium) <= 200),
  utm_campaign text check (length(utm_campaign) <= 200),
  utm_term text check (length(utm_term) <= 200),
  click_id text check (length(click_id) <= 300),
  landing_path text check (length(landing_path) <= 300),
  recorded_at timestamptz not null default now()
);

alter table public.cred_signup_attribution enable row level security;
revoke all on public.cred_signup_attribution from anon, authenticated;

-- Latest pick wins: someone who comes back through a second campaign and
-- only then picks a plan is credited to that campaign.
create or replace function public.cred_record_signup_attribution(
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_utm_term text default null,
  p_click_id text default null,
  p_landing_path text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'NOT_SIGNED_IN';
  end if;
  if coalesce(p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_click_id) is null then
    return;
  end if;
  insert into public.cred_signup_attribution
    (user_id, utm_source, utm_medium, utm_campaign, utm_term, click_id, landing_path, recorded_at)
  values (
    auth.uid(),
    left(nullif(trim(p_utm_source), ''), 200),
    left(nullif(trim(p_utm_medium), ''), 200),
    left(nullif(trim(p_utm_campaign), ''), 200),
    left(nullif(trim(p_utm_term), ''), 200),
    left(nullif(trim(p_click_id), ''), 300),
    left(nullif(trim(p_landing_path), ''), 300),
    now()
  )
  on conflict (user_id) do update set
    utm_source = excluded.utm_source,
    utm_medium = excluded.utm_medium,
    utm_campaign = excluded.utm_campaign,
    utm_term = excluded.utm_term,
    click_id = excluded.click_id,
    landing_path = excluded.landing_path,
    recorded_at = excluded.recorded_at;
end;
$$;

revoke all on function public.cred_record_signup_attribution(text, text, text, text, text, text) from public;
grant execute on function public.cred_record_signup_attribution(text, text, text, text, text, text) to authenticated;

-- Copies the owner's attribution onto a new organization. Only on insert:
-- an account's origin is where it started, never rewritten later.
create or replace function public.cred_apply_signup_attribution()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.cred_signup_attribution;
begin
  select * into a from public.cred_signup_attribution where user_id = new.owner_user_id;
  if found then
    new.utm_source := coalesce(new.utm_source, a.utm_source);
    new.utm_medium := coalesce(new.utm_medium, a.utm_medium);
    new.utm_campaign := coalesce(new.utm_campaign, a.utm_campaign);
    new.utm_term := coalesce(new.utm_term, a.utm_term);
    new.click_id := coalesce(new.click_id, a.click_id);
    new.landing_path := coalesce(new.landing_path, a.landing_path);
  end if;
  return new;
end;
$$;

create trigger cred_organizations_signup_attribution
  before insert on public.cred_organizations
  for each row execute function public.cred_apply_signup_attribution();

-- Weekly, by source and campaign: accounts created → trials → paying.
-- "Trial" is an account that reached Polar (every plan starts with the trial);
-- "paid" is one whose subscription is active now. Accounts with no campaign
-- tags show as (direct). SQL editor only, like template_funnel_weekly.
create or replace view public.signup_funnel_weekly
with (security_invoker = true)
as
select
  date_trunc('week', o.created_at)::date as week,
  coalesce(o.utm_source, '(direct)') as utm_source,
  coalesce(o.utm_campaign, '(none)') as utm_campaign,
  count(*) as orgs_created,
  count(*) filter (where o.polar_subscription_id is not null) as trials,
  count(*) filter (where o.subscription_status = 'active') as paid
from public.cred_organizations o
group by 1, 2, 3
order by 1 desc, orgs_created desc;

revoke all on public.signup_funnel_weekly from anon, authenticated;
