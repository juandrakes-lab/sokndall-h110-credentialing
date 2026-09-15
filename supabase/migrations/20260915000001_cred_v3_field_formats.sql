-- Fase 7 (functional polish): the third layer of the field rules. The same
-- formats lib/validation.js checks in the browser and on the server, held by
-- the database, so an import, a script or a future screen can't store a
-- malformed value either. Check digits (NPI Luhn, DEA) and cross-field
-- checks that need context stay in the app; these are the formats.
--
-- The DEA format is NOT VALID: one existing record (an early test) predates
-- it; new and edited rows must comply.

alter table public.cred_providers
  add constraint cred_providers_npi_format check (npi is null or npi ~ '^\d{10}$'),
  add constraint cred_providers_caqh_format check (caqh_id is null or caqh_id ~ '^\d{1,10}$'),
  add constraint cred_providers_phone_format check (phone is null or phone ~ '^\d{10}$'),
  add constraint cred_providers_taxonomy_format check (taxonomy_code is null or taxonomy_code ~ '^[0-9]{3}[0-9A-Z]{6}X$'),
  add constraint cred_providers_email_format check (email is null or email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$');

alter table public.cred_practices
  add constraint cred_practices_group_npi_format check (group_npi is null or group_npi ~ '^\d{10}$'),
  add constraint cred_practices_tin_format check (tin is null or tin ~ '^\d{9}$'),
  add constraint cred_practices_zip_format check (
    (service_zip is null or service_zip ~ '^(\d{5}|\d{9})$') and (billing_zip is null or billing_zip ~ '^(\d{5}|\d{9})$')
  ),
  add constraint cred_practices_state_format check (
    (service_state is null or service_state ~ '^[A-Z]{2}$') and (billing_state is null or billing_state ~ '^[A-Z]{2}$')
  );

alter table public.cred_credentials
  add constraint cred_credentials_state_format check (state is null or state ~ '^[A-Z]{2}$'),
  add constraint cred_credentials_dates_order check (issue_date is null or expiration_date is null or expiration_date >= issue_date);

alter table public.cred_credentials
  add constraint cred_credentials_dea_format check (type <> 'dea' or number is null or number ~ '^[A-Z][A-Z9]\d{7}$') not valid;

alter table public.cred_payers_org
  add constraint cred_payers_org_revalidation_range check (revalidation_months is null or revalidation_months between 1 and 120);
