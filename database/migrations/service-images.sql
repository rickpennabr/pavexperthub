-- Service photos.
-- Run once in the Supabase SQL editor. Safe to run again.
-- Adds a photo on each service and the public bucket the admin upload uses.

alter table public.services add column if not exists image_url text not null default '';

create or replace function public.admin_set_service_image(
  p_token text,
  p_id uuid,
  p_image_url text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_admin uuid;
begin
  select s.admin_id into v_admin
  from public.admin_sessions s
  where s.token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex')
    and s.expires_at > now();

  if v_admin is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  update public.services
  set
    image_url = left(trim(coalesce(p_image_url, '')), 1000),
    updated_at = now()
  where id = p_id;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Service not found.');
  end if;

  return jsonb_build_object('ok', true);
exception
  when others then
    return jsonb_build_object('ok', false, 'error', sqlerrm);
end;
$fn$;

revoke all on function public.admin_set_service_image(text, uuid, text) from public;
grant execute on function public.admin_set_service_image(text, uuid, text) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "service_images_public_read" on storage.objects;
create policy "service_images_public_read" on storage.objects for select to public using (bucket_id = 'service-images');
drop policy if exists "service_images_insert" on storage.objects;
create policy "service_images_insert" on storage.objects for insert to anon, authenticated with check (bucket_id = 'service-images');
drop policy if exists "service_images_update" on storage.objects;
create policy "service_images_update" on storage.objects for update to anon, authenticated using (bucket_id = 'service-images');
drop policy if exists "service_images_delete" on storage.objects;
create policy "service_images_delete" on storage.objects for delete to anon, authenticated using (bucket_id = 'service-images');

notify pgrst, 'reload schema';
