-- H110 v3 — Fase 3: provider documents (alcance v3 §3.8, §4.3, §10.3).
--
-- Files live in the private Storage bucket `cred-documents`, under
--   <org_id>/<client_org_id>/<provider_id>/<random>-<file name>
-- and are only ever served through short-lived signed URLs. `cred_documents`
-- links each file to its provider (and optionally an enrollment).
--
-- Limits, all enforced here rather than in the app:
--   10 MB per file      bucket file_size_limit + a check on the row
--   plan storage quota  uploads refused once the organization's stored bytes
--                       reach storage_limit_mb; registering a file that would
--                       cross the quota is refused too
-- Stored bytes are measured from Storage itself, so a file uploaded but never
-- registered still counts — the quota can't be dodged around the app.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cred-documents', 'cred-documents', false, 10485760,
  array[
    'application/pdf', 'image/jpeg', 'image/png', 'image/heic',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create table public.cred_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  provider_id uuid not null references public.cred_providers(id) on delete cascade,
  enrollment_id uuid references public.cred_enrollments(id) on delete set null,
  category text not null check (category in (
    'license', 'dea', 'malpractice', 'board_cert', 'w9', 'cv', 'contract', 'approval_letter', 'other'
  )),
  file_name text not null check (length(file_name) between 1 and 255),
  storage_path text not null unique,
  -- Taken from Storage by the trigger, never from the app.
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  mime_type text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index cred_documents_client_idx on public.cred_documents (client_org_id);
create index cred_documents_provider_idx on public.cred_documents (provider_id);
create index cred_documents_enrollment_idx on public.cred_documents (enrollment_id);

-- ---------------------------------------------------------------------------
-- Storage helpers
-- ---------------------------------------------------------------------------

create or replace function public.cred_storage_used_bytes(p_org_id uuid)
returns bigint
language sql stable security definer
set search_path = ''
as $$
  select coalesce(sum((o.metadata->>'size')::bigint), 0)
  from storage.objects o
  where o.bucket_id = 'cred-documents' and o.name like p_org_id::text || '/%';
$$;

-- May the caller touch this object path? The path must be
-- <org>/<client>/<provider>/<file>, consistent with the database, and the
-- client must be one the caller can access.
create or replace function public.cred_storage_can_access(p_name text)
returns boolean
language plpgsql stable security definer
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
  ) and public.cred_can_access_client(v_client);
end;
$$;

create or replace function public.cred_storage_can_upload(p_name text)
returns boolean
language plpgsql stable security definer
set search_path = ''
as $$
declare
  v_org uuid;
  v_limit bigint;
begin
  if not public.cred_storage_can_access(p_name) then
    return false;
  end if;
  v_org := split_part(p_name, '/', 1)::uuid;
  select o.storage_limit_mb::bigint * 1048576 into v_limit
  from public.cred_organizations o where o.id = v_org;
  return public.cred_storage_used_bytes(v_org) < v_limit;
end;
$$;

-- ---------------------------------------------------------------------------
-- Document rows
-- ---------------------------------------------------------------------------

create or replace function public.cred_documents_before_write()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  v_size bigint;
  v_mime text;
  v_limit bigint;
begin
  select p.client_org_id, p.org_id into new.client_org_id, new.org_id
  from public.cred_providers p where p.id = new.provider_id;

  if new.enrollment_id is not null and not exists (
    select 1 from public.cred_enrollments e
    where e.id = new.enrollment_id and e.provider_id = new.provider_id
  ) then
    raise exception 'ENROLLMENT_OTHER_PROVIDER: the enrollment belongs to another provider' using errcode = 'P0001';
  end if;

  if tg_op = 'INSERT' then
    if new.storage_path not like new.org_id::text || '/' || new.client_org_id::text || '/' || new.provider_id::text || '/%' then
      raise exception 'DOCUMENT_PATH_MISMATCH: the file is not stored under this provider' using errcode = 'P0001';
    end if;

    select (o.metadata->>'size')::bigint, o.metadata->>'mimetype' into v_size, v_mime
    from storage.objects o
    where o.bucket_id = 'cred-documents' and o.name = new.storage_path;

    if v_size is null then
      raise exception 'DOCUMENT_NOT_UPLOADED: no stored file at this path' using errcode = 'P0001';
    end if;
    new.size_bytes := v_size;
    new.mime_type := v_mime;
    new.uploaded_by := (select auth.uid());

    select o.storage_limit_mb::bigint * 1048576 into v_limit
    from public.cred_organizations o where o.id = new.org_id;
    if public.cred_storage_used_bytes(new.org_id) > v_limit then
      raise exception 'STORAGE_LIMIT_REACHED: this plan stores up to % MB', v_limit / 1048576 using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

create trigger cred_documents_before_write
  before insert or update on public.cred_documents
  for each row execute function public.cred_documents_before_write();

-- ---------------------------------------------------------------------------
-- Privileges and RLS
-- ---------------------------------------------------------------------------

revoke all on public.cred_documents from anon;
-- After upload only the label and the enrollment link can change.
revoke update on public.cred_documents from authenticated;
grant update (category, enrollment_id) on public.cred_documents to authenticated;

revoke execute on function public.cred_documents_before_write() from public, anon, authenticated;
revoke execute on function
  public.cred_storage_used_bytes(uuid), public.cred_storage_can_access(text), public.cred_storage_can_upload(text)
from public, anon;
grant execute on function
  public.cred_storage_used_bytes(uuid), public.cred_storage_can_access(text), public.cred_storage_can_upload(text)
to authenticated;

alter table public.cred_documents enable row level security;

create policy cred_documents_select on public.cred_documents
  for select to authenticated using (public.cred_can_access_client(client_org_id));
create policy cred_documents_insert on public.cred_documents
  for insert to authenticated with check (public.cred_can_access_client(client_org_id));
create policy cred_documents_update on public.cred_documents
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id));
create policy cred_documents_delete on public.cred_documents
  for delete to authenticated using (public.cred_can_access_client(client_org_id));

-- Storage objects in the bucket: read and delete where the client is yours;
-- upload only with room left in the plan's quota; never overwrite.
create policy cred_documents_objects_select on storage.objects
  for select to authenticated
  using (bucket_id = 'cred-documents' and public.cred_storage_can_access(name));
create policy cred_documents_objects_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cred-documents' and public.cred_storage_can_upload(name));
create policy cred_documents_objects_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'cred-documents' and public.cred_storage_can_access(name));
