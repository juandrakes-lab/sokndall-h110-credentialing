-- Referral partners (minimal version, pedido 2026-11-10).
--
-- A partner has a fixed link, sokndall.com/?ref=<code>, that works on any public
-- page. components/SiteAnalytics keeps the code in a first-party cookie
-- (sk_ref) for 90 days, and the first code a browser sees is the one it keeps.
-- When the signed-in person picks a plan, startTrial records the code (and the
-- optional "Did someone recommend Sokndall?" answer) against the user, exactly
-- like the campaign tags. When the Polar webhook creates the organization, the
-- trigger below stamps the partner onto it, and once set it never changes.
--
-- The free-text answer never assigns a partner. Juan reads it and sets
-- partner_id by hand, from the SQL editor, if it is confirmed.
--
-- The monthly report (lib/referrals.js, cron /api/cron/referrals-report) reads
-- the charges from Polar. Nothing here keeps money amounts.

create table public.cred_partners (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9-]{3,40}$'),
  name text not null,
  email text,
  percent numeric(5,2) not null check (percent > 0 and percent <= 100),
  months integer not null check (months > 0),
  -- The partner's own Sokndall account: its owner and members never earn
  -- commission for themselves.
  own_org_id uuid references public.cred_organizations (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.cred_partners enable row level security;
revoke all on public.cred_partners from anon, authenticated;

-- What Juan has paid each partner (cash, or taken off the partner's own
-- invoice). The report subtracts it from what was earned to show the balance.
create table public.cred_partner_payouts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.cred_partners (id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  paid_on date not null default current_date,
  method text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.cred_partner_payouts enable row level security;
revoke all on public.cred_partner_payouts from anon, authenticated;

alter table public.cred_signup_attribution
  add column ref_code text check (length(ref_code) <= 40),
  add column referral_note text check (length(referral_note) <= 300);

alter table public.cred_organizations
  add column partner_id uuid references public.cred_partners (id) on delete set null,
  add column referral_note text,
  add column referred_at timestamptz;

-- Records the referral code and the free-text answer against the signed-in
-- user. The first code wins: a later link never replaces an earlier one. A
-- later answer replaces an earlier one (it is only a note).
create or replace function public.cred_record_signup_referral(
  p_ref_code text default null,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := left(nullif(lower(trim(p_ref_code)), ''), 40);
  v_note text := left(nullif(trim(p_note), ''), 300);
begin
  if auth.uid() is null then
    raise exception 'NOT_SIGNED_IN';
  end if;
  if v_code is null and v_note is null then
    return;
  end if;
  insert into public.cred_signup_attribution (user_id, ref_code, referral_note, recorded_at)
  values (auth.uid(), v_code, v_note, now())
  on conflict (user_id) do update set
    ref_code = coalesce(cred_signup_attribution.ref_code, excluded.ref_code),
    referral_note = coalesce(excluded.referral_note, cred_signup_attribution.referral_note);
end;
$$;

revoke all on function public.cred_record_signup_referral(text, text) from public;
grant execute on function public.cred_record_signup_referral(text, text) to authenticated;

-- On a new organization: the campaign tags (as before) plus the partner.
create or replace function public.cred_apply_signup_attribution()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.cred_signup_attribution;
  p public.cred_partners;
  v_email text;
begin
  select * into a from public.cred_signup_attribution where user_id = new.owner_user_id;
  if found then
    new.utm_source := coalesce(new.utm_source, a.utm_source);
    new.utm_medium := coalesce(new.utm_medium, a.utm_medium);
    new.utm_campaign := coalesce(new.utm_campaign, a.utm_campaign);
    new.utm_term := coalesce(new.utm_term, a.utm_term);
    new.click_id := coalesce(new.click_id, a.click_id);
    new.landing_path := coalesce(new.landing_path, a.landing_path);
    new.referral_note := coalesce(new.referral_note, a.referral_note);

    if new.partner_id is null and a.ref_code is not null then
      select * into p from public.cred_partners where code = a.ref_code;
      if found then
        select lower(email) into v_email from auth.users where id = new.owner_user_id;
        -- Never the partner's own login, nor anyone in the partner's own account.
        if (p.email is null or lower(p.email) is distinct from v_email)
           and not exists (
             select 1 from public.cred_org_members m
             where m.org_id = p.own_org_id and m.user_id = new.owner_user_id
           )
           and (p.own_org_id is null or not exists (
             select 1 from public.cred_organizations o
             where o.id = p.own_org_id and o.owner_user_id = new.owner_user_id
           )) then
          new.partner_id := p.id;
          new.referred_at := now();
        end if;
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- Once an organization has a partner, it keeps it (the first one wins).
-- Juan can still set one by hand where there is none (a confirmed
-- recommendation by word of mouth). A signed-in user can never touch any of
-- the three referral columns, whatever the table's update policy allows.
create or replace function public.cred_keep_partner()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') then
    new.partner_id := old.partner_id;
    new.referred_at := old.referred_at;
    new.referral_note := old.referral_note;
  elsif old.partner_id is not null and new.partner_id is distinct from old.partner_id then
    new.partner_id := old.partner_id;
    new.referred_at := old.referred_at;
  elsif old.partner_id is null and new.partner_id is not null and new.referred_at is null then
    new.referred_at := now();
  end if;
  return new;
end;
$$;

create trigger cred_organizations_keep_partner
  before update of partner_id, referred_at, referral_note on public.cred_organizations
  for each row execute function public.cred_keep_partner();

-- Demo accounts are not sign-ups (pendiente 4 of the 2026-11-09 handoff).
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
where not exists (select 1 from public.cred_demos d where d.org_id = o.id)
group by 1, 2, 3
order by 1 desc, orgs_created desc;

revoke all on public.signup_funnel_weekly from anon, authenticated;

-- The first partner (acuerdo 2026-11-03): 20% for 6 months per referred account.
insert into public.cred_partners (code, name, email, percent, months, own_org_id)
values ('waseemrcm', 'Shehzad Waseem (WaseemRCM)', 'alquraacademy047@gmail.com', 20, 6, '57938995-cef8-4014-8941-fa2d68709516');
