-- Site sign-in grants admin when the account is an admin.
-- Run after database/migrations/admin.sql. Safe to run again.
-- The first PavExpert account to sign in becomes the administrator.
-- Later accounts stay customers until an admin sets profiles.is_admin.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  display_name text not null default '',
  password_hash text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists admin_users_username_lower_idx
  on public.admin_users (lower(username));

create table if not exists public.admin_sessions (
  token_hash text primary key,
  admin_id uuid not null references public.admin_users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  display_name text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid());

revoke all on public.profiles from public, anon;
grant select on public.profiles to authenticated;

create or replace function public.sync_my_profile()
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_name text;
  v_admin boolean;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  v_name := left(coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'display_name', ''),
    nullif(auth.jwt() -> 'user_metadata' ->> 'full_name', ''),
    nullif(auth.jwt() -> 'user_metadata' ->> 'name', ''),
    nullif(split_part(v_email, '@', 1), ''),
    'Account'
  ), 80);

  select is_admin into v_admin
  from public.profiles
  where id = auth.uid();

  if not found then
    v_admin := not exists (select 1 from public.profiles where is_admin);
    insert into public.profiles (id, email, display_name, is_admin)
    values (auth.uid(), v_email, v_name, v_admin);
  else
    update public.profiles
    set email = v_email,
        display_name = v_name
    where id = auth.uid();
  end if;

  return jsonb_build_object(
    'ok', true,
    'is_admin', v_admin,
    'email', v_email,
    'display_name', v_name
  );
end;
$fn$;

create or replace function public.admin_session_from_auth()
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_name text;
  v_username text;
  v_token text;
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin
  ) then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select display_name into v_name
  from public.profiles
  where id = auth.uid();

  v_username := 'acct_' || substr(replace(auth.uid()::text, '-', ''), 1, 24);

  insert into public.admin_users (id, username, display_name, password_hash)
  values (
    auth.uid(),
    v_username,
    coalesce(v_name, 'Admin'),
    crypt(gen_random_uuid()::text, gen_salt('bf'))
  )
  on conflict (id) do update
    set display_name = excluded.display_name;

  v_token := encode(gen_random_bytes(32), 'hex');

  insert into public.admin_sessions (token_hash, admin_id, expires_at)
  values (
    encode(digest(v_token, 'sha256'), 'hex'),
    auth.uid(),
    now() + interval '12 hours'
  );

  delete from public.admin_sessions
  where admin_id = auth.uid()
    and expires_at < now();

  return jsonb_build_object('ok', true, 'token', v_token);
end;
$fn$;

revoke all on function public.sync_my_profile() from public;
revoke all on function public.admin_session_from_auth() from public;
grant execute on function public.sync_my_profile() to authenticated;
grant execute on function public.admin_session_from_auth() to authenticated;
