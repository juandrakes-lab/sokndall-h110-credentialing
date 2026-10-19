-- Provider upload links (pedido 2026-10-19, función 2).
--
-- Someone on the team creates a link for one provider; that person uploads
-- their own documents through it, without an account. The link:
--   exists only because someone created it (cred_upload_links)
--   is for one provider, expires (max 30 days), can be revoked
--   only uploads: nothing in this schema lets a token read or list anything
--   has the bucket's limits (10 MB, same file types) and 10 attempts an hour
-- Files land first in a quarantine prefix only the service role can reach,
-- are scanned for malware by the app, and only then move under the provider's
-- folder as a *submission* waiting for review — never straight into the
-- provider's documents. Accepting one turns it into a cred_documents row.
--
-- The token flow runs with the service role (an unauthenticated request with
-- no user behind it, like the cron routes); these functions are the only
-- writes it makes, and every one re-checks the token.

create table public.cred_upload_links (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  provider_id uuid not null references public.cred_providers(id) on delete cascade,
  token_hash text not null unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);
create index cred_upload_links_provider_idx on public.cred_upload_links (provider_id);

create table public.cred_upload_attempts (
  id bigserial primary key,
  link_id uuid not null references public.cred_upload_links(id) on delete cascade,
  at timestamptz not null default now()
);
create index cred_upload_attempts_link_idx on public.cred_upload_attempts (link_id, at);

create table public.cred_document_submissions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  provider_id uuid not null references public.cred_providers(id) on delete cascade,
  link_id uuid references public.cred_upload_links(id) on delete set null,
  category text not null check (category in (
    'license', 'dea', 'malpractice', 'board_cert', 'w9', 'cv', 'contract', 'approval_letter', 'other'
  )),
  file_name text not null check (length(file_name) between 1 and 255),
  storage_path text not null unique,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  mime_type text,
  submitted_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  document_id uuid references public.cred_documents(id) on delete set null
);
create index cred_document_submissions_client_idx on public.cred_document_submissions (client_org_id, status);
create index cred_document_submissions_provider_idx on public.cred_document_submissions (provider_id);

-- Links: org, client, author and a sane expiry come from the database.
create or replace function public.cred_upload_links_before_write()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    select p.org_id, p.client_org_id into new.org_id, new.client_org_id
    from public.cred_providers p where p.id = new.provider_id;
    new.created_by := (select auth.uid());
    new.created_at := now();
    new.revoked_at := null;
    if new.expires_at is null or new.expires_at <= now() or new.expires_at > now() + interval '30 days' then
      raise exception 'UPLOAD_LINK_EXPIRY_INVALID: a link lasts at most 30 days' using errcode = 'P0001';
    end if;
  else
    new.org_id := old.org_id;
    new.client_org_id := old.client_org_id;
    new.provider_id := old.provider_id;
    new.token_hash := old.token_hash;
    new.created_by := old.created_by;
    new.created_at := old.created_at;
    -- A link can be cut short, never extended.
    new.expires_at := least(new.expires_at, old.expires_at);
  end if;
  return new;
end;
$$;
create trigger cred_upload_links_before_write
  before insert or update on public.cred_upload_links
  for each row execute function public.cred_upload_links_before_write();

alter table public.cred_upload_links enable row level security;
alter table public.cred_upload_attempts enable row level security;
alter table public.cred_document_submissions enable row level security;
revoke all on public.cred_upload_links, public.cred_upload_attempts, public.cred_document_submissions from anon;
revoke all on public.cred_upload_attempts from authenticated;
revoke update on public.cred_upload_links from authenticated;
grant update (revoked_at) on public.cred_upload_links to authenticated;
revoke insert, update, delete on public.cred_document_submissions from authenticated;

create policy cred_upload_links_select on public.cred_upload_links
  for select to authenticated using (public.cred_can_access_client(client_org_id));
create policy cred_upload_links_insert on public.cred_upload_links
  for insert to authenticated with check (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));
create policy cred_upload_links_update on public.cred_upload_links
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id));
create policy cred_document_submissions_select on public.cred_document_submissions
  for select to authenticated using (public.cred_can_access_client(client_org_id));

-- What the upload page may show about a link: who it's for, nothing else.
create or replace function public.cred_upload_link_info(p_token text)
returns table (provider_first_name text, client_name text, expires_at timestamptz)
language sql stable security definer
set search_path = ''
as $$
  select p.first_name, c.name, l.expires_at
  from public.cred_upload_links l
  join public.cred_providers p on p.id = l.provider_id
  join public.cred_client_orgs c on c.id = l.client_org_id
  where p_token is not null and length(p_token) between 32 and 128
    and l.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and l.revoked_at is null and l.expires_at > now()
    and c.archived_at is null and p.status = 'active';
$$;

-- Step 1 of an upload (service role): checks the token, the hourly limit,
-- the file's declared size and type and the plan's storage, records the
-- attempt, and returns where the file may go in quarantine.
create or replace function public.cred_upload_authorize(p_token text, p_file_name text, p_size bigint, p_mime text)
returns table (link_id uuid, quarantine_path text)
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_link public.cred_upload_links%rowtype;
  v_limit bigint;
begin
  select l.* into v_link
  from public.cred_upload_links l
  join public.cred_providers p on p.id = l.provider_id
  join public.cred_client_orgs c on c.id = l.client_org_id
  where p_token is not null and length(p_token) between 32 and 128
    and l.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and l.revoked_at is null and l.expires_at > now()
    and c.archived_at is null and p.status = 'active';
  if v_link.id is null then
    raise exception 'UPLOAD_LINK_INVALID: this link is no longer valid' using errcode = 'P0001';
  end if;

  if (select count(*) from public.cred_upload_attempts a where a.link_id = v_link.id and a.at > now() - interval '1 hour') >= 10 then
    raise exception 'UPLOAD_RATE_LIMITED: too many uploads in the last hour' using errcode = 'P0001';
  end if;
  insert into public.cred_upload_attempts (link_id) values (v_link.id);

  if p_size is null or p_size <= 0 or p_size > 10485760 then
    raise exception 'UPLOAD_TOO_LARGE: files can be up to 10 MB' using errcode = 'P0001';
  end if;
  if p_mime is null or p_mime not in (
    'application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) then
    raise exception 'UPLOAD_TYPE: this type of file is not accepted' using errcode = 'P0001';
  end if;
  if p_file_name is null or length(p_file_name) not between 1 and 255 then
    raise exception 'UPLOAD_NAME: the file needs a name' using errcode = 'P0001';
  end if;

  select o.storage_limit_mb::bigint * 1048576 into v_limit from public.cred_organizations o where o.id = v_link.org_id;
  if public.cred_storage_used_bytes(v_link.org_id) + p_size > v_limit then
    raise exception 'STORAGE_LIMIT_REACHED: the account is out of storage' using errcode = 'P0001';
  end if;

  return query select v_link.id, 'quarantine/' || v_link.id::text || '/' || gen_random_uuid()::text;
end;
$$;

-- Step 2 (service role, after the scan and the move): records the clean file
-- as a submission waiting for review. The size and type come from Storage.
create or replace function public.cred_upload_record(p_token text, p_storage_path text, p_category text, p_file_name text)
returns uuid
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_link public.cred_upload_links%rowtype;
  v_size bigint;
  v_mime text;
  v_id uuid;
begin
  select l.* into v_link from public.cred_upload_links l
  where l.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and l.revoked_at is null and l.expires_at > now();
  if v_link.id is null then
    raise exception 'UPLOAD_LINK_INVALID: this link is no longer valid' using errcode = 'P0001';
  end if;
  if p_storage_path not like v_link.org_id::text || '/' || v_link.client_org_id::text || '/' || v_link.provider_id::text || '/submitted-%' then
    raise exception 'UPLOAD_PATH: not this provider''s folder' using errcode = 'P0001';
  end if;
  select (o.metadata->>'size')::bigint, o.metadata->>'mimetype' into v_size, v_mime
  from storage.objects o where o.bucket_id = 'cred-documents' and o.name = p_storage_path;
  if v_size is null then
    raise exception 'DOCUMENT_NOT_UPLOADED: no stored file at this path' using errcode = 'P0001';
  end if;
  insert into public.cred_document_submissions (org_id, client_org_id, provider_id, link_id, category, file_name, storage_path, size_bytes, mime_type)
  values (v_link.org_id, v_link.client_org_id, v_link.provider_id, v_link.id,
          case when p_category in ('license', 'dea', 'malpractice', 'board_cert', 'w9', 'cv', 'contract', 'approval_letter', 'other') then p_category else 'other' end,
          left(p_file_name, 255), p_storage_path, v_size, v_mime)
  returning id into v_id;
  return v_id;
end;
$$;

-- Review (team, signed in): accepting files the submission into the
-- provider's documents (the cred_documents trigger re-checks path, size and
-- quota, and records the reviewer as the uploader); rejecting marks it, and
-- the app removes the file.
create or replace function public.cred_review_submission(p_id uuid, p_accept boolean, p_category text default null)
returns uuid
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_sub public.cred_document_submissions%rowtype;
  v_doc uuid;
begin
  select * into v_sub from public.cred_document_submissions where id = p_id and status = 'pending';
  if v_sub.id is null or not public.cred_can_access_client(v_sub.client_org_id) then
    raise exception 'NOT_FOUND: no pending upload with that id' using errcode = 'P0001';
  end if;
  if p_accept then
    if not public.cred_provider_writable(v_sub.provider_id) then
      raise exception 'READ_ONLY: this provider can''t be edited right now' using errcode = 'P0001';
    end if;
    insert into public.cred_documents (provider_id, category, file_name, storage_path)
    values (v_sub.provider_id, coalesce(nullif(p_category, ''), v_sub.category), v_sub.file_name, v_sub.storage_path)
    returning id into v_doc;
  end if;
  update public.cred_document_submissions
  set status = case when p_accept then 'accepted' else 'rejected' end,
      reviewed_by = (select auth.uid()), reviewed_at = now(), document_id = v_doc
  where id = p_id;
  return v_doc;
end;
$$;

revoke execute on function public.cred_upload_links_before_write() from public, anon, authenticated;
revoke execute on function public.cred_upload_link_info(text), public.cred_upload_authorize(text, text, bigint, text),
  public.cred_upload_record(text, text, text, text), public.cred_review_submission(uuid, boolean, text) from public, anon, authenticated;
grant execute on function public.cred_upload_link_info(text) to anon, authenticated;
grant execute on function public.cred_review_submission(uuid, boolean, text) to authenticated;
-- cred_upload_authorize / cred_upload_record: service role only.
