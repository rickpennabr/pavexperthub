-- Self-service account deletion.
-- Run in the Supabase SQL editor after database/migrations/admin-from-account.sql.
-- Safe to run again.
-- A signed-in user can delete only their own auth user.
-- Email accounts must pass the current password.
-- Google-only accounts must pass the account email.
-- profiles cascades from auth.users. Admin rows for this auth id are removed first.

create extension if not exists pgcrypto;

create or replace function public.account_delete_method()
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $fn$
declare
  v_has_password boolean;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  select coalesce(u.encrypted_password, '') <> ''
    and exists (
      select 1
      from auth.identities i
      where i.user_id = auth.uid()
        and i.provider = 'email'
    )
    into v_has_password
  from auth.users u
  where u.id = auth.uid();

  return jsonb_build_object('ok', true, 'has_password', coalesce(v_has_password, false));
end;
$fn$;

create or replace function public.delete_my_account(p_proof text)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $fn$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_hash text;
  v_has_password boolean;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'not_authenticated');
  end if;

  select email, encrypted_password
    into v_email, v_hash
  from auth.users
  where id = v_uid;

  v_has_password := coalesce(v_hash, '') <> ''
    and exists (
      select 1
      from auth.identities i
      where i.user_id = v_uid
        and i.provider = 'email'
    );

  if p_proof is null or length(trim(p_proof)) = 0 then
    return jsonb_build_object(
      'ok', false,
      'error', case when v_has_password then 'password_required' else 'email_required' end
    );
  end if;

  if v_has_password then
    begin
      if crypt(p_proof, v_hash) is distinct from v_hash then
        return jsonb_build_object('ok', false, 'error', 'incorrect_password');
      end if;
    exception
      when others then
        return jsonb_build_object('ok', false, 'error', 'incorrect_password');
    end;
  elsif lower(trim(coalesce(v_email, ''))) = ''
     or lower(trim(p_proof)) <> lower(trim(v_email)) then
    return jsonb_build_object('ok', false, 'error', 'email_mismatch');
  end if;

  delete from public.admin_sessions where admin_id = v_uid;
  delete from public.admin_users where id = v_uid;
  delete from public.profiles where id = v_uid;
  delete from auth.users where id = v_uid;

  return jsonb_build_object('ok', true);
exception
  when others then
    return jsonb_build_object('ok', false, 'error', 'delete_failed', 'detail', sqlerrm);
end;
$fn$;

drop function if exists public.account_has_password();

revoke all on function public.account_delete_method() from public, anon, authenticated;
revoke all on function public.delete_my_account(text) from public, anon, authenticated;
grant execute on function public.account_delete_method() to authenticated;
grant execute on function public.delete_my_account(text) to authenticated;
