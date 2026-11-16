-- Live client status links (pedido 2026-11-16, punto 2).
--
-- One read-only link per client that always shows the current status — no
-- expiry, revocable in one click. The frozen report (cred_reports) stays as
-- the option to attach to an invoice or an email.
--
-- The token is shown once; only its sha256 is stored. The public page
-- (app/status/[token]) resolves the token with cred_live_link_client() and
-- builds the report for that one client with the service role, filtering
-- every read by that client's id — never another client, never the account.
-- A demo's link stops with the demo; an archived client's link stops too.

create table public.cred_live_links (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations (id) on delete cascade,
  client_org_id uuid not null references public.cred_client_orgs (id) on delete cascade,
  token_hash text not null unique,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  last_viewed_at timestamptz
);

-- At most one live link per client at a time.
create unique index cred_live_links_one_per_client on public.cred_live_links (client_org_id) where revoked_at is null;

alter table public.cred_live_links enable row level security;
revoke all on public.cred_live_links from anon, authenticated;
grant select on public.cred_live_links to authenticated;

create policy cred_live_links_read on public.cred_live_links
  for select to authenticated
  using (public.cred_can_access_client(client_org_id));

-- Creates (or replaces) the client's live link. Anyone who can work on the
-- client can do it, while the account is writable; the old link stops.
create or replace function public.cred_create_live_link(p_client_org_id uuid, p_token_hash text)
returns uuid
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_org uuid;
  v_id uuid;
begin
  if not public.cred_can_access_client(p_client_org_id) then
    raise exception 'NO_ACCESS: that client is not yours' using errcode = 'P0001';
  end if;
  select c.org_id into v_org from public.cred_client_orgs c where c.id = p_client_org_id and c.archived_at is null;
  if v_org is null then
    raise exception 'NO_CLIENT: that client is archived or gone' using errcode = 'P0001';
  end if;
  if not public.cred_org_writable(v_org) then
    raise exception 'READ_ONLY: the account is read-only' using errcode = 'P0001';
  end if;
  if p_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'BAD_TOKEN' using errcode = 'P0001';
  end if;
  update public.cred_live_links set revoked_at = now() where client_org_id = p_client_org_id and revoked_at is null;
  insert into public.cred_live_links (org_id, client_org_id, token_hash) values (v_org, p_client_org_id, p_token_hash) returning id into v_id;
  return v_id;
end;
$function$;

create or replace function public.cred_revoke_live_link(p_client_org_id uuid)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
begin
  if not public.cred_can_access_client(p_client_org_id) then
    raise exception 'NO_ACCESS: that client is not yours' using errcode = 'P0001';
  end if;
  update public.cred_live_links set revoked_at = now() where client_org_id = p_client_org_id and revoked_at is null;
end;
$function$;

-- Token → the one client it shows, or nothing. Service role only (the page).
create or replace function public.cred_live_link_client(p_token text)
returns table (client_org_id uuid, org_id uuid, demo boolean)
language sql
stable
security definer
set search_path to ''
as $function$
  select l.client_org_id, l.org_id, d.org_id is not null
  from public.cred_live_links l
  join public.cred_client_orgs c on c.id = l.client_org_id and c.archived_at is null
  left join public.cred_demos d on d.org_id = l.org_id
  where l.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
    and l.revoked_at is null
    and (d.org_id is null or (d.revoked_at is null and (d.expires_at is null or d.expires_at > now())));
$function$;

revoke all on function public.cred_create_live_link(uuid, text) from public;
revoke all on function public.cred_revoke_live_link(uuid) from public;
revoke all on function public.cred_live_link_client(text) from public;
grant execute on function public.cred_create_live_link(uuid, text) to authenticated;
grant execute on function public.cred_revoke_live_link(uuid) to authenticated;
grant execute on function public.cred_live_link_client(text) to service_role;
