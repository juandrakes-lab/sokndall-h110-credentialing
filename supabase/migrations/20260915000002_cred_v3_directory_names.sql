-- People on the team are shown by name everywhere (responsible pickers,
-- history, Team, exports). The name comes from the login's metadata: first +
-- last from our sign-up form, full_name / name from Google; the email only
-- when there's no name yet.
drop function if exists public.cred_org_directory();
create function public.cred_org_directory()
returns table(org_id uuid, user_id uuid, email text, role text, client_ids uuid[], name text)
language sql
stable
security definer
set search_path = ''
as $$
  select m.org_id, m.user_id, u.email::text, m.role, m.client_ids,
    coalesce(
      nullif(trim(concat_ws(' ', u.raw_user_meta_data ->> 'first_name', u.raw_user_meta_data ->> 'last_name')), ''),
      nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(u.raw_user_meta_data ->> 'name'), ''),
      u.email::text
    )
  from public.cred_org_members m
  join auth.users u on u.id = m.user_id
  where m.org_id in (
    select mm.org_id from public.cred_org_members mm where mm.user_id = (select auth.uid())
  );
$$;
revoke execute on function public.cred_org_directory() from public, anon;
grant execute on function public.cred_org_directory() to authenticated;
