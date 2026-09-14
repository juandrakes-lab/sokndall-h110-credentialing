-- Fase 6: Billing Co multi-client (alcance §4.4).
--
-- 1. Active client. A Billing Co user works inside one client at a time. The
--    app sends the active client id in the `x-cred-client` request header;
--    every client-scoped SELECT policy narrows to it. The header only ever
--    narrows what cred_can_access_client already allows — a forged id shows
--    nothing more. No header (Solo/Practice, the cross-client panel, cron)
--    means every client the user can access.
-- 2. Owners of a Billing Co account create clients.
-- 3. Members can be limited to a subset of clients, at invitation time or
--    later.

create or replace function public.cred_active_client()
returns uuid
language plpgsql
stable
set search_path = ''
as $$
declare
  v_raw text;
begin
  v_raw := nullif(current_setting('request.headers', true), '')::json ->> 'x-cred-client';
  if v_raw is null or v_raw = '' then
    return null;
  end if;
  return v_raw::uuid;
exception when others then
  return null;
end;
$$;

create or replace function public.cred_in_active_client(p_client_org_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select public.cred_active_client() is null or p_client_org_id = public.cred_active_client();
$$;

grant execute on function public.cred_active_client() to authenticated;
grant execute on function public.cred_in_active_client(uuid) to authenticated;

-- Client-scoped reads narrow to the active client.
do $$
declare
  t text;
begin
  foreach t in array array['cred_practices', 'cred_providers', 'cred_credentials', 'cred_enrollments',
                           'cred_enrollment_events', 'cred_communications', 'cred_documents'] loop
    execute format('drop policy if exists %I on public.%I', t || '_select', t);
    execute format(
      'create policy %I on public.%I for select to authenticated
         using (public.cred_can_access_client(client_org_id) and public.cred_in_active_client(client_org_id))',
      t || '_select', t);
  end loop;
end;
$$;

-- Owners create clients; cred_enforce_single_client still refuses a second
-- client on any plan but Billing Co.
drop policy if exists cred_client_orgs_insert on public.cred_client_orgs;
create policy cred_client_orgs_insert on public.cred_client_orgs
  for insert to authenticated
  with check (public.cred_is_org_owner(org_id) and public.cred_org_writable(org_id));

grant insert (org_id, name) on public.cred_client_orgs to authenticated;

-- Subsets of clients: only on Billing Co, never empty, only this org's clients.
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
    where not exists (select 1 from public.cred_client_orgs c where c.id = x.id and c.org_id = p_org_id)
  ) then
    raise exception 'UNKNOWN_CLIENT: a chosen client is not on this account' using errcode = 'P0001';
  end if;
end;
$$;

create or replace function public.cred_invitations_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit integer;
  v_used integer;
begin
  select user_limit into v_limit from public.cred_organizations where id = new.org_id for update;

  select
    (select count(*) from public.cred_org_members where org_id = new.org_id)
    + (select count(*) from public.cred_invitations
       where org_id = new.org_id and accepted_at is null and expires_at > now())
  into v_used;

  if v_used >= v_limit then
    raise exception 'USER_LIMIT_REACHED: this plan includes % users', v_limit using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.cred_org_members m join auth.users u on u.id = m.user_id
    where m.org_id = new.org_id and lower(u.email) = new.email
  ) then
    raise exception 'ALREADY_MEMBER: % is already on this account', new.email using errcode = 'P0001';
  end if;

  perform public.cred_check_client_subset(new.org_id, new.client_ids);

  new.role := 'member';
  new.invited_by := (select auth.uid());
  new.created_at := now();
  new.expires_at := now() + interval '14 days';
  new.accepted_at := null;
  new.accepted_by := null;
  return new;
end;
$$;

-- The owner changes which clients a member can work on (null = all of them).
create or replace function public.cred_set_member_clients(p_user_id uuid, p_client_ids uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_org uuid;
begin
  select m.org_id into v_org from public.cred_org_members m
  where m.user_id = (select auth.uid()) and m.role = 'owner';
  if v_org is null then
    raise exception 'OWNER_ONLY' using errcode = 'P0001';
  end if;
  if not exists (
    select 1 from public.cred_org_members where org_id = v_org and user_id = p_user_id and role = 'member'
  ) then
    raise exception 'NOT_A_MEMBER' using errcode = 'P0001';
  end if;

  perform public.cred_check_client_subset(v_org, p_client_ids);

  update public.cred_org_members set client_ids = p_client_ids
  where org_id = v_org and user_id = p_user_id;
end;
$$;

revoke execute on function public.cred_set_member_clients(uuid, uuid[]) from public, anon;
grant execute on function public.cred_set_member_clients(uuid, uuid[]) to authenticated;
revoke execute on function public.cred_check_client_subset(uuid, uuid[]) from public, anon, authenticated;
