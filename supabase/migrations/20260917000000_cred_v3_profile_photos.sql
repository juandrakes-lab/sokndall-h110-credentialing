-- Profile photos for people who sign in (never for providers).
--
-- A photo is either the one Google supplies at sign-in (avatar_url / picture in
-- the user's metadata) or one the person uploaded in Settings, kept under
-- photo_url so a later Google sign-in doesn't overwrite it. Uploaded photos
-- live in a public bucket under the owner's own folder: a random file name,
-- 256px, no other data — a team member's face, not a provider record.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cred-avatars', 'cred-avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cred_avatars_insert_own" on storage.objects;
drop policy if exists "cred_avatars_update_own" on storage.objects;
drop policy if exists "cred_avatars_delete_own" on storage.objects;

create policy "cred_avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cred-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "cred_avatars_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'cred-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "cred_avatars_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'cred-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- The team directory carries each person's photo, so the team list, the
-- history and the "responsible" pickers can show faces.
drop function if exists public.cred_org_directory();

create function public.cred_org_directory()
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
      nullif(u.raw_user_meta_data ->> 'photo_url', ''),
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
