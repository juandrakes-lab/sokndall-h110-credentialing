-- Fase 2 — enrollments matrix support.
-- One enrollment row per (provider, payer) pair, and an append-only
-- history of every status change written automatically (spec: "quién,
-- cuándo, de qué a qué").

alter table public.enrollments
  add constraint enrollments_provider_payer_unique unique (provider_id, payer_id);

alter table public.enrollment_events
  add column created_by uuid references auth.users(id);

create or replace function public.log_enrollment_event()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.enrollment_events (enrollment_id, from_status, to_status, created_by)
    values (new.id, null, new.status, auth.uid());
  elsif tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into public.enrollment_events (enrollment_id, from_status, to_status, created_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;

  return new;
end;
$$;

create trigger trg_log_enrollment_event
  after insert or update on public.enrollments
  for each row execute function public.log_enrollment_event();
