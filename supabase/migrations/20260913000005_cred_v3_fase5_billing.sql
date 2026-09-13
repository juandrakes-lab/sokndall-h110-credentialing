-- H110 v3 — Fase 5: subscriptions, plan changes, read-only states, team
-- (alcance v3 §2, §4.3, §4.5, §10.1, §10.2).
--
-- From here on an organization is only ever born from a Polar subscription
-- (cred_sync_subscription, called by the webhook with the service role); the
-- temporary self-serve bootstrap is dropped.
--
-- Write access now depends on the subscription:
--   trialing / active / past_due          everything writable
--   canceled, before current_period_end   writable until the paid period ends
--   revoked (or canceled and past it)     read-only; reading and export still work
-- and, after a downgrade, providers beyond the new limit (the most recently
-- added ones) are read-only until the customer deletes some or upgrades.

-- ---------------------------------------------------------------------------
-- Subscription state on the organization
-- ---------------------------------------------------------------------------

alter table public.cred_organizations
  add column subscription_status text not null default 'trialing'
    check (subscription_status in ('incomplete', 'trialing', 'active', 'past_due', 'canceled', 'revoked')),
  add column polar_customer_id text,
  add column polar_subscription_id text unique,
  add column trial_ends_at timestamptz,
  add column current_period_end timestamptz,
  add column cancel_at_period_end boolean not null default false;

-- Webhook idempotency: one row per Polar delivery id.
create table public.cred_polar_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error text
);
alter table public.cred_polar_events enable row level security;
revoke all on public.cred_polar_events from anon, authenticated;

drop function if exists public.cred_bootstrap_organization(text);

-- ---------------------------------------------------------------------------
-- Write gates
-- ---------------------------------------------------------------------------

create or replace function public.cred_org_writable(p_org_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cred_organizations o
    where o.id = p_org_id
      and (
        o.subscription_status in ('trialing', 'active', 'past_due')
        or (o.subscription_status = 'canceled' and o.current_period_end > now())
      )
  );
$$;

-- A provider is writable when the account is, and it is within the plan's
-- provider limit counting from the oldest (alcance §4.5: after a downgrade
-- the excess is read-only, never deleted).
create or replace function public.cred_provider_writable(p_provider_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cred_providers p
    join public.cred_organizations o on o.id = p.org_id
    where p.id = p_provider_id
      and public.cred_org_writable(o.id)
      and (
        select count(*) from public.cred_providers p2
        where p2.org_id = p.org_id and (p2.created_at, p2.id) < (p.created_at, p.id)
      ) < o.provider_limit
  );
$$;

create or replace function public.cred_enrollment_writable(p_enrollment_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select public.cred_provider_writable(e.provider_id)
  from public.cred_enrollments e where e.id = p_enrollment_id;
$$;

revoke execute on function
  public.cred_org_writable(uuid), public.cred_provider_writable(uuid), public.cred_enrollment_writable(uuid)
from public, anon;
grant execute on function
  public.cred_org_writable(uuid), public.cred_provider_writable(uuid), public.cred_enrollment_writable(uuid)
to authenticated;

-- Practices
drop policy cred_practices_insert on public.cred_practices;
drop policy cred_practices_update on public.cred_practices;
create policy cred_practices_insert on public.cred_practices
  for insert to authenticated
  with check (public.cred_can_access_client(client_org_id) and public.cred_org_writable(org_id));
create policy cred_practices_update on public.cred_practices
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id) and public.cred_org_writable(org_id));

-- Providers (the insert limit itself stays in cred_providers_before_write)
drop policy cred_providers_insert on public.cred_providers;
drop policy cred_providers_update on public.cred_providers;
drop policy cred_providers_delete on public.cred_providers;
create policy cred_providers_insert on public.cred_providers
  for insert to authenticated
  with check (public.cred_can_access_client(client_org_id) and public.cred_org_writable(org_id));
create policy cred_providers_update on public.cred_providers
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(id));
-- Deleting stays possible for a read-only provider: it's how a customer gets
-- back under the limit after a downgrade.
create policy cred_providers_delete on public.cred_providers
  for delete to authenticated
  using (public.cred_can_access_client(client_org_id) and public.cred_org_writable(org_id));

-- Credentials, enrollments, documents: follow their provider
drop policy cred_credentials_insert on public.cred_credentials;
drop policy cred_credentials_update on public.cred_credentials;
drop policy cred_credentials_delete on public.cred_credentials;
create policy cred_credentials_insert on public.cred_credentials
  for insert to authenticated
  with check (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));
create policy cred_credentials_update on public.cred_credentials
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));
create policy cred_credentials_delete on public.cred_credentials
  for delete to authenticated
  using (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));

drop policy cred_enrollments_insert on public.cred_enrollments;
drop policy cred_enrollments_update on public.cred_enrollments;
drop policy cred_enrollments_delete on public.cred_enrollments;
create policy cred_enrollments_insert on public.cred_enrollments
  for insert to authenticated
  with check (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));
create policy cred_enrollments_update on public.cred_enrollments
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));
create policy cred_enrollments_delete on public.cred_enrollments
  for delete to authenticated
  using (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));

drop policy cred_documents_insert on public.cred_documents;
drop policy cred_documents_update on public.cred_documents;
drop policy cred_documents_delete on public.cred_documents;
create policy cred_documents_insert on public.cred_documents
  for insert to authenticated
  with check (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));
create policy cred_documents_update on public.cred_documents
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));
create policy cred_documents_delete on public.cred_documents
  for delete to authenticated
  using (public.cred_can_access_client(client_org_id) and public.cred_provider_writable(provider_id));

drop policy cred_communications_insert on public.cred_communications;
drop policy cred_communications_update on public.cred_communications;
drop policy cred_communications_delete on public.cred_communications;
create policy cred_communications_insert on public.cred_communications
  for insert to authenticated
  with check (public.cred_can_access_client(client_org_id) and public.cred_enrollment_writable(enrollment_id));
create policy cred_communications_update on public.cred_communications
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id) and public.cred_enrollment_writable(enrollment_id));
create policy cred_communications_delete on public.cred_communications
  for delete to authenticated
  using (public.cred_can_access_client(client_org_id) and public.cred_enrollment_writable(enrollment_id));

-- The payer list
drop policy cred_payers_org_insert on public.cred_payers_org;
drop policy cred_payers_org_update on public.cred_payers_org;
drop policy cred_payers_org_delete on public.cred_payers_org;
create policy cred_payers_org_insert on public.cred_payers_org
  for insert to authenticated
  with check (public.cred_is_org_member(org_id) and public.cred_org_writable(org_id));
create policy cred_payers_org_update on public.cred_payers_org
  for update to authenticated
  using (public.cred_is_org_member(org_id))
  with check (public.cred_is_org_member(org_id) and public.cred_org_writable(org_id));
create policy cred_payers_org_delete on public.cred_payers_org
  for delete to authenticated
  using (public.cred_is_org_member(org_id) and public.cred_org_writable(org_id));

-- Storage: uploading needs a writable provider and room in the quota;
-- deleting a file needs a writable account (so a read-only provider can still
-- be deleted with its files).
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
  if not public.cred_provider_writable(split_part(p_name, '/', 3)::uuid) then
    return false;
  end if;
  v_org := split_part(p_name, '/', 1)::uuid;
  select o.storage_limit_mb::bigint * 1048576 into v_limit
  from public.cred_organizations o where o.id = v_org;
  return public.cred_storage_used_bytes(v_org) < v_limit;
end;
$$;

drop policy cred_documents_objects_delete on storage.objects;
create policy cred_documents_objects_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'cred-documents'
    and public.cred_storage_can_access(name)
    and public.cred_org_writable(split_part(name, '/', 1)::uuid)
  );

-- ---------------------------------------------------------------------------
-- Keep the client's name (and a Solo/Practice account's name) in step with
-- the practice's legal name.
-- ---------------------------------------------------------------------------

create or replace function public.cred_practices_sync_names()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  update public.cred_client_orgs set name = new.legal_name where id = new.client_org_id;
  if tg_op = 'INSERT' then
    update public.cred_organizations set name = new.legal_name
    where id = new.org_id and plan <> 'billing_co';
  end if;
  return new;
end;
$$;

create trigger cred_practices_sync_names
  after insert or update of legal_name on public.cred_practices
  for each row execute function public.cred_practices_sync_names();

revoke execute on function public.cred_practices_sync_names() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Provisioning from Polar (service role only)
-- ---------------------------------------------------------------------------

-- Creates the organization the first time a subscription is seen for a user
-- (owner membership and its first client included), and afterwards keeps
-- plan, status and dates in sync. Returns the organization id.
create or replace function public.cred_sync_subscription(
  p_user_id uuid,
  p_account_name text,
  p_customer_id text,
  p_subscription_id text,
  p_plan text,
  p_status text,
  p_trial_ends_at timestamptz,
  p_current_period_end timestamptz,
  p_cancel_at_period_end boolean
)
returns uuid
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_org uuid;
begin
  if p_plan not in ('solo', 'practice', 'billing_co') then
    raise exception 'UNKNOWN_PLAN: %', p_plan;
  end if;

  select id into v_org from public.cred_organizations where polar_subscription_id = p_subscription_id;
  if v_org is null then
    select id into v_org from public.cred_organizations where owner_user_id = p_user_id;
  end if;

  if v_org is null then
    if not exists (select 1 from auth.users where id = p_user_id) then
      raise exception 'UNKNOWN_USER: %', p_user_id;
    end if;
    if exists (select 1 from public.cred_org_members where user_id = p_user_id) then
      raise exception 'ALREADY_MEMBER: user % belongs to another organization', p_user_id;
    end if;

    insert into public.cred_organizations (
      name, owner_user_id, plan, subscription_status, polar_customer_id, polar_subscription_id,
      trial_ends_at, current_period_end, cancel_at_period_end
    ) values (
      coalesce(nullif(trim(p_account_name), ''), 'My practice'), p_user_id, p_plan, p_status,
      p_customer_id, p_subscription_id, p_trial_ends_at, p_current_period_end, coalesce(p_cancel_at_period_end, false)
    ) returning id into v_org;

    insert into public.cred_org_members (org_id, user_id, role) values (v_org, p_user_id, 'owner');
    insert into public.cred_client_orgs (org_id, name)
      values (v_org, coalesce(nullif(trim(p_account_name), ''), 'My practice'));
  else
    update public.cred_organizations set
      plan = p_plan,
      subscription_status = p_status,
      polar_customer_id = coalesce(p_customer_id, polar_customer_id),
      polar_subscription_id = p_subscription_id,
      trial_ends_at = p_trial_ends_at,
      current_period_end = p_current_period_end,
      cancel_at_period_end = coalesce(p_cancel_at_period_end, false)
    where id = v_org;
  end if;

  return v_org;
end;
$$;

revoke execute on function public.cred_sync_subscription(uuid, text, text, text, text, text, timestamptz, timestamptz, boolean)
  from public, anon, authenticated;
grant execute on function public.cred_sync_subscription(uuid, text, text, text, text, text, timestamptz, timestamptz, boolean)
  to service_role;

-- ---------------------------------------------------------------------------
-- Team: invitations, joining, removing
-- ---------------------------------------------------------------------------

create table public.cred_invitations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.cred_organizations(id) on delete cascade,
  email text not null check (email = lower(email) and email like '%@%'),
  role text not null default 'member' check (role = 'member'),
  -- null = every client; a Billing Co member can be limited to some.
  client_ids uuid[],
  -- sha256 of the token in the invite link; the token itself is never stored.
  token_hash text not null unique,
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null
);

create unique index cred_invitations_pending_once
  on public.cred_invitations (org_id, email) where accepted_at is null;
create index cred_invitations_org_idx on public.cred_invitations (org_id);

-- Seats: members plus live invitations may not exceed the plan's users
-- (alcance §4.3: blocked at user N+1).
create or replace function public.cred_invitations_before_insert()
returns trigger
language plpgsql security definer
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

  new.invited_by := (select auth.uid());
  return new;
end;
$$;

create trigger cred_invitations_before_insert
  before insert on public.cred_invitations
  for each row execute function public.cred_invitations_before_insert();

revoke execute on function public.cred_invitations_before_insert() from public, anon, authenticated;

revoke all on public.cred_invitations from anon;
revoke update on public.cred_invitations from authenticated;
alter table public.cred_invitations enable row level security;

create policy cred_invitations_select on public.cred_invitations
  for select to authenticated using (public.cred_is_org_owner(org_id));
create policy cred_invitations_insert on public.cred_invitations
  for insert to authenticated
  with check (public.cred_is_org_owner(org_id) and public.cred_org_writable(org_id));
create policy cred_invitations_delete on public.cred_invitations
  for delete to authenticated using (public.cred_is_org_owner(org_id));

-- What the invite link shows before signing in: the account name and the
-- address it was sent to. Knowing the token is the permission.
create or replace function public.cred_invitation_preview(p_token text)
returns table (org_name text, email text, status text)
language sql stable security definer
set search_path = ''
as $$
  select o.name, i.email,
    case
      when i.accepted_at is not null then 'accepted'
      when i.expires_at <= now() then 'expired'
      else 'pending'
    end
  from public.cred_invitations i
  join public.cred_organizations o on o.id = i.org_id
  where i.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex');
$$;

create or replace function public.cred_accept_invitation(p_token text)
returns uuid
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_inv public.cred_invitations%rowtype;
  v_user uuid := (select auth.uid());
  v_email text := lower((select auth.jwt()) ->> 'email');
  v_limit integer;
  v_members integer;
begin
  if v_user is null then
    raise exception 'NOT_SIGNED_IN';
  end if;

  select * into v_inv from public.cred_invitations
  where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  for update;

  if v_inv.id is null or v_inv.accepted_at is not null or v_inv.expires_at <= now() then
    raise exception 'INVITATION_INVALID: this invitation is no longer valid' using errcode = 'P0001';
  end if;
  if v_inv.email <> v_email then
    raise exception 'INVITATION_OTHER_EMAIL: this invitation was sent to %', v_inv.email using errcode = 'P0001';
  end if;
  if exists (select 1 from public.cred_org_members where user_id = v_user) then
    raise exception 'ALREADY_MEMBER: this login already belongs to an account' using errcode = 'P0001';
  end if;

  select user_limit into v_limit from public.cred_organizations where id = v_inv.org_id for update;
  select count(*) into v_members from public.cred_org_members where org_id = v_inv.org_id;
  if v_members >= v_limit then
    raise exception 'USER_LIMIT_REACHED: this plan includes % users', v_limit using errcode = 'P0001';
  end if;

  insert into public.cred_org_members (org_id, user_id, role, client_ids)
  values (v_inv.org_id, v_user, v_inv.role, v_inv.client_ids);

  update public.cred_invitations set accepted_at = now(), accepted_by = v_user where id = v_inv.id;
  return v_inv.org_id;
end;
$$;

create or replace function public.cred_remove_member(p_user_id uuid)
returns void
language plpgsql volatile security definer
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
  if p_user_id = (select auth.uid()) then
    raise exception 'CANNOT_REMOVE_OWNER' using errcode = 'P0001';
  end if;

  delete from public.cred_org_members where org_id = v_org and user_id = p_user_id and role = 'member';
end;
$$;

-- Owner closes the account: everything goes with the organization row.
-- (Stored files and the Polar subscription are handled by the app first.)
create or replace function public.cred_delete_organization()
returns void
language plpgsql volatile security definer
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
  delete from public.cred_organizations where id = v_org;
end;
$$;

revoke execute on function
  public.cred_invitation_preview(text), public.cred_accept_invitation(text),
  public.cred_remove_member(uuid), public.cred_delete_organization()
from public, anon;
grant execute on function public.cred_invitation_preview(text) to anon, authenticated;
grant execute on function
  public.cred_accept_invitation(text), public.cred_remove_member(uuid), public.cred_delete_organization()
to authenticated;
