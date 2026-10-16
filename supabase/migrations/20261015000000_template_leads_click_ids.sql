-- Offline conversions (H110_PEDIDO_DEV_CONVERSIONES_OFFLINE): keep the ad
-- click id a template request arrived with — gclid from Google Ads, msclkid
-- from Microsoft Ads — so scripts/export-offline-conversions.mjs can hand it
-- back to that platform as a "Template lead" conversion. No tag or pixel on
-- the site; the privacy policy says so.
--
-- capture_template_lead gains two optional arguments; the old eight-argument
-- version is dropped so there is one. Called with named arguments, so the
-- code already in production keeps working until the new form ships.

alter table public.template_leads
  add column if not exists gclid text check (gclid ~ '^[A-Za-z0-9_-]{1,200}$'),
  add column if not exists msclkid text check (msclkid ~ '^[A-Za-z0-9_-]{1,200}$');

drop function public.capture_template_lead(text, text, text, text, text, text, text, text);

create or replace function public.capture_template_lead(
  p_email text,
  p_source_path text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_referrer text default null,
  p_utm_term text default null,
  p_utm_content text default null,
  p_gclid text default null,
  p_msclkid text default null
)
returns table (lead_id uuid, unsubscribe_token uuid, should_send boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  -- Anything that isn't a plain click id is dropped, not stored.
  v_gclid text := case when p_gclid ~ '^[A-Za-z0-9_-]{1,200}$' then p_gclid end;
  v_msclkid text := case when p_msclkid ~ '^[A-Za-z0-9_-]{1,200}$' then p_msclkid end;
  v_row public.template_leads;
begin
  if v_email is null or length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'INVALID_EMAIL: that is not an email address';
  end if;

  insert into public.template_leads (email, source_path, utm_source, utm_medium, utm_campaign, referrer, utm_term, utm_content, gclid, msclkid)
  values (
    v_email,
    left(nullif(trim(p_source_path), ''), 300),
    left(nullif(trim(p_utm_source), ''), 200),
    left(nullif(trim(p_utm_medium), ''), 200),
    left(nullif(trim(p_utm_campaign), ''), 200),
    left(nullif(trim(p_referrer), ''), 1000),
    left(nullif(trim(p_utm_term), ''), 200),
    left(nullif(trim(p_utm_content), ''), 200),
    v_gclid,
    v_msclkid
  )
  -- A repeat request keeps the first click id unless it had none.
  on conflict (email) do update set
    unsubscribed_at = null,
    gclid = coalesce(template_leads.gclid, excluded.gclid),
    msclkid = coalesce(template_leads.msclkid, excluded.msclkid)
  returning * into v_row;

  return query select
    v_row.id,
    v_row.unsubscribe_token,
    (v_row.last_sent_at is null or v_row.last_sent_at < now() - interval '10 minutes');
end;
$$;

revoke all on function public.capture_template_lead(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.capture_template_lead(text, text, text, text, text, text, text, text, text, text) to anon, authenticated;
