-- D2 (H110_CONVERSION_PEDIDO_DEV_1): the trial emails go through the same
-- claim-before-send log as alerts and digests, so a repeated webhook or a
-- cron that runs twice sends nothing twice.
--   trial_start   welcome to the owner + the internal "new trial" notice
--   trial_ending  3 days before trial_ends_at, to the owner

alter table public.cred_notification_log drop constraint cred_notification_log_kind_check;
alter table public.cred_notification_log
  add constraint cred_notification_log_kind_check
  check (kind in ('alert', 'digest', 'trial_start', 'trial_ending'));
