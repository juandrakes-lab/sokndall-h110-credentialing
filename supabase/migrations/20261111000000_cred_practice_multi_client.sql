-- Practice holds several clients (founder decision 2026-11-11). Only Solo stays
-- single-practice. Practice and Billing Co differ only in capacity; the
-- provider limit already counts every client of the account.

create or replace function public.cred_enforce_single_client()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_plan text;
begin
  select plan into v_plan from public.cred_organizations where id = new.org_id for update;

  if v_plan = 'solo' and exists (
    select 1 from public.cred_client_orgs where org_id = new.org_id
  ) then
    raise exception 'SINGLE_PRACTICE_PLAN: Solo holds one practice; Practice and Billing Co hold several'
      using errcode = 'P0001';
  end if;

  return new;
end;
$function$;

create or replace function public.cred_check_client_subset(p_org_id uuid, p_client_ids uuid[])
returns void
language plpgsql
stable security definer
set search_path to ''
as $function$
begin
  if p_client_ids is null then
    return;
  end if;
  if (select plan from public.cred_organizations where id = p_org_id) = 'solo' then
    raise exception 'MULTI_CLIENT_ONLY: limiting people to some clients is part of Practice and Billing Co' using errcode = 'P0001';
  end if;
  if coalesce(array_length(p_client_ids, 1), 0) = 0 then
    raise exception 'NO_CLIENTS: choose at least one client, or all of them' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from unnest(p_client_ids) as x(id)
    where not exists (
      select 1 from public.cred_client_orgs c
      where c.id = x.id and c.org_id = p_org_id and c.archived_at is null
    )
  ) then
    raise exception 'UNKNOWN_CLIENT: a chosen client is not an active client of this account' using errcode = 'P0001';
  end if;
end;
$function$;

-- The account takes the name of its first practice (Solo, and a Practice
-- account's first client); a second client never renames it.
create or replace function public.cred_practices_sync_names()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
begin
  update public.cred_client_orgs set name = new.legal_name where id = new.client_org_id;
  if tg_op = 'INSERT' then
    update public.cred_organizations o set name = new.legal_name
    where o.id = new.org_id and o.plan <> 'billing_co'
      and not exists (select 1 from public.cred_practices p where p.org_id = new.org_id and p.id <> new.id);
  end if;
  return new;
end;
$function$;
