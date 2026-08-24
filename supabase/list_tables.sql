-- Run this in the Supabase SQL editor to see every table in the public
-- schema, so we can tell which ones belong to H110 vs leftovers from other
-- projects. Not a migration — just a diagnostic query.
select
  c.relname as table_name,
  obj_description(c.oid) as comment,
  (select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = c.relname) as column_count
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;
