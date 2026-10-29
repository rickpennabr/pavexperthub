-- PavExpert Hub admin.
-- Run once in the Supabase SQL editor. Safe to run again.
-- Creates administrator accounts, sessions, blog posts, videos,
-- and the functions the /admin panel calls.

create extension if not exists pgcrypto;

alter table public.services add column if not exists image_url text not null default '';

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

create index if not exists admin_sessions_admin_id_idx
  on public.admin_sessions (admin_id);

alter table public.admin_users enable row level security;
alter table public.admin_sessions enable row level security;
revoke all on public.admin_users from public, anon, authenticated;
revoke all on public.admin_sessions from public, anon, authenticated;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null default '',
  author_name text not null default '',
  author_role text not null default '',
  tags text[] not null default '{}',
  read_time text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default '',
  video_url text not null default '',
  duration text not null default '',
  author_name text not null default '',
  author_role text not null default '',
  tags text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read" on public.blog_posts
  for select to anon, authenticated
  using (published = true);
grant select on public.blog_posts to anon, authenticated;

alter table public.videos enable row level security;
drop policy if exists "videos_public_read" on public.videos;
create policy "videos_public_read" on public.videos
  for select to anon, authenticated
  using (published = true);
grant select on public.videos to anon, authenticated;

insert into public.blog_posts (
  title, excerpt, body, category, author_name, author_role, tags, read_time, published, created_at
)
select *
from (
  select
    'The Ultimate Guide to Paver Installation'::text,
    'Learn the essential steps and best practices for a perfect paver installation that lasts for years. From site preparation to final sealing, we cover everything you need to know.'::text,
    $body$Installing pavers correctly is what makes an outdoor space last. Start by clearing the area, excavating to the right depth, and compacting the subgrade so water can leave the site.

A strong base keeps the surface from settling. Choose the base material for the project, compact it in lifts, and set the slope before the first paver goes down.

Lay the field from a straight starting line, keep the joints consistent, and cut the edges to fit. Finish with joint sand, a plate compactor, and sealer once the surface is clean.$body$,
    'Installation Tips'::text,
    'John Smith'::text,
    'Senior Installer'::text,
    array['Installation', 'Best Practices', 'DIY Guide']::text[],
    '8 min read'::text,
    true,
    timestamptz '2024-03-15'
  union all
  select
    'Choosing the Right Materials for Your Patio',
    'A comprehensive guide to selecting the perfect materials for your outdoor living space. Compare different types of pavers, their durability, and aesthetic appeal.',
    $body$Patio materials have to handle sun, water, and foot traffic. Concrete pavers, porcelain, and travertine each bring a different look and a different level of upkeep.

Match the thickness and finish to how the space will be used. A driveway needs a different build than a pool deck. Color should be chosen in daylight, next to the house, not from a small sample indoors.$body$,
    'Materials & Products',
    'Sarah Johnson',
    'Materials Specialist',
    array['Materials', 'Design', 'Patio']::text[],
    '6 min read',
    true,
    timestamptz '2024-03-14'
  union all
  select
    'Maintenance Tips for Long-Lasting Pavers',
    'Essential maintenance practices to keep your pavers looking beautiful year after year. Learn about cleaning, sealing, and repair techniques.',
    $body$Sweep sand and debris out of the joints before it stains. Rinse the field, and skip harsh acid unless a installer has called for it.

Reseal on the schedule for your product, and reset any pavers that rock or hold water. Small repairs stay small when they are done early.$body$,
    'Maintenance Guide',
    'Mike Wilson',
    'Maintenance Expert',
    array['Maintenance', 'Cleaning', 'Repair']::text[],
    '5 min read',
    true,
    timestamptz '2024-03-13'
) as seed
where not exists (select 1 from public.blog_posts);

insert into public.videos (
  title, description, category, video_url, duration, author_name, author_role, tags, published, created_at
)
select *
from (
  select
    'How to Install Pavers: Step by Step Guide'::text,
    'A comprehensive video guide showing the complete process of installing pavers, from site preparation to final sealing.'::text,
    'Installation'::text,
    'https://www.youtube.com/watch?v=example1'::text,
    '15:30'::text,
    'John Smith'::text,
    'Senior Installer'::text,
    array['Installation', 'Tutorial', 'DIY']::text[],
    true,
    timestamptz '2024-03-15'
  union all
  select
    'Choosing the Right Paver Materials',
    'Learn about different types of pavers, their durability, and which ones are best suited for your project.',
    'Materials',
    'https://www.youtube.com/watch?v=example2',
    '12:45',
    'Sarah Johnson',
    'Materials Specialist',
    array['Materials', 'Selection', 'Guide']::text[],
    true,
    timestamptz '2024-03-14'
  union all
  select
    'Paver Maintenance Tips',
    'Essential maintenance practices to keep your pavers looking beautiful year after year.',
    'Maintenance',
    'https://www.youtube.com/watch?v=example3',
    '10:20',
    'Mike Wilson',
    'Maintenance Expert',
    array['Maintenance', 'Cleaning', 'Care']::text[],
    true,
    timestamptz '2024-03-13'
) as seed
where not exists (select 1 from public.videos);

create or replace function public.admin_status()
returns jsonb
language sql
security definer
set search_path = public, extensions
as $fn$
  select jsonb_build_object(
    'ok', true,
    'has_admin', exists (select 1 from public.admin_users)
  );
$fn$;

create or replace function public.admin_bootstrap(
  p_username text,
  p_password text,
  p_display_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_username text := trim(coalesce(p_username, ''));
  v_display text;
  v_user_id uuid;
  v_token text;
begin
  lock table public.admin_users in exclusive mode;

  if exists (select 1 from public.admin_users) then
    return jsonb_build_object('ok', false, 'error', 'An administrator already exists. Sign in instead.');
  end if;

  if v_username !~ '^[A-Za-z0-9._-]{3,32}$' then
    return jsonb_build_object('ok', false, 'error', 'Username must be 3-32 characters: letters, numbers, dots, dashes, or underscores.');
  end if;

  if coalesce(length(p_password), 0) < 8 then
    return jsonb_build_object('ok', false, 'error', 'Password must be at least 8 characters.');
  end if;

  v_display := left(coalesce(nullif(trim(coalesce(p_display_name, '')), ''), v_username), 80);

  insert into public.admin_users (username, display_name, password_hash)
  values (v_username, v_display, crypt(p_password, gen_salt('bf')))
  returning id into v_user_id;

  v_token := encode(gen_random_bytes(32), 'hex');
  insert into public.admin_sessions (token_hash, admin_id, expires_at)
  values (encode(digest(v_token, 'sha256'), 'hex'), v_user_id, now() + interval '12 hours');

  return jsonb_build_object(
    'ok', true,
    'token', v_token,
    'username', v_username,
    'display_name', v_display
  );
end;
$fn$;

create or replace function public.admin_login(
  p_username text,
  p_password text,
  p_remember boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_user public.admin_users%rowtype;
  v_token text;
begin
  if coalesce(length(p_password), 0) < 1 or coalesce(trim(p_username), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'Invalid username or password.');
  end if;

  select * into v_user
  from public.admin_users
  where lower(username) = lower(trim(p_username))
  limit 1;

  if v_user.id is null then
    return jsonb_build_object('ok', false, 'error', 'Invalid username or password.');
  end if;

  if v_user.password_hash is distinct from crypt(p_password, v_user.password_hash) then
    return jsonb_build_object('ok', false, 'error', 'Invalid username or password.');
  end if;

  v_token := encode(gen_random_bytes(32), 'hex');
  insert into public.admin_sessions (token_hash, admin_id, expires_at)
  values (
    encode(digest(v_token, 'sha256'), 'hex'),
    v_user.id,
    now() + case when coalesce(p_remember, false) then interval '14 days' else interval '12 hours' end
  );

  return jsonb_build_object(
    'ok', true,
    'token', v_token,
    'username', v_user.username,
    'display_name', v_user.display_name
  );
end;
$fn$;

create or replace function public.admin_logout(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $fn$
begin
  delete from public.admin_sessions
  where token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex');
  return jsonb_build_object('ok', true);
end;
$fn$;

create or replace function public.admin_session(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_user public.admin_users%rowtype;
begin
  if coalesce(length(p_token), 0) < 32 then
    return jsonb_build_object('ok', false);
  end if;

  select u.* into v_user
  from public.admin_sessions s
  join public.admin_users u on u.id = s.admin_id
  where s.token_hash = encode(digest(p_token, 'sha256'), 'hex')
    and s.expires_at > now();

  if v_user.id is null then
    return jsonb_build_object('ok', false);
  end if;

  return jsonb_build_object(
    'ok', true,
    'username', v_user.username,
    'display_name', v_user.display_name
  );
end;
$fn$;

create or replace function public.admin_api(
  p_token text,
  p_action text,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_admin uuid;
  v_id integer;
  v_uuid uuid;
  v_brand_id integer;
  v_brand_name text;
  v_name text;
  v_payload_id text;
  v_branch jsonb;
  v_color_id integer;
  v_thickness_id integer;
  v_color text;
  v_mm text;
  v_inch text;
  v_size text;
  v_tags text[];
  v_blank boolean;
begin
  select s.admin_id into v_admin
  from public.admin_sessions s
  where s.token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex')
    and s.expires_at > now();

  if v_admin is null then
    return jsonb_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if p_action = 'dashboard' then
    return jsonb_build_object(
      'ok', true,
      'data', jsonb_build_object(
        'counts', jsonb_build_object(
          'products', (select count(*) from public.base_products),
          'services', (select count(*) from public.services),
          'suppliers', (select count(*) from public.suppliers),
          'posts', (select count(*) from public.blog_posts),
          'videos', (select count(*) from public.videos)
        ),
        'products', (
          select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
          from (
            select p.base_product_id, p.product_name, p.product_type, b.brand_name
            from public.base_products p
            left join public.brands b on b.brand_id = p.brand_id
            order by p.updated_at desc
            limit 5
          ) t
        ),
        'services', (
          select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
          from (
            select s.id, s.name, s.price
            from public.services s
            order by s.name
            limit 5
          ) t
        )
      )
    );
  elsif p_action = 'list_products' then
    return jsonb_build_object('ok', true, 'data', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.product_name), '[]'::jsonb)
      from (
        select
          p.base_product_id,
          p.product_name,
          p.product_type,
          p.product_note,
          b.brand_name,
          p.updated_at,
          (
            select coalesce(jsonb_agg(jsonb_build_object(
              'variant_id', v.variant_id,
              'color_name', c.color_name,
              'size', v.size,
              'thickness_mm', th.thickness_mm,
              'thickness_in', th.thickness_in
            ) order by v.variant_id), '[]'::jsonb)
            from public.product_variants v
            left join public.colors c on c.color_id = v.color_id
            left join public.thicknesses th on th.thickness_id = v.thickness_id
            where v.base_product_id = p.base_product_id
          ) as variants
        from public.base_products p
        left join public.brands b on b.brand_id = p.brand_id
      ) t
    ));
  elsif p_action = 'save_product' then
    v_name := left(trim(coalesce(p_payload->>'product_name', '')), 160);
    if v_name = '' then
      return jsonb_build_object('ok', false, 'error', 'Product name is required.');
    end if;

    v_brand_name := nullif(left(trim(coalesce(p_payload->>'brand_name', '')), 120), '');
    v_brand_id := null;
    if v_brand_name is not null then
      select brand_id into v_brand_id
      from public.brands
      where lower(brand_name) = lower(v_brand_name)
      limit 1;
      if v_brand_id is null then
        insert into public.brands (brand_name)
        values (v_brand_name)
        returning brand_id into v_brand_id;
      end if;
    end if;

    v_payload_id := nullif(trim(coalesce(p_payload->>'base_product_id', '')), '');
    if v_payload_id is null then
      insert into public.base_products (brand_id, product_name, product_type, product_note)
      values (
        v_brand_id,
        v_name,
        left(trim(coalesce(p_payload->>'product_type', '')), 80),
        left(coalesce(p_payload->>'product_note', ''), 2000)
      )
      returning base_product_id into v_id;
    else
      v_id := v_payload_id::integer;
      update public.base_products
      set
        brand_id = v_brand_id,
        product_name = v_name,
        product_type = left(trim(coalesce(p_payload->>'product_type', '')), 80),
        product_note = left(coalesce(p_payload->>'product_note', ''), 2000),
        updated_at = now()
      where base_product_id = v_id;
      if not found then
        return jsonb_build_object('ok', false, 'error', 'Product not found.');
      end if;
    end if;

    return jsonb_build_object('ok', true, 'data', jsonb_build_object('id', v_id));
  elsif p_action = 'delete_product' then
    delete from public.base_products
    where base_product_id = (p_payload->>'id')::integer;
    return jsonb_build_object('ok', true);
  elsif p_action = 'add_variant' then
    v_id := (p_payload->>'base_product_id')::integer;
    if not exists (select 1 from public.base_products where base_product_id = v_id) then
      return jsonb_build_object('ok', false, 'error', 'Product not found.');
    end if;

    v_color := nullif(left(trim(coalesce(p_payload->>'color_name', '')), 80), '');
    v_size := left(trim(coalesce(p_payload->>'size', '')), 80);
    v_mm := nullif(left(trim(coalesce(p_payload->>'thickness_mm', '')), 20), '');
    v_inch := nullif(left(trim(coalesce(p_payload->>'thickness_in', '')), 20), '');

    if v_color is null and v_size = '' then
      return jsonb_build_object('ok', false, 'error', 'Add a color or a size.');
    end if;
    if (v_mm is null) <> (v_inch is null) then
      return jsonb_build_object('ok', false, 'error', 'Enter both thickness values, in millimeters and inches.');
    end if;

    v_color_id := null;
    if v_color is not null then
      select color_id into v_color_id
      from public.colors
      where lower(color_name) = lower(v_color)
      limit 1;
      if v_color_id is null then
        insert into public.colors (color_name) values (v_color)
        returning color_id into v_color_id;
      end if;
    end if;

    v_thickness_id := null;
    if v_mm is not null and v_inch is not null then
      select thickness_id into v_thickness_id
      from public.thicknesses
      where thickness_mm = v_mm and thickness_in = v_inch
      limit 1;
      if v_thickness_id is null then
        insert into public.thicknesses (thickness_mm, thickness_in)
        values (v_mm, v_inch)
        returning thickness_id into v_thickness_id;
      end if;
    end if;

    insert into public.product_variants (
      base_product_id, color_id, thickness_id, product_name, size
    )
    values (
      v_id,
      v_color_id,
      v_thickness_id,
      (select product_name from public.base_products where base_product_id = v_id),
      v_size
    );

    update public.base_products set updated_at = now() where base_product_id = v_id;
    return jsonb_build_object('ok', true);
  elsif p_action = 'delete_variant' then
    delete from public.product_variants
    where variant_id = (p_payload->>'id')::integer;
    return jsonb_build_object('ok', true);
  elsif p_action = 'list_services' then
    return jsonb_build_object('ok', true, 'data', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.name), '[]'::jsonb)
      from (
        select id, name, description, price, link, details, image_url
        from public.services
      ) t
    ));
  elsif p_action = 'save_service' then
    v_name := left(trim(coalesce(p_payload->>'name', '')), 160);
    if v_name = '' then
      return jsonb_build_object('ok', false, 'error', 'Service name is required.');
    end if;

    v_payload_id := nullif(trim(coalesce(p_payload->>'id', '')), '');
    v_uuid := case when v_payload_id is null then null else v_payload_id::uuid end;

    if exists (
      select 1 from public.services
      where lower(name) = lower(v_name)
        and id is distinct from v_uuid
    ) then
      return jsonb_build_object('ok', false, 'error', 'A service with that name already exists.');
    end if;

    if v_uuid is null then
      insert into public.services (name, description, price, link, details, image_url)
      values (
        v_name,
        left(coalesce(p_payload->>'description', ''), 2000),
        left(trim(coalesce(p_payload->>'price', '')), 80),
        left(trim(coalesce(p_payload->>'link', '')), 300),
        left(coalesce(p_payload->>'details', ''), 4000),
        left(trim(coalesce(p_payload->>'image_url', '')), 1000)
      )
      returning id into v_uuid;
    else
      update public.services
      set
        name = v_name,
        description = left(coalesce(p_payload->>'description', ''), 2000),
        price = left(trim(coalesce(p_payload->>'price', '')), 80),
        link = left(trim(coalesce(p_payload->>'link', '')), 300),
        details = left(coalesce(p_payload->>'details', ''), 4000),
        image_url = left(trim(coalesce(p_payload->>'image_url', '')), 1000),
        updated_at = now()
      where id = v_uuid;
      if not found then
        return jsonb_build_object('ok', false, 'error', 'Service not found.');
      end if;
    end if;

    return jsonb_build_object('ok', true, 'data', jsonb_build_object('id', v_uuid));
  elsif p_action = 'delete_service' then
    delete from public.services where id = (p_payload->>'id')::uuid;
    return jsonb_build_object('ok', true);
  elsif p_action = 'list_suppliers' then
    return jsonb_build_object('ok', true, 'data', (
      select coalesce(jsonb_agg(to_jsonb(s) order by s.supplier_name), '[]'::jsonb)
      from (
        select
          sup.id,
          sup.supplier_name,
          sup.created_at,
          coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', w.id,
              'website_url', w.website_url
            ) order by w.website_url)
            from public.supplier_websites w
            where w.supplier_id = sup.id
          ), '[]'::jsonb) as websites,
          coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', b.id,
              'branch_name', b.branch_name,
              'cross_street', b.cross_street,
              'phone', b.phone,
              'address', b.address,
              'is_main_branch', b.is_main_branch
            ) order by b.is_main_branch desc, b.branch_name)
            from public.supplier_branches b
            where b.supplier_id = sup.id
          ), '[]'::jsonb) as branches
        from public.suppliers sup
      ) s
    ));
  elsif p_action = 'save_supplier' then
    v_name := left(trim(coalesce(p_payload->>'supplier_name', '')), 160);
    if v_name = '' then
      return jsonb_build_object('ok', false, 'error', 'Supplier name is required.');
    end if;

    v_payload_id := nullif(trim(coalesce(p_payload->>'id', '')), '');
    if v_payload_id is null then
      insert into public.suppliers (supplier_name) values (v_name) returning id into v_uuid;
    else
      v_uuid := v_payload_id::uuid;
      update public.suppliers set supplier_name = v_name where id = v_uuid;
      if not found then
        return jsonb_build_object('ok', false, 'error', 'Supplier not found.');
      end if;
    end if;

    delete from public.supplier_websites where supplier_id = v_uuid;
    if nullif(left(trim(coalesce(p_payload->>'website_url', '')), 300), '') is not null then
      insert into public.supplier_websites (supplier_id, website_url)
      values (v_uuid, left(trim(p_payload->>'website_url'), 300));
    end if;

    delete from public.supplier_branches sb
    where sb.supplier_id = v_uuid
      and not exists (
        select 1
        from jsonb_array_elements(coalesce(p_payload->'branches', '[]'::jsonb)) as branch_row
        where nullif(trim(coalesce(branch_row.value->>'id', '')), '') is not null
          and (branch_row.value->>'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
          and (branch_row.value->>'id')::uuid = sb.id
      );

    for v_branch in
      select value
      from jsonb_array_elements(coalesce(p_payload->'branches', '[]'::jsonb))
    loop
      v_blank := nullif(trim(coalesce(v_branch->>'branch_name', '')), '') is null
        and nullif(trim(coalesce(v_branch->>'cross_street', '')), '') is null
        and nullif(trim(coalesce(v_branch->>'phone', '')), '') is null
        and nullif(trim(coalesce(v_branch->>'address', '')), '') is null;

      if v_blank then
        if nullif(trim(coalesce(v_branch->>'id', '')), '') is not null
           and (v_branch->>'id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
          delete from public.supplier_branches
          where id = (v_branch->>'id')::uuid
            and supplier_id = v_uuid;
        end if;
        continue;
      end if;

      if nullif(trim(coalesce(v_branch->>'id', '')), '') is null then
        insert into public.supplier_branches (
          supplier_id, branch_name, cross_street, phone, address, is_main_branch
        ) values (
          v_uuid,
          left(trim(coalesce(v_branch->>'branch_name', '')), 160),
          left(trim(coalesce(v_branch->>'cross_street', '')), 160),
          left(trim(coalesce(v_branch->>'phone', '')), 40),
          left(trim(coalesce(v_branch->>'address', '')), 240),
          coalesce((v_branch->>'is_main_branch')::boolean, false)
        );
      else
        update public.supplier_branches
        set
          branch_name = left(trim(coalesce(v_branch->>'branch_name', '')), 160),
          cross_street = left(trim(coalesce(v_branch->>'cross_street', '')), 160),
          phone = left(trim(coalesce(v_branch->>'phone', '')), 40),
          address = left(trim(coalesce(v_branch->>'address', '')), 240),
          is_main_branch = coalesce((v_branch->>'is_main_branch')::boolean, false)
        where id = (v_branch->>'id')::uuid
          and supplier_id = v_uuid;
      end if;
    end loop;

    return jsonb_build_object('ok', true, 'data', jsonb_build_object('id', v_uuid));
  elsif p_action = 'delete_supplier' then
    delete from public.suppliers where id = (p_payload->>'id')::uuid;
    return jsonb_build_object('ok', true);
  elsif p_action = 'list_posts' then
    return jsonb_build_object('ok', true, 'data', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.created_at desc), '[]'::jsonb)
      from (
        select
          id, title, excerpt, body, category, author_name, author_role,
          tags, read_time, published, created_at
        from public.blog_posts
      ) t
    ));
  elsif p_action = 'save_post' or p_action = 'save_video' then
    if p_action = 'save_post' then
      v_name := left(trim(coalesce(p_payload->>'title', '')), 180);
    else
      v_name := left(trim(coalesce(p_payload->>'title', '')), 180);
    end if;
    if v_name = '' then
      return jsonb_build_object('ok', false, 'error', 'Title is required.');
    end if;

    select coalesce(array_agg(left(trim(tag), 32)), '{}'::text[])
    into v_tags
    from (
      select value as tag
      from jsonb_array_elements_text(coalesce(p_payload->'tags', '[]'::jsonb))
      where trim(value) <> ''
      limit 12
    ) tags_src;

    v_payload_id := nullif(trim(coalesce(p_payload->>'id', '')), '');

    if p_action = 'save_post' then
      if v_payload_id is null then
        insert into public.blog_posts (
          title, excerpt, body, category, author_name, author_role, tags, read_time, published
        ) values (
          v_name,
          left(trim(coalesce(p_payload->>'excerpt', '')), 500),
          left(coalesce(p_payload->>'body', ''), 20000),
          left(trim(coalesce(p_payload->>'category', '')), 80),
          left(trim(coalesce(p_payload->>'author_name', '')), 80),
          left(trim(coalesce(p_payload->>'author_role', '')), 80),
          coalesce(v_tags, '{}'::text[]),
          left(trim(coalesce(p_payload->>'read_time', '')), 40),
          coalesce((p_payload->>'published')::boolean, true)
        )
        returning id into v_uuid;
      else
        v_uuid := v_payload_id::uuid;
        update public.blog_posts
        set
          title = v_name,
          excerpt = left(trim(coalesce(p_payload->>'excerpt', '')), 500),
          body = left(coalesce(p_payload->>'body', ''), 20000),
          category = left(trim(coalesce(p_payload->>'category', '')), 80),
          author_name = left(trim(coalesce(p_payload->>'author_name', '')), 80),
          author_role = left(trim(coalesce(p_payload->>'author_role', '')), 80),
          tags = coalesce(v_tags, '{}'::text[]),
          read_time = left(trim(coalesce(p_payload->>'read_time', '')), 40),
          published = coalesce((p_payload->>'published')::boolean, true),
          updated_at = now()
        where id = v_uuid;
        if not found then
          return jsonb_build_object('ok', false, 'error', 'Post not found.');
        end if;
      end if;
    else
      if v_payload_id is null then
        insert into public.videos (
          title, description, category, video_url, duration, author_name, author_role, tags, published
        ) values (
          v_name,
          left(coalesce(p_payload->>'description', ''), 2000),
          left(trim(coalesce(p_payload->>'category', '')), 80),
          left(trim(coalesce(p_payload->>'video_url', '')), 400),
          left(trim(coalesce(p_payload->>'duration', '')), 20),
          left(trim(coalesce(p_payload->>'author_name', '')), 80),
          left(trim(coalesce(p_payload->>'author_role', '')), 80),
          coalesce(v_tags, '{}'::text[]),
          coalesce((p_payload->>'published')::boolean, true)
        )
        returning id into v_uuid;
      else
        v_uuid := v_payload_id::uuid;
        update public.videos
        set
          title = v_name,
          description = left(coalesce(p_payload->>'description', ''), 2000),
          category = left(trim(coalesce(p_payload->>'category', '')), 80),
          video_url = left(trim(coalesce(p_payload->>'video_url', '')), 400),
          duration = left(trim(coalesce(p_payload->>'duration', '')), 20),
          author_name = left(trim(coalesce(p_payload->>'author_name', '')), 80),
          author_role = left(trim(coalesce(p_payload->>'author_role', '')), 80),
          tags = coalesce(v_tags, '{}'::text[]),
          published = coalesce((p_payload->>'published')::boolean, true),
          updated_at = now()
        where id = v_uuid;
        if not found then
          return jsonb_build_object('ok', false, 'error', 'Video not found.');
        end if;
      end if;
    end if;

    return jsonb_build_object('ok', true, 'data', jsonb_build_object('id', v_uuid));
  elsif p_action = 'delete_post' then
    delete from public.blog_posts where id = (p_payload->>'id')::uuid;
    return jsonb_build_object('ok', true);
  elsif p_action = 'delete_video' then
    delete from public.videos where id = (p_payload->>'id')::uuid;
    return jsonb_build_object('ok', true);
  elsif p_action = 'list_videos' then
    return jsonb_build_object('ok', true, 'data', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.created_at desc), '[]'::jsonb)
      from (
        select
          id, title, description, category, video_url, duration,
          author_name, author_role, tags, published, created_at
        from public.videos
      ) t
    ));
  else
    return jsonb_build_object('ok', false, 'error', 'Unknown action.');
  end if;
exception
  when unique_violation then
    return jsonb_build_object('ok', false, 'error', 'That record already exists.');
  when others then
    return jsonb_build_object('ok', false, 'error', sqlerrm);
end;
$fn$;

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

revoke all on function public.admin_status() from public;
revoke all on function public.admin_bootstrap(text, text, text) from public;
revoke all on function public.admin_login(text, text, boolean) from public;
revoke all on function public.admin_logout(text) from public;
revoke all on function public.admin_session(text) from public;
revoke all on function public.admin_api(text, text, jsonb) from public;

grant execute on function public.admin_status() to anon, authenticated;
grant execute on function public.admin_bootstrap(text, text, text) to anon, authenticated;
grant execute on function public.admin_login(text, text, boolean) to anon, authenticated;
grant execute on function public.admin_logout(text) to anon, authenticated;
grant execute on function public.admin_session(text) to anon, authenticated;
grant execute on function public.admin_api(text, text, jsonb) to anon, authenticated;

revoke all on function public.admin_set_service_image(text, uuid, text) from public;
grant execute on function public.admin_set_service_image(text, uuid, text) to anon, authenticated;

notify pgrst, 'reload schema';
