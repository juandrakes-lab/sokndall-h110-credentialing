-- The weekly follow-up emails (e5 onwards, H110 conversion round 2) link
-- through /r/<step> too. Same function, longer whitelist; e9 and e10 are
-- listed ahead of their copy so adding them needs no migration.
create or replace function public.count_nurture_click(p_step text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_step is null or p_step not in ('e3', 'e3b', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10') then
    return;
  end if;
  insert into public.nurture_clicks (day, step, clicks)
  values (current_date, p_step, 1)
  on conflict (day, step) do update set clicks = public.nurture_clicks.clicks + 1;
end;
$$;

revoke all on function public.count_nurture_click(text) from public;
grant execute on function public.count_nurture_click(text) to anon, authenticated;
