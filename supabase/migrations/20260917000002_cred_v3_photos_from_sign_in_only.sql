-- Profile photos come only from the account people sign in with (Google
-- supplies avatar_url / picture); uploading a photo was tried and dropped
-- (2026-09-17). The upload bucket and its policies go with it.
drop policy if exists "cred_avatars_insert_own" on storage.objects;
drop policy if exists "cred_avatars_update_own" on storage.objects;
drop policy if exists "cred_avatars_delete_own" on storage.objects;

create or replace function public.cred_org_directory()
 returns table(org_id uuid, user_id uuid, email text, role text, client_ids uuid[], name text, photo text)
 language sql
 stable security definer
 set search_path to ''
as $function$
  select m.org_id, m.user_id, u.email::text, m.role, m.client_ids,
    coalesce(
      nullif(trim(concat_ws(' ', u.raw_user_meta_data ->> 'first_name', u.raw_user_meta_data ->> 'last_name')), ''),
      nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(u.raw_user_meta_data ->> 'name'), ''),
      u.email::text
    ),
    coalesce(
      nullif(u.raw_user_meta_data ->> 'avatar_url', ''),
      nullif(u.raw_user_meta_data ->> 'picture', '')
    )
  from public.cred_org_members m
  join auth.users u on u.id = m.user_id
  where m.org_id in (
    select mm.org_id from public.cred_org_members mm where mm.user_id = (select auth.uid())
  );
$function$;

revoke all on function public.cred_org_directory() from public, anon;
grant execute on function public.cred_org_directory() to authenticated;
