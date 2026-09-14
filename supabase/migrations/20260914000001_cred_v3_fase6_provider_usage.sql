-- The provider limit counts every client of the account (Billing Co: 50
-- among all clients), but a Billing Co user reads one client at a time and a
-- limited member only some clients. This answers the account-wide questions
-- — how many providers, and which ones are over the limit — for any member,
-- with the same ordering cred_provider_writable uses.

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
    where p.org_id = p_org_id
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

revoke execute on function public.cred_provider_usage(uuid) from public, anon;
grant execute on function public.cred_provider_usage(uuid) to authenticated;

-- The team directory also says which clients each person can reach, so the
-- "responsible" pickers only offer people who can work on that client
-- (cred_enrollments_before_write / cred_compute_credential_fields refuse the
-- rest anyway).
drop function if exists public.cred_org_directory();
create function public.cred_org_directory()
returns table(org_id uuid, user_id uuid, email text, role text, client_ids uuid[])
language sql
stable
security definer
set search_path = ''
as $$
  select m.org_id, m.user_id, u.email::text, m.role, m.client_ids
  from public.cred_org_members m
  join auth.users u on u.id = m.user_id
  where m.org_id in (
    select mm.org_id from public.cred_org_members mm where mm.user_id = (select auth.uid())
  );
$$;
revoke execute on function public.cred_org_directory() from public, anon;
grant execute on function public.cred_org_directory() to authenticated;

-- An owner adding a client reads it back in the same statement (INSERT …
-- RETURNING). cred_can_access_client looks the row up in a snapshot taken
-- before the insert, so it can't see it yet; the owner check needs only the
-- row's org_id.
drop policy if exists cred_client_orgs_select on public.cred_client_orgs;
create policy cred_client_orgs_select on public.cred_client_orgs
  for select to authenticated
  using (public.cred_is_org_owner(org_id) or public.cred_can_access_client(id));
