-- The follow-up sequence after the free template (H110_NURTURE_EMAILS_Y_PEDIDO_DEV,
-- 2026-09-30): e1 day 2, e2 day 6, e3 or e3b day 12, e4 day 20, counted from
-- template_leads.delivered_at. One row per email actually sent, so a step goes
-- out once even if the cron runs twice. Only the cron route
-- (app/api/cron/template-nurture, service role) touches it: RLS on, no policies.

create table public.template_lead_emails (
  lead_id uuid not null references public.template_leads (id) on delete cascade,
  step text not null check (step in ('e1', 'e2', 'e3', 'e3b', 'e4')),
  sent_at timestamptz not null default now(),
  resend_id text,
  primary key (lead_id, step)
);

alter table public.template_lead_emails enable row level security;
revoke all on public.template_lead_emails from anon, authenticated;
