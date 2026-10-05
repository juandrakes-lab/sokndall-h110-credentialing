-- Aggregate click counter for the pricing links in the template follow-up
-- emails (H110_CONVERSION_PEDIDO_DEV_1, D3). Vercel Web Analytics on this plan
-- can't split by UTM, so the links go through /r/<step>, which bumps a daily
-- count and redirects to /pricing with the UTM tags intact.
--
-- Nothing per person: no IP, no email, no lead id, no user agent. Only the
-- day, the step and how many times. RLS on and no policies; the anon key
-- reaches it only through count_nurture_click(), which accepts a whitelist of
-- steps — the same pattern as template_leads.

create table public.nurture_clicks (
  day date not null,
  step text not null,
  clicks int not null default 0,
  primary key (day, step)
);

alter table public.nurture_clicks enable row level security;
revoke all on public.nurture_clicks from anon, authenticated;

create or replace function public.count_nurture_click(p_step text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Steps whose emails link through /r/. Add a step here when its email does.
  if p_step is null or p_step not in ('e3', 'e3b') then
    return;
  end if;
  insert into public.nurture_clicks (day, step, clicks)
  values (current_date, p_step, 1)
  on conflict (day, step) do update set clicks = public.nurture_clicks.clicks + 1;
end;
$$;

revoke all on function public.count_nurture_click(text) from public;
grant execute on function public.count_nurture_click(text) to anon, authenticated;
