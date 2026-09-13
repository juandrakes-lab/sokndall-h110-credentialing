-- Deleting an account must also delete its files, including an account that
-- is already read-only (trial ended, payment failed, subscription revoked).
-- The delete policy required a writable org, so deleteAccount left those
-- files orphaned in Storage. The owner may now always remove their own
-- organization's files; members still need a writable account.

drop policy if exists cred_documents_objects_delete on storage.objects;

create policy cred_documents_objects_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'cred-documents'
    and public.cred_storage_can_access(name)
    and (
      public.cred_org_writable((split_part(name, '/', 1))::uuid)
      or public.cred_is_org_owner((split_part(name, '/', 1))::uuid)
    )
  );
