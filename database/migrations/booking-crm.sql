-- Installer vs customer accounts, ProCRM customers, and ProBooking requests.
-- Safe to run again.

alter table public.profiles
  add column if not exists account_role text not null default 'customer';

alter table public.profiles
  drop constraint if exists profiles_account_role_check;

alter table public.profiles
  add constraint profiles_account_role_check
  check (account_role in ('customer', 'installer'));

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
  v_meta_role text := auth.jwt() -> 'user_metadata' ->> 'account_role';
  v_role text := 'customer';
begin
  if auth.uid() is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if v_meta_role in ('customer', 'installer') then
    v_role := v_meta_role;
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
    insert into public.profiles (id, email, display_name, is_admin, account_role)
    values (auth.uid(), v_email, v_name, v_admin, v_role);
  else
    update public.profiles
    set email = v_email,
        display_name = v_name,
        account_role = case
          when v_meta_role in ('customer', 'installer') then v_meta_role
          else account_role
        end
    where id = auth.uid()
    returning account_role into v_role;
  end if;

  return jsonb_build_object(
    'ok', true,
    'is_admin', v_admin,
    'email', v_email,
    'display_name', v_name,
    'account_role', v_role
  );
end;
$fn$;

create or replace function public.is_installer()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and account_role = 'installer'
  );
$$;

revoke all on function public.is_installer() from public;
grant execute on function public.is_installer() to authenticated;

create table if not exists public.crm_customers (
  id uuid primary key default gen_random_uuid(),
  installer_id uuid not null references auth.users (id) on delete cascade,
  customer_type text not null default 'individual',
  first_name text not null default '',
  last_name text not null default '',
  company_name text not null default '',
  display_name text not null default '',
  email text not null default '',
  phone text not null default '',
  address_line1 text not null default '',
  city text not null default '',
  state text not null default '',
  zip_code text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_customers_type_check check (customer_type in ('individual', 'business'))
);

create index if not exists crm_customers_installer_idx
  on public.crm_customers (installer_id, created_at desc);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users (id) on delete set null,
  installer_id uuid references auth.users (id) on delete set null,
  crm_customer_id uuid references public.crm_customers (id) on delete set null,
  customer_name text not null default '',
  service text not null,
  appointment_date date not null,
  appointment_time text not null default '',
  address_line1 text not null default '',
  city text not null default '',
  state text not null default '',
  zip_code text not null default '',
  notes text not null default '',
  status text not null default 'requested',
  created_at timestamptz not null default now(),
  constraint bookings_status_check check (status in ('requested', 'confirmed', 'done', 'cancelled'))
);

create index if not exists bookings_customer_idx on public.bookings (customer_id, appointment_date);
create index if not exists bookings_status_idx on public.bookings (status, appointment_date);

alter table public.crm_customers enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "crm_customers_own" on public.crm_customers;
create policy "crm_customers_own" on public.crm_customers
  for all to authenticated
  using (installer_id = auth.uid() and public.is_installer())
  with check (installer_id = auth.uid() and public.is_installer());

drop policy if exists "bookings_select" on public.bookings;
create policy "bookings_select" on public.bookings
  for select to authenticated
  using (customer_id = auth.uid() or public.is_installer());

drop policy if exists "bookings_insert" on public.bookings;
create policy "bookings_insert" on public.bookings
  for insert to authenticated
  with check (
    (customer_id = auth.uid() and installer_id is null and status = 'requested')
    or (public.is_installer() and installer_id = auth.uid())
  );

drop policy if exists "bookings_update" on public.bookings;
create policy "bookings_update" on public.bookings
  for update to authenticated
  using (customer_id = auth.uid() or public.is_installer())
  with check (customer_id = auth.uid() or public.is_installer());

create or replace function public.guard_booking_update()
returns trigger
language plpgsql
security invoker
set search_path = public
as $fn$
begin
  if public.is_installer() then
    return new;
  end if;

  if old.customer_id is distinct from auth.uid() then
    raise exception 'not allowed';
  end if;

  if old.status <> 'requested' or new.status <> 'cancelled' then
    raise exception 'You can only cancel a request that is still open.';
  end if;

  new.customer_id := old.customer_id;
  new.installer_id := old.installer_id;
  new.crm_customer_id := old.crm_customer_id;
  new.customer_name := old.customer_name;
  new.service := old.service;
  new.appointment_date := old.appointment_date;
  new.appointment_time := old.appointment_time;
  new.address_line1 := old.address_line1;
  new.city := old.city;
  new.state := old.state;
  new.zip_code := old.zip_code;
  new.notes := old.notes;
  new.status := 'cancelled';
  return new;
end;
$fn$;

drop trigger if exists bookings_guard_update on public.bookings;
create trigger bookings_guard_update
  before update on public.bookings
  for each row execute function public.guard_booking_update();

grant select, insert, update, delete on public.crm_customers to authenticated;
grant select, insert, update on public.bookings to authenticated;
