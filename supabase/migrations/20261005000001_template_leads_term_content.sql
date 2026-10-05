-- P1 (H110_CONVERSION_PEDIDO_DEV_1): keep the ad keyword (utm_term) and
-- utm_content with each template request, like the other UTM tags. The
-- privacy policy lists all five. capture_template_lead gains two optional
-- arguments; the old six-argument version is dropped so there is one.

alter table public.template_leads
  add column utm_term text check (length(utm_term) <= 200),
  add column utm_content text check (length(utm_content) <= 200);

drop function public.capture_template_lead(text, text, text, text, text, text);

create or replace function public.capture_template_lead(
  p_email text,
  p_source_path text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_referrer text default null,
  p_utm_term text default null,
  p_utm_content text default null
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

  insert into public.template_leads (email, source_path, utm_source, utm_medium, utm_campaign, referrer, utm_term, utm_content)
  values (
    v_email,
    left(nullif(trim(p_source_path), ''), 300),
    left(nullif(trim(p_utm_source), ''), 200),
    left(nullif(trim(p_utm_medium), ''), 200),
    left(nullif(trim(p_utm_campaign), ''), 200),
    left(nullif(trim(p_referrer), ''), 1000),
    left(nullif(trim(p_utm_term), ''), 200),
    left(nullif(trim(p_utm_content), ''), 200)
  )
  on conflict (email) do update set unsubscribed_at = null
  returning * into v_row;

  return query select
    v_row.id,
    v_row.unsubscribe_token,
    (v_row.last_sent_at is null or v_row.last_sent_at < now() - interval '10 minutes');
end;
$$;

revoke all on function public.capture_template_lead(text, text, text, text, text, text, text, text) from public;
grant execute on function public.capture_template_lead(text, text, text, text, text, text, text, text) to anon, authenticated;
