-- Free credentialing template: the email form on the marketing pages.
--
-- Only an email address is stored (no PHI, no name), plus where the request
-- came from so the SEO work can be judged. The table has RLS on and no
-- policies at all: nobody reads or writes it through the API. Writes go
-- through the security definer functions below, called by the form's Server
-- Action with the anon key — the same pattern as create_organization().
-- Reading is for the SQL editor (and the template_funnel_weekly view).

create table public.template_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and length(email) <= 254),
  source_path text check (length(source_path) <= 300),
  utm_source text check (length(utm_source) <= 200),
  utm_medium text check (length(utm_medium) <= 200),
  utm_campaign text check (length(utm_campaign) <= 200),
  referrer text check (length(referrer) <= 1000),
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  -- last time the template was emailed; a re-request inside 10 minutes does
  -- not send again, so the form can't be used to flood someone's inbox
  last_sent_at timestamptz,
  unsubscribed_at timestamptz,
  unsubscribe_token uuid not null unique default gen_random_uuid()
);

alter table public.template_leads enable row level security;
revoke all on public.template_leads from anon, authenticated;

-- Records a request and says whether to send. First touch wins: a repeat
-- request keeps the original source and UTM, but it is still sent the
-- template (and asking again after unsubscribing is asking again, so it
-- clears the unsubscribe).
create or replace function public.capture_template_lead(
  p_email text,
  p_source_path text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_referrer text default null
)
returns table (lead_id uuid, unsubscribe_token uuid, should_send boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_row public.template_leads;
begin
  if v_email is null or length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'INVALID_EMAIL: that is not an email address';
  end if;

  insert into public.template_leads (email, source_path, utm_source, utm_medium, utm_campaign, referrer)
  values (
    v_email,
    left(nullif(trim(p_source_path), ''), 300),
    left(nullif(trim(p_utm_source), ''), 200),
    left(nullif(trim(p_utm_medium), ''), 200),
    left(nullif(trim(p_utm_campaign), ''), 200),
    left(nullif(trim(p_referrer), ''), 1000)
  )
  on conflict (email) do update set unsubscribed_at = null
  returning * into v_row;

  return query select
    v_row.id,
    v_row.unsubscribe_token,
    (v_row.last_sent_at is null or v_row.last_sent_at < now() - interval '10 minutes');
end;
$$;

-- Called after Resend accepted the email. The token proves the caller is the
-- request that just captured this lead.
create or replace function public.mark_template_lead_delivered(p_lead_id uuid, p_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.template_leads
     set delivered_at = coalesce(delivered_at, now()),
         last_sent_at = now()
   where id = p_lead_id and unsubscribe_token = p_token;
$$;

-- The unsubscribe link. True when the token matched a lead.
create or replace function public.unsubscribe_template_lead(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.template_leads
     set unsubscribed_at = coalesce(unsubscribed_at, now())
   where unsubscribe_token = p_token;
  return found;
end;
$$;

revoke all on function public.capture_template_lead(text, text, text, text, text, text) from public;
revoke all on function public.mark_template_lead_delivered(uuid, uuid) from public;
revoke all on function public.unsubscribe_template_lead(uuid) from public;
grant execute on function public.capture_template_lead(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.mark_template_lead_delivered(uuid, uuid) to anon, authenticated;
grant execute on function public.unsubscribe_template_lead(uuid) to anon, authenticated;

-- Weekly funnel, for the SEO playbook's questions without GA4: leads by page
-- and source → accounts created by the same email → trials started → paying.
-- A lead converts when an account owner signed up with that address (any
-- time after the lead). "Trial" is an account that reached Polar at all
-- (every plan starts with the 14-day trial); "paid" is one whose subscription
-- is active now, i.e. past its trial and charged.
-- Not exposed to the API: read it from the SQL editor.
create or replace view public.template_funnel_weekly
with (security_invoker = true)
as
select
  date_trunc('week', l.created_at)::date as week,
  coalesce(l.source_path, '(unknown)') as source_path,
  coalesce(l.utm_source, '(none)') as utm_source,
  count(*) as leads,
  count(*) filter (where l.delivered_at is not null) as delivered,
  count(o.id) as orgs_created,
  count(o.id) filter (where o.polar_subscription_id is not null) as trials,
  count(o.id) filter (where o.subscription_status = 'active') as paid
from public.template_leads l
left join auth.users u on lower(u.email) = l.email and u.created_at >= l.created_at
left join public.cred_organizations o on o.owner_user_id = u.id
group by 1, 2, 3
order by 1 desc, leads desc;

revoke all on public.template_funnel_weekly from anon, authenticated;
