-- Founder decisions of 2026-09-14, closing Billing Co before launch.
--
-- 1. Extra users on Billing Co: $39/user/month beyond the 10 included, billed
--    on the same Polar subscription as a graduated seat price (seats 1–10 at
--    $0, 11+ at $39, on top of the $699 fixed price). `seats` mirrors Polar;
--    Billing Co's user limit is max(10, seats). Solo and Practice keep their
--    hard limits.
-- 2. Clients can be archived (out of the selector and the panel, off the
--    provider and storage counts, unreachable for members, restorable) and,
--    once archived, deleted for good — leaving only a minimal account-level
--    record of the deletion.

-- --- 1. Seats -----------------------------------------------------------------

alter table public.cred_organizations add column if not exists seats integer;

create or replace function public.cred_apply_plan_limits()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  case new.plan
    when 'solo' then
      new.provider_limit := 3;  new.user_limit := 1;  new.storage_limit_mb := 1024;
    when 'practice' then
      new.provider_limit := 15; new.user_limit := 3;  new.storage_limit_mb := 5120;
    when 'billing_co' then
      new.provider_limit := 50; new.user_limit := greatest(10, coalesce(new.seats, 10)); new.storage_limit_mb := 20480;
  end case;
  return new;
end;
$$;

drop function if exists public.cred_sync_subscription(uuid, text, text, text, text, text, timestamptz, timestamptz, boolean, timestamptz);
create function public.cred_sync_subscription(
  p_user_id uuid, p_account_name text, p_customer_id text, p_subscription_id text, p_plan text, p_status text,
  p_trial_ends_at timestamptz, p_current_period_end timestamptz, p_cancel_at_period_end boolean,
  p_modified_at timestamptz, p_seats integer default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org uuid;
  v_synced timestamptz;
begin
  if p_plan not in ('solo', 'practice', 'billing_co') then
    raise exception 'UNKNOWN_PLAN: %', p_plan;
  end if;

  select id, polar_synced_at into v_org, v_synced
  from public.cred_organizations where polar_subscription_id = p_subscription_id;
  if v_org is null then
    select id, polar_synced_at into v_org, v_synced
    from public.cred_organizations where owner_user_id = p_user_id;
  end if;

  if v_org is null then
    -- Only a live subscription opens an account; the end of one, or any event
    -- for a subscription whose account was deleted, changes nothing.
    if p_status not in ('trialing', 'active')
       or exists (select 1 from public.cred_ended_subscriptions where subscription_id = p_subscription_id) then
      return null;
    end if;
    if not exists (select 1 from auth.users where id = p_user_id) then
      raise exception 'UNKNOWN_USER: %', p_user_id;
    end if;
    if exists (select 1 from public.cred_org_members where user_id = p_user_id) then
      raise exception 'ALREADY_MEMBER: user % belongs to another organization', p_user_id;
    end if;

    insert into public.cred_organizations (
      name, owner_user_id, plan, seats, subscription_status, polar_customer_id, polar_subscription_id,
      trial_ends_at, current_period_end, cancel_at_period_end, polar_synced_at
    ) values (
      coalesce(nullif(trim(p_account_name), ''), 'My practice'), p_user_id, p_plan, p_seats, p_status,
      p_customer_id, p_subscription_id, p_trial_ends_at, p_current_period_end,
      coalesce(p_cancel_at_period_end, false), p_modified_at
    ) returning id into v_org;

    insert into public.cred_org_members (org_id, user_id, role) values (v_org, p_user_id, 'owner');
    insert into public.cred_client_orgs (org_id, name)
      values (v_org, coalesce(nullif(trim(p_account_name), ''), 'My practice'));
  elsif v_synced is null or p_modified_at is null or p_modified_at >= v_synced then
    -- Webhooks can arrive out of order: an older state never overwrites a newer one.
    update public.cred_organizations set
      plan = p_plan,
      seats = p_seats,
      subscription_status = p_status,
      polar_customer_id = coalesce(p_customer_id, polar_customer_id),
      polar_subscription_id = p_subscription_id,
      trial_ends_at = p_trial_ends_at,
      current_period_end = p_current_period_end,
      cancel_at_period_end = coalesce(p_cancel_at_period_end, false),
      polar_synced_at = coalesce(p_modified_at, polar_synced_at)
    where id = v_org;
  end if;

  return v_org;
end;
$$;
revoke execute on function public.cred_sync_subscription(uuid, text, text, text, text, text, timestamptz, timestamptz, boolean, timestamptz, integer) from public, anon, authenticated;

-- --- 2. Archived clients --------------------------------------------------------

alter table public.cred_client_orgs
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by uuid references auth.users (id) on delete set null;

-- Working access: an archived client is out of reach for everyone, owner
-- included — nothing in it can be written, and no everyday screen shows it.
create or replace function public.cred_can_access_client(p_client_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cred_client_orgs c
    join public.cred_org_members m on m.org_id = c.org_id
    where c.id = p_client_org_id
      and c.archived_at is null
      and m.user_id = (select auth.uid())
      and (m.role = 'owner' or m.client_ids is null or c.id = any (m.client_ids))
  );
$$;

create or replace function public.cred_user_can_access_client(p_user_id uuid, p_client_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cred_client_orgs c
    join public.cred_org_members m on m.org_id = c.org_id
    where c.id = p_client_org_id
      and c.archived_at is null
      and m.user_id = p_user_id
      and (m.role = 'owner' or m.client_ids is null or c.id = any (m.client_ids))
  );
$$;

-- The owner of the account, for any of its clients, archived or not.
create or replace function public.cred_owns_client(p_client_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cred_client_orgs c
    where c.id = p_client_org_id and public.cred_is_org_owner(c.org_id)
  );
$$;
grant execute on function public.cred_owns_client(uuid) to authenticated;

-- Reads: the usual rule, narrowed to the active client — plus, for the owner
-- only, an archived client named explicitly as the active one (its export).
-- A query that names no client never returns archived data.
do $$
declare
  t text;
begin
  foreach t in array array['cred_practices', 'cred_providers', 'cred_credentials', 'cred_enrollments',
                           'cred_enrollment_events', 'cred_communications', 'cred_documents'] loop
    execute format('drop policy if exists %I on public.%I', t || '_select', t);
    execute format(
      'create policy %I on public.%I for select to authenticated
         using (
           (public.cred_can_access_client(client_org_id) and public.cred_in_active_client(client_org_id))
           or (public.cred_active_client() = client_org_id and public.cred_owns_client(client_org_id))
         )',
      t || '_select', t);
  end loop;
end;
$$;

-- Storage paths name their client explicitly, so the owner may read and
-- remove an archived client's files (export, then deletion); nobody may add.
create or replace function public.cred_storage_can_access(p_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_parts text[] := string_to_array(p_name, '/');
  v_org uuid;
  v_client uuid;
  v_provider uuid;
begin
  if coalesce(array_length(v_parts, 1), 0) <> 4 or v_parts[4] = '' then
    return false;
  end if;
  begin
    v_org := v_parts[1]::uuid;
    v_client := v_parts[2]::uuid;
    v_provider := v_parts[3]::uuid;
  exception when invalid_text_representation then
    return false;
  end;

  return exists (
    select 1 from public.cred_providers p
    where p.id = v_provider and p.client_org_id = v_client and p.org_id = v_org
  ) and (public.cred_can_access_client(v_client) or public.cred_owns_client(v_client));
end;
$$;

-- Providers of archived clients neither count against the limit nor can be
-- written; the order that decides who is over the limit skips them too.
create or replace function public.cred_provider_writable(p_provider_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cred_providers p
    join public.cred_organizations o on o.id = p.org_id
    join public.cred_client_orgs c on c.id = p.client_org_id
    where p.id = p_provider_id
      and c.archived_at is null
      and public.cred_org_writable(o.id)
      and (
        select count(*) from public.cred_providers p2
        join public.cred_client_orgs c2 on c2.id = p2.client_org_id
        where p2.org_id = p.org_id and c2.archived_at is null
          and (p2.created_at, p2.id) < (p.created_at, p.id)
      ) < o.provider_limit
  );
$$;

create or replace function public.cred_provider_usage(p_org_id uuid)
returns table (provider_count integer, over_limit_ids uuid[])
language sql
stable
security definer
set search_path = ''
as $$
  with ranked as (
    select p.id, row_number() over (order by p.created_at, p.id) as n
    from public.cred_providers p
    join public.cred_client_orgs c on c.id = p.client_org_id
    where p.org_id = p_org_id and c.archived_at is null
  )
  select
    (select count(*)::integer from ranked),
    coalesce(
      (select array_agg(r.id) from ranked r
       where r.n > (select o.provider_limit from public.cred_organizations o where o.id = p_org_id)),
      '{}'::uuid[]
    )
  where public.cred_is_org_member(p_org_id);
$$;

create or replace function public.cred_providers_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit integer;
  v_count integer;
begin
  select p.client_org_id, p.org_id into new.client_org_id, new.org_id
  from public.cred_practices p where p.id = new.practice_id;

  if tg_op = 'INSERT' then
    select o.provider_limit into v_limit
    from public.cred_organizations o where o.id = new.org_id for update;

    select count(*) into v_count
    from public.cred_providers p
    join public.cred_client_orgs c on c.id = p.client_org_id
    where p.org_id = new.org_id and c.archived_at is null;

    if v_count >= v_limit then
      raise exception 'PROVIDER_LIMIT_REACHED: this plan allows % providers', v_limit
        using errcode = 'P0001';
    end if;
  else
    new.updated_at := now();
  end if;

  return new;
end;
$$;

-- Archived clients' files don't count against the storage quota.
create or replace function public.cred_storage_used_bytes(p_org_id uuid)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select case when public.cred_is_org_member(p_org_id) then (
    select coalesce(sum((o.metadata->>'size')::bigint), 0)
    from storage.objects o
    where o.bucket_id = 'cred-documents'
      and o.name like p_org_id::text || '/%'
      and not exists (
        select 1 from public.cred_client_orgs c
        where c.org_id = p_org_id and c.archived_at is not null
          and o.name like p_org_id::text || '/' || c.id::text || '/%'
      )
  ) end;
$$;

-- Subsets of clients only ever name live clients of this account.
create or replace function public.cred_check_client_subset(p_org_id uuid, p_client_ids uuid[])
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_client_ids is null then
    return;
  end if;
  if (select plan from public.cred_organizations where id = p_org_id) <> 'billing_co' then
    raise exception 'BILLING_CO_ONLY: limiting people to some clients is part of Billing Co' using errcode = 'P0001';
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
$$;
revoke execute on function public.cred_check_client_subset(uuid, uuid[]) from public, anon, authenticated;

-- Owner-only lifecycle. Returns nothing; refusals are readable messages.
create or replace function public.cred_archive_client(p_client_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org uuid;
begin
  select c.org_id into v_org from public.cred_client_orgs c
  where c.id = p_client_id and c.archived_at is null and public.cred_is_org_owner(c.org_id)
  for update;
  if v_org is null then
    raise exception 'NOT_FOUND: no active client of yours with that id' using errcode = 'P0001';
  end if;
  if not exists (
    select 1 from public.cred_client_orgs c
    where c.org_id = v_org and c.archived_at is null and c.id <> p_client_id
  ) then
    raise exception 'LAST_CLIENT: an account keeps at least one active client' using errcode = 'P0001';
  end if;
  update public.cred_client_orgs set archived_at = now(), archived_by = (select auth.uid())
  where id = p_client_id;
end;
$$;

create or replace function public.cred_restore_client(p_client_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org uuid;
  v_limit integer;
  v_active integer;
  v_coming integer;
begin
  select c.org_id into v_org from public.cred_client_orgs c
  where c.id = p_client_id and c.archived_at is not null and public.cred_is_org_owner(c.org_id)
  for update;
  if v_org is null then
    raise exception 'NOT_FOUND: no archived client of yours with that id' using errcode = 'P0001';
  end if;
  if not public.cred_org_writable(v_org) then
    raise exception 'READ_ONLY: the account is read-only' using errcode = 'P0001';
  end if;

  select provider_limit into v_limit from public.cred_organizations where id = v_org for update;
  select count(*) into v_active from public.cred_providers p
    join public.cred_client_orgs c on c.id = p.client_org_id
    where p.org_id = v_org and c.archived_at is null;
  select count(*) into v_coming from public.cred_providers where client_org_id = p_client_id;

  if v_active + v_coming > v_limit then
    raise exception 'PROVIDER_LIMIT: restoring adds % providers to the % in use; your plan allows %, so % too many',
      v_coming, v_active, v_limit, v_active + v_coming - v_limit using errcode = 'P0001';
  end if;

  update public.cred_client_orgs set archived_at = null, archived_by = null where id = p_client_id;
end;
$$;

-- The only trace a deleted client leaves: its name, when, and who.
create table if not exists public.cred_client_deletions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations (id) on delete cascade,
  client_name text not null,
  deleted_by uuid references auth.users (id) on delete set null,
  deleted_at timestamptz not null default now()
);
alter table public.cred_client_deletions enable row level security;
create policy cred_client_deletions_select on public.cred_client_deletions
  for select to authenticated using (public.cred_is_org_owner(org_id));
grant select on public.cred_client_deletions to authenticated;

create or replace function public.cred_delete_client(p_client_id uuid, p_confirm_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client public.cred_client_orgs%rowtype;
begin
  select * into v_client from public.cred_client_orgs c
  where c.id = p_client_id and public.cred_is_org_owner(c.org_id)
  for update;
  if v_client.id is null then
    raise exception 'NOT_FOUND: no client of yours with that id' using errcode = 'P0001';
  end if;
  if v_client.archived_at is null then
    raise exception 'NOT_ARCHIVED: archive the client before deleting it' using errcode = 'P0001';
  end if;
  if coalesce(p_confirm_name, '') <> v_client.name then
    raise exception 'NAME_MISMATCH: type the client''s name exactly to confirm' using errcode = 'P0001';
  end if;
  -- Files live in Storage, outside the cascade: the app removes them first,
  -- and nothing is deleted while any remain.
  if exists (
    select 1 from storage.objects o
    where o.bucket_id = 'cred-documents' and o.name like v_client.org_id::text || '/' || v_client.id::text || '/%'
  ) then
    raise exception 'FILES_REMAIN: the client''s files must be removed first' using errcode = 'P0001';
  end if;

  insert into public.cred_client_deletions (org_id, client_name, deleted_by)
  values (v_client.org_id, v_client.name, (select auth.uid()));

  -- Practice, providers, credentials, enrollments, history, calls and
  -- document records all cascade from the client.
  delete from public.cred_client_orgs where id = p_client_id;

  -- No member keeps a dangling client in their subset (an empty subset shows
  -- them an empty state, not an error).
  update public.cred_org_members set client_ids = array_remove(client_ids, p_client_id)
  where org_id = v_client.org_id and p_client_id = any (client_ids);
end;
$$;

revoke execute on function public.cred_archive_client(uuid) from public, anon;
revoke execute on function public.cred_restore_client(uuid) from public, anon;
revoke execute on function public.cred_delete_client(uuid, text) from public, anon;
grant execute on function public.cred_archive_client(uuid) to authenticated;
grant execute on function public.cred_restore_client(uuid) to authenticated;
grant execute on function public.cred_delete_client(uuid, text) to authenticated;
