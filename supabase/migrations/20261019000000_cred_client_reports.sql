-- Client status reports (pedido 2026-10-19, función 1).
--
-- A report is a snapshot: the app reads the client's current state with the
-- signed-in user's own RLS-scoped client and stores it here as JSON, with the
-- time it was generated. It never updates afterwards, so a shared link can
-- never show more than what the report held, nor anything newer.
--
-- Access is the client's: whoever can reach the client (owner, or a member
-- whose client_ids include it) can generate, list and share its reports.
--
-- Optional read-only link, one per report: only the sha256 of its token is
-- stored (same scheme as cred_invitations). It expires, can be revoked, and
-- cred_shared_report() returns that one report and nothing else.

create table public.cred_reports (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  generated_at timestamptz not null default now(),
  data jsonb not null check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 2000000),
  share_token_hash text unique,
  share_created_at timestamptz,
  share_expires_at timestamptz,
  share_revoked_at timestamptz,
  constraint cred_reports_share_complete check (
    (share_token_hash is null and share_expires_at is null) or
    (share_token_hash is not null and share_expires_at is not null)
  )
);

create index cred_reports_client_idx on public.cred_reports (client_org_id, generated_at desc);

-- org_id, author and generation time come from the database, never the app.
create or replace function public.cred_reports_before_write()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    select c.org_id into new.org_id from public.cred_client_orgs c where c.id = new.client_org_id;
    new.created_by := (select auth.uid());
    new.generated_at := now();
    new.share_token_hash := null;
    new.share_created_at := null;
    new.share_expires_at := null;
    new.share_revoked_at := null;
  else
    -- Only the share columns can change after generation.
    new.org_id := old.org_id;
    new.client_org_id := old.client_org_id;
    new.created_by := old.created_by;
    new.generated_at := old.generated_at;
    new.data := old.data;
    if new.share_token_hash is distinct from old.share_token_hash then
      new.share_created_at := now();
      new.share_revoked_at := null;
      if new.share_expires_at is null or new.share_expires_at <= now() or new.share_expires_at > now() + interval '90 days' then
        raise exception 'SHARE_EXPIRY_INVALID: a link lasts between a moment and 90 days' using errcode = 'P0001';
      end if;
    end if;
  end if;
  return new;
end;
$$;

create trigger cred_reports_before_write
  before insert or update on public.cred_reports
  for each row execute function public.cred_reports_before_write();

revoke execute on function public.cred_reports_before_write() from public, anon, authenticated;

alter table public.cred_reports enable row level security;
revoke all on public.cred_reports from anon;
revoke update on public.cred_reports from authenticated;
grant update (share_token_hash, share_expires_at, share_revoked_at) on public.cred_reports to authenticated;

create policy cred_reports_select on public.cred_reports
  for select to authenticated using (public.cred_can_access_client(client_org_id));
create policy cred_reports_insert on public.cred_reports
  for insert to authenticated with check (public.cred_can_access_client(client_org_id));
create policy cred_reports_update on public.cred_reports
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id));
create policy cred_reports_delete on public.cred_reports
  for delete to authenticated using (public.cred_can_access_client(client_org_id));

-- The shared link. Returns the one report whose link this is, while the link
-- is live and the client still exists unarchived; nothing otherwise.
create or replace function public.cred_shared_report(p_token text)
returns table (generated_at timestamptz, expires_at timestamptz, data jsonb)
language sql stable security definer
set search_path = ''
as $$
  select r.generated_at, r.share_expires_at, r.data
  from public.cred_reports r
  join public.cred_client_orgs c on c.id = r.client_org_id
  where p_token is not null
    and length(p_token) between 32 and 128
    and r.share_token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and r.share_revoked_at is null
    and r.share_expires_at > now()
    and c.archived_at is null;
$$;

revoke execute on function public.cred_shared_report(text) from public;
grant execute on function public.cred_shared_report(text) to anon, authenticated;
