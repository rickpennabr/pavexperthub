-- Service prices cover labor and thinset or gluing material only.
-- Run once in the Supabase SQL editor. Safe to run again.

update public.services
set
  description = trim(regexp_replace(description, '[[:space:]]*The price includes[[:space:]][^.]*\.?', '', 'gi')),
  details = trim(regexp_replace(details, '[[:space:]]*The price includes[[:space:]][^.]*\.?', '', 'gi')),
  updated_at = now()
where description ~* 'The price includes'
   or details ~* 'The price includes';

update public.services
set
  description = trim(description) || ' The price is for labor and thinset or gluing material only.',
  updated_at = now()
where description !~* 'labor and thinset or gluing material only';

update public.services
set
  details = trim(details) || ' The price is for labor and thinset or gluing material only.',
  updated_at = now()
where details <> ''
  and details !~* 'labor and thinset or gluing material only';
