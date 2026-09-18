-- PREVIEW ONLY (Fase 8, 2026-09-17): a photo per provider so the founder can see
-- the lists with faces before deciding whether providers get photos at all.
-- Filled with stock portraits on the sandbox test account only. If the answer
-- is no, a later migration drops this column; if yes, it gets an upload flow.
alter table public.cred_providers add column if not exists photo_url text;
