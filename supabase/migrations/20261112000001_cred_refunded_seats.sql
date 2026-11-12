-- Refunded extra providers (founder decision 2026-11-12: automatic).
--
-- When Juan refunds the charge for Practice extra providers in Polar, the
-- daily job (lib/extra-providers.js reconcileRefundedSeats) finds it, asks
-- Polar to drop those seats at the renewal (so they are never billed again),
-- and sets seat_cap so the limit drops here at once — a refunded provider
-- seat stops being usable the same day, not at the renewal. Once Polar's seats
-- come down to the cap, the cap clears itself. Service role only.

alter table public.cred_organizations
  add column seat_cap integer check (seat_cap is null or seat_cap >= 15);

create or replace function public.cred_apply_plan_limits()
returns trigger
language plpgsql
set search_path to ''
as $function$
begin
  if tg_op = 'UPDATE' and new.current_period_end is distinct from old.current_period_end then
    new.extra_providers_peak := new.extra_providers;
  end if;
  if new.plan <> 'billing_co' then
    new.extra_providers := 0;
    new.extra_providers_peak := case when tg_op = 'UPDATE' then new.extra_providers_peak else 0 end;
  end if;
  new.extra_providers_peak := greatest(new.extra_providers_peak, new.extra_providers);
  if new.plan <> 'practice' or (new.seat_cap is not null and coalesce(new.seats, 15) <= new.seat_cap) then
    new.seat_cap := null;
  end if;

  case new.plan
    when 'solo' then
      new.provider_limit := 3;  new.user_limit := 1;  new.storage_limit_mb := 1024;
    when 'practice' then
      new.provider_limit := least(30, greatest(15, coalesce(new.seats, 15)), coalesce(new.seat_cap, 30));
      new.user_limit := 3;  new.storage_limit_mb := 5120;
    when 'billing_co' then
      new.provider_limit := 50 + new.extra_providers;
      new.user_limit := greatest(10, coalesce(new.seats, 10)); new.storage_limit_mb := 20480;
  end case;
  return new;
end;
$function$;
