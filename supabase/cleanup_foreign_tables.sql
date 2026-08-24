-- Drops leftover tables from other (abandoned) projects that share this
-- Supabase project. Confirmed empty and unrelated to H110. Not part of the
-- H110 schema history, so this lives outside supabase/migrations/.
--
-- H110 tables (do NOT touch): organizations, org_members, providers,
-- credentials, payers, enrollments, enrollment_events, notification_log.
--
-- Review the list below against `supabase/list_tables.sql` output before
-- running — this is irreversible.

drop table if exists public.founding_answers cascade;
drop table if exists public.polar_orders cascade;
drop table if exists public.profiles cascade;
drop table if exists public.quote_items cascade;
drop table if exists public.quotes cascade;
drop table if exists public.task_catalog cascade;
drop table if exists public.user_prices cascade;
drop table if exists public.waitlist cascade;
