-- Extra providers (founder decision 2026-11-11, stage 2).
--
--   Practice    the Polar subscription's seats ARE the provider capacity:
--               15 included, up to 30 in all, $25 each beyond 15. Raised in
--               Polar (prorated charge at once), lowered at renewal; the
--               webhook brings seats here and the limit follows.
--   Billing Co  seats stay the users ($39 beyond 10). Extra providers are a
--               number the owner sets here (cred_set_extra_providers); Polar
--               bills $15 each on the next invoice at the highest number the
--               account had in the period (a "max" meter, fed by the app).
--               extra_providers_peak mirrors that maximum for the screen.

alter table public.cred_organizations
  add column extra_providers integer not null default 0 check (extra_providers >= 0),
  add column extra_providers_peak integer not null default 0 check (extra_providers_peak >= 0);

create or replace function public.cred_apply_plan_limits()
returns trigger
language plpgsql
set search_path to ''
as $function$
begin
  -- A new billing period starts the month's peak again from what is set now.
  if tg_op = 'UPDATE' and new.current_period_end is distinct from old.current_period_end then
    new.extra_providers_peak := new.extra_providers;
  end if;
  if new.plan <> 'billing_co' then
    new.extra_providers := 0;
    new.extra_providers_peak := case when tg_op = 'UPDATE' then new.extra_providers_peak else 0 end;
  end if;
  new.extra_providers_peak := greatest(new.extra_providers_peak, new.extra_providers);

  case new.plan
    when 'solo' then
      new.provider_limit := 3;  new.user_limit := 1;  new.storage_limit_mb := 1024;
    when 'practice' then
      new.provider_limit := least(30, greatest(15, coalesce(new.seats, 15)));
      new.user_limit := 3;  new.storage_limit_mb := 5120;
    when 'billing_co' then
      new.provider_limit := 50 + new.extra_providers;
      new.user_limit := greatest(10, coalesce(new.seats, 10)); new.storage_limit_mb := 20480;
  end case;
  return new;
end;
$function$;

-- The owner of a Billing Co account sets how many extra providers it pays
-- for. Never below what is in use (no provider is ever turned read-only by
-- this), and the month's peak only goes up until the next period.
create or replace function public.cred_set_extra_providers(p_count integer)
returns integer
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_org public.cred_organizations;
  v_used integer;
begin
  select o.* into v_org from public.cred_organizations o
  join public.cred_org_members m on m.org_id = o.id and m.user_id = auth.uid() and m.role = 'owner'
  for update of o;
  if v_org.id is null then
    raise exception 'OWNER_ONLY: only the account owner can change extra providers' using errcode = 'P0001';
  end if;
  if v_org.plan <> 'billing_co' then
    raise exception 'BILLING_CO_ONLY: extra providers at $15 are part of Billing Co' using errcode = 'P0001';
  end if;
  if p_count is null or p_count < 0 or p_count > 1000 then
    raise exception 'BAD_COUNT: choose between 0 and 1000 extra providers' using errcode = 'P0001';
  end if;
  select provider_count into v_used from public.cred_provider_usage(v_org.id);
  if 50 + p_count < coalesce(v_used, 0) then
    raise exception 'IN_USE: % providers are active; mark some inactive before lowering', v_used using errcode = 'P0001';
  end if;
  update public.cred_organizations set extra_providers = p_count where id = v_org.id;
  return p_count;
end;
$function$;

revoke all on function public.cred_set_extra_providers(integer) from public;
grant execute on function public.cred_set_extra_providers(integer) to authenticated;
