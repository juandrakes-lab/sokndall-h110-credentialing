-- Covering indexes for the cred_* foreign keys the performance advisor
-- flagged: they keep cascades (deleting an organization or a user) and the
-- per-organization lookups from scanning whole tables as data grows.
create index if not exists cred_organizations_owner_idx on public.cred_organizations (owner_user_id);
create index if not exists cred_payers_org_global_idx on public.cred_payers_org (payer_global_id);
create index if not exists cred_enrollments_org_idx on public.cred_enrollments (org_id);
create index if not exists cred_enrollment_events_org_idx on public.cred_enrollment_events (org_id);
create index if not exists cred_enrollment_events_changed_by_idx on public.cred_enrollment_events (changed_by);
create index if not exists cred_communications_org_idx on public.cred_communications (org_id);
create index if not exists cred_communications_created_by_idx on public.cred_communications (created_by);
create index if not exists cred_documents_org_idx on public.cred_documents (org_id);
create index if not exists cred_documents_uploaded_by_idx on public.cred_documents (uploaded_by);

-- Storage usage is only reported to members of the organization (it was
-- readable for any organization id). Non-members get null, which the upload
-- policy treats as "no".
create or replace function public.cred_storage_used_bytes(p_org_id uuid)
returns bigint
language sql stable security definer
set search_path = ''
as $$
  select case when public.cred_is_org_member(p_org_id) then (
    select coalesce(sum((o.metadata->>'size')::bigint), 0)
    from storage.objects o
    where o.bucket_id = 'cred-documents' and o.name like p_org_id::text || '/%'
  ) end;
$$;
