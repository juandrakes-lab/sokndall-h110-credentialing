-- Evaluation changes (alcance rev. 2026-09-18).
--
-- 1. Payers belong to a client (§3.4, §4.4). A Billing Co account's clients
--    no longer share one payer list. Existing rows are split: each client
--    that has applications with a payer gets its own row (applications move
--    to it); a payer nobody applied to yet goes to every client, so no one
--    loses a column they had.
-- 2. Inactive providers don't take a seat (§4.3); reactivating one needs a
--    free seat.
-- 3. Two credential types: state CDS registration and "Other" with its own
--    name (§3.3).
-- 4. A credential remembers when it was last renewed, so the onboarding
--    checklist can tell an old copy from the current one (§3.10).
-- 5. An application in "info requested" carries what the payer asked for,
--    pending until someone resolves it (§3.7).

-- 5 (first, the backfill below touches enrollments). Pending payer request --

alter table public.cred_enrollments
  add column if not exists pending_request text check (pending_request is null or length(pending_request) between 1 and 500),
  add column if not exists pending_request_at timestamptz;

-- 1. Payers per client -------------------------------------------------------

alter table public.cred_payers_org
  add column if not exists client_org_id uuid references public.cred_client_orgs(id) on delete cascade;

-- "Once per org" becomes "once per client": the old indexes go before the split.
drop index if exists public.cred_payers_org_catalog_once;
drop index if exists public.cred_payers_org_name_once;

do $$
declare
  p record;
  v_clients uuid[];
  v_new uuid;
  i integer;
begin
  for p in select * from public.cred_payers_org where client_org_id is null loop
    select array_agg(c.id order by c.created_at, c.id) into v_clients
    from public.cred_client_orgs c
    where c.org_id = p.org_id
      and (
        exists (select 1 from public.cred_enrollments e where e.payer_id = p.id and e.client_org_id = c.id)
        or not exists (select 1 from public.cred_enrollments e where e.payer_id = p.id)
      );

    if v_clients is null then
      select array_agg(c.id order by c.created_at, c.id) into v_clients
      from public.cred_client_orgs c where c.org_id = p.org_id;
    end if;
    if v_clients is null then
      delete from public.cred_payers_org where id = p.id; -- an org with no client can't use it
      continue;
    end if;

    update public.cred_payers_org set client_org_id = v_clients[1] where id = p.id;

    for i in 2 .. coalesce(array_length(v_clients, 1), 1) loop
      insert into public.cred_payers_org (org_id, client_org_id, payer_global_id, name, payer_type, revalidation_months, created_at)
      values (p.org_id, v_clients[i], p.payer_global_id, p.name, p.payer_type, p.revalidation_months, p.created_at)
      returning id into v_new;
      update public.cred_enrollments set payer_id = v_new where payer_id = p.id and client_org_id = v_clients[i];
    end loop;
  end loop;
end;
$$;

alter table public.cred_payers_org alter column client_org_id set not null;

create unique index cred_payers_org_catalog_once
  on public.cred_payers_org (client_org_id, payer_global_id) where payer_global_id is not null;
create unique index cred_payers_org_name_once
  on public.cred_payers_org (client_org_id, lower(name)) where payer_global_id is null;
create index if not exists cred_payers_org_client_idx on public.cred_payers_org (client_org_id);

-- The client decides the org. A write without a client lands in the active
-- client, or in the only client of a Solo / Practice account.
create or replace function public.cred_payers_org_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_only uuid;
begin
  if new.client_org_id is null then
    new.client_org_id := public.cred_active_client();
  end if;
  if new.client_org_id is null then
    select case when count(*) = 1 then min(c.id::text)::uuid end into v_only
    from public.cred_client_orgs c where c.org_id = new.org_id;
    new.client_org_id := v_only;
  end if;
  if new.client_org_id is null then
    raise exception 'CLIENT_REQUIRED: choose which client this payer is for' using errcode = 'P0001';
  end if;
  select c.org_id into new.org_id from public.cred_client_orgs c where c.id = new.client_org_id;
  if new.org_id is null then
    raise exception 'UNKNOWN_CLIENT: that client does not exist' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists cred_payers_org_before_write on public.cred_payers_org;
create trigger cred_payers_org_before_write
  before insert or update on public.cred_payers_org
  for each row execute function public.cred_payers_org_before_write();

drop policy if exists cred_payers_org_select on public.cred_payers_org;
drop policy if exists cred_payers_org_insert on public.cred_payers_org;
drop policy if exists cred_payers_org_update on public.cred_payers_org;
drop policy if exists cred_payers_org_delete on public.cred_payers_org;
create policy cred_payers_org_select on public.cred_payers_org
  for select to authenticated
  using (public.cred_can_access_client(client_org_id) and public.cred_in_active_client(client_org_id));
create policy cred_payers_org_insert on public.cred_payers_org
  for insert to authenticated
  with check (public.cred_can_access_client(client_org_id) and public.cred_org_writable(org_id));
create policy cred_payers_org_update on public.cred_payers_org
  for update to authenticated
  using (public.cred_can_access_client(client_org_id))
  with check (public.cred_can_access_client(client_org_id) and public.cred_org_writable(org_id));
create policy cred_payers_org_delete on public.cred_payers_org
  for delete to authenticated
  using (public.cred_can_access_client(client_org_id) and public.cred_org_writable(org_id));

-- An application's payer must be on its own client's list.
create or replace function public.cred_enrollments_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_payer_client uuid;
  v_months integer;
begin
  select p.client_org_id, p.org_id into new.client_org_id, new.org_id
  from public.cred_providers p where p.id = new.provider_id;

  select po.client_org_id, coalesce(po.revalidation_months, pg.revalidation_months)
    into v_payer_client, v_months
  from public.cred_payers_org po
  left join public.cred_payers_global pg on pg.id = po.payer_global_id
  where po.id = new.payer_id;

  if v_payer_client is distinct from new.client_org_id then
    raise exception 'PAYER_OTHER_CLIENT: the payer is not on this client''s list' using errcode = 'P0001';
  end if;

  if new.assigned_user_id is not null
     and not public.cred_user_can_access_client(new.assigned_user_id, new.client_org_id) then
    raise exception 'ASSIGNEE_NOT_MEMBER: the assignee can''t access this client' using errcode = 'P0001';
  end if;

  if tg_op = 'INSERT' or new.status is distinct from old.status then
    new.status_changed_at := now();
    if new.status = 'approved' then
      new.next_follow_up_date := null;
    end if;
  end if;

  -- 5. A payer's request lives only while the application waits on it.
  if new.status <> 'info_requested' then
    new.pending_request := null;
    new.pending_request_at := null;
  elsif new.pending_request is not null
        and (tg_op = 'INSERT' or new.pending_request is distinct from old.pending_request) then
    new.pending_request_at := now();
  end if;

  if new.effective_date is null then
    new.revalidation_due_date := null;
  else
    new.revalidation_due_date :=
      (new.effective_date + make_interval(months => coalesce(new.revalidation_months_override, v_months)))::date;
  end if;

  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;

  return new;
end;
$function$;

-- 2. Inactive providers don't take a seat -------------------------------------

create or replace function public.cred_provider_writable(p_provider_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cred_providers p
    join public.cred_organizations o on o.id = p.org_id
    join public.cred_client_orgs c on c.id = p.client_org_id
    where p.id = p_provider_id
      and c.archived_at is null
      and public.cred_org_writable(o.id)
      and (
        p.status = 'inactive'
        or (
          select count(*) from public.cred_providers p2
          join public.cred_client_orgs c2 on c2.id = p2.client_org_id
          where p2.org_id = p.org_id and c2.archived_at is null and p2.status = 'active'
            and (p2.created_at, p2.id) < (p.created_at, p.id)
        ) < o.provider_limit
      )
  );
$$;

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
    join public.cred_client_orgs c on c.id = p.client_org_id
    where p.org_id = p_org_id and c.archived_at is null and p.status = 'active'
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

create or replace function public.cred_providers_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_limit integer;
  v_count integer;
begin
  select p.client_org_id, p.org_id into new.client_org_id, new.org_id
  from public.cred_practices p where p.id = new.practice_id;

  -- A seat is taken by a new active provider, or by an inactive one coming back.
  if coalesce(new.status, 'active') = 'active' and (tg_op = 'INSERT' or old.status = 'inactive') then
    select o.provider_limit into v_limit
    from public.cred_organizations o where o.id = new.org_id for update;

    select count(*) into v_count
    from public.cred_providers p
    join public.cred_client_orgs c on c.id = p.client_org_id
    where p.org_id = new.org_id and c.archived_at is null and p.status = 'active' and p.id <> new.id;

    if v_count >= v_limit then
      raise exception 'PROVIDER_LIMIT_REACHED: this plan allows % providers', v_limit
        using errcode = 'P0001';
    end if;
  end if;

  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;

  return new;
end;
$$;

-- 3 + 4. Credential types and renewal date ------------------------------------

alter table public.cred_credentials drop constraint if exists cred_credentials_type_check;
alter table public.cred_credentials add constraint cred_credentials_type_check
  check (type in ('state_license', 'dea', 'malpractice', 'board_cert', 'caqh_attestation', 'cds', 'other'));

alter table public.cred_credentials
  add column if not exists custom_name text,
  add column if not exists renewed_at timestamptz;

alter table public.cred_credentials drop constraint if exists cred_credentials_custom_name_rule;
alter table public.cred_credentials add constraint cred_credentials_custom_name_rule
  check (
    (type = 'other' and custom_name is not null and length(trim(custom_name)) between 2 and 80)
    or (type <> 'other' and custom_name is null)
  );

create or replace function public.cred_compute_credential_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_interval integer;
begin
  select p.client_org_id, p.org_id into new.client_org_id, new.org_id
  from public.cred_providers p where p.id = new.provider_id;

  if new.assigned_user_id is not null
     and not public.cred_user_can_access_client(new.assigned_user_id, new.client_org_id) then
    raise exception 'ASSIGNEE_NOT_MEMBER: the assignee can''t access this client' using errcode = 'P0001';
  end if;

  if new.type = 'caqh_attestation' then
    if new.issue_date is null then
      new.expiration_date := null;
    else
      select o.caqh_reattestation_interval_days into v_interval
      from public.cred_organizations o where o.id = new.org_id;
      new.expiration_date := new.issue_date + coalesce(v_interval, 120);
    end if;
  end if;

  new.status := public.cred_status_for(new.expiration_date);

  if tg_op = 'UPDATE' then
    new.updated_at := now();
    -- A later expiration date is a renewal: copies uploaded before it are old.
    if new.expiration_date is not null and old.expiration_date is not null
       and new.expiration_date > old.expiration_date then
      new.renewed_at := now();
    end if;
  end if;

  return new;
end;
$function$;
