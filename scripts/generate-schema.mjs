/**
 * Builds database/schema.sql from the product catalog in src/data/products.ts
 * and the original services list. Run: node scripts/generate-schema.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadProducts() {
  let src = fs.readFileSync(path.join(root, 'src/data/products.ts'), 'utf8');
  src = src.replace(/export interface Product \{[\s\S]*?\n\}\r?\n/, '');
  src = src.replace('export const products: Product[] =', 'const products =');
  return new Function(`${src}\nreturn products;`)();
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function isRealImage(src) {
  return typeof src === 'string' && (src.includes('/images/') || /\.(jpe?g|png)$/i.test(src));
}

function thicknessFromLabel(label) {
  const raw = String(label).trim();
  if (raw.toLowerCase().endsWith('mm')) {
    const mm = raw.slice(0, -2).trim();
    const inches = (Number(mm) / 25.4).toFixed(2);
    return { mm, inches };
  }
  return { mm: raw, inches: raw };
}

const products = loadProducts();

const brands = [...new Set(products.map((product) => product.brand))];
const colors = [...new Set(products.flatMap((product) => [
  product.color,
  ...(product.colors_available || []),
]))];

const thicknessMap = new Map();
for (const product of products) {
  const primary = thicknessFromLabel(product.thickness);
  primary.inches = String(product.thickness_in);
  const key = `${primary.mm}|${primary.inches}`;
  thicknessMap.set(key, primary);
  for (const label of product.thicknesses_available || []) {
    const parsed = thicknessFromLabel(label);
    if (String(label).replace(/\s/g, '') === String(product.thickness).replace(/\s/g, '')) {
      parsed.inches = String(product.thickness_in);
    }
    thicknessMap.set(`${parsed.mm}|${parsed.inches}`, parsed);
  }
}
const thicknesses = [...thicknessMap.values()];

const services = [
  {
    name: 'Pavers Installation',
    description: 'Our expert team provides top-quality paver installation for driveways, pool decks, backyards, patios, walkways, and more. The price includes professional installation and base sand.',
    link: '/services/pavers-installation',
    price: '$3.50 - $5.00 per square foot',
  },
  {
    name: 'Porcelain Installation',
    description: 'Our skilled technicians offer premium porcelain tile installation for indoor and outdoor spaces. The price includes expert installation, adhesive, and grout materials.',
    link: '/services/porcelain-installation',
    price: '$5.50 - $9.50 per square foot',
  },
  {
    name: 'Travertine Installation',
    description: 'We specialize in elegant travertine installation for patios, pool decks, and outdoor living areas. The price includes professional installation, base materials, and sealing.',
    link: '/services/travertine-installation',
    price: '$5.00 - $9.00 per square foot',
  },
  {
    name: 'Pavers Repair',
    description: 'Our team offers expert repair services for damaged or settled pavers in driveways, patios, and walkways. The price includes assessment, necessary materials, and professional repair work.',
    link: '/services/pavers-repair',
    price: 'Starts at $150',
  },
  {
    name: 'Paver Sealing',
    description: 'We provide high-quality sealing services to protect and enhance your paver surfaces. The price includes thorough cleaning, professional-grade sealant application, and finish inspection.',
    link: '/services/paver-sealing',
    price: '$1.00 - $3.50 per square foot',
  },
  {
    name: 'Coping Installation',
    description: 'Our experts offer precise coping installation for pools, raised patios, and other elevated surfaces. The price includes materials, custom cutting, and professional installation.',
    link: '/services/coping-installation',
    price: '$25.00 - $45.00 per square foot',
  },
  {
    name: 'Decorative Wall Installation',
    description: 'We create stunning decorative walls for landscapes and outdoor living spaces. The price includes design consultation, materials, and expert construction.',
    link: '/services/decorative-wall-installation',
    price: '$20.00 - $25.00 per square foot',
  },
  {
    name: 'Turf Installation',
    description: 'Our team provides professional installation of high-quality artificial turf for lawns, play areas, and sports surfaces. The price includes site preparation, premium turf materials, and expert installation.',
    link: '/services/turf-installation',
    price: '$3.00 - $4.50 per square foot',
  },
  {
    name: 'Rock Spreading',
    description: 'We offer efficient and aesthetic rock spreading services for landscaping and ground cover. The price includes material selection, site preparation, and professional spreading.',
    link: '/services/rock-spreading',
    price: 'Starts at $1.00 per square foot',
  },
  {
    name: 'Drainage Installation',
    description: 'Our experts provide comprehensive drainage system installation to prevent water damage and improve landscape health. The price includes site assessment, materials, and professional installation.',
    link: '/services/drainage-installation',
    price: 'Starts at $4.00 per square foot',
  },
];

const lines = [];
const write = (line = '') => lines.push(line);

write('-- PavExpert Hub schema.');
write('-- Matches the tables queried by the products, services, suppliers, and estimate screens.');
write('-- Safe to run more than once.');
write('');
write('create extension if not exists pgcrypto;');
write('');

write(`create table if not exists public.brands (
  brand_id integer generated by default as identity primary key,
  brand_name text not null unique
);`);
write('');
write(`create table if not exists public.colors (
  color_id integer generated by default as identity primary key,
  color_name text not null unique
);`);
write('');
write(`create table if not exists public.thicknesses (
  thickness_id integer generated by default as identity primary key,
  thickness_mm text not null,
  thickness_in text not null,
  unique (thickness_mm, thickness_in)
);`);
write('');
write(`create table if not exists public.base_products (
  base_product_id integer generated by default as identity primary key,
  brand_id integer references public.brands (brand_id) on delete set null,
  product_name text not null,
  product_type text not null default '',
  product_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);`);
write('');
write(`create table if not exists public.product_variants (
  variant_id integer generated by default as identity primary key,
  base_product_id integer not null references public.base_products (base_product_id) on delete cascade,
  color_id integer references public.colors (color_id) on delete set null,
  thickness_id integer references public.thicknesses (thickness_id) on delete set null,
  product_name text not null default '',
  size text not null default '',
  sqft_pallet integer not null default 0,
  sqft_layer integer not null default 0,
  lnft_pallet integer not null default 0,
  layer_pallet integer not null default 0,
  pcs_pallet integer not null default 0,
  unique (base_product_id, color_id, thickness_id, size)
);`);
write('');
write(`create table if not exists public.product_images (
  image_id integer generated by default as identity primary key,
  variant_id integer not null references public.product_variants (variant_id) on delete cascade,
  image_path text not null,
  unique (variant_id, image_path)
);`);
write('');
write(`create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  price text not null default '',
  link text not null default '',
  details text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);`);
write('');
write(`create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  supplier_name text not null,
  created_at timestamptz not null default now()
);`);
write('');
write(`create table if not exists public.supplier_branches (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  cross_street text not null default '',
  branch_name text not null default '',
  phone text not null default '',
  address text not null default '',
  latitude double precision,
  longitude double precision,
  is_main_branch boolean not null default false
);`);
write('');
write(`create table if not exists public.brand_logos (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  logo_url text not null
);`);
write('');
write(`create table if not exists public.supplier_websites (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  website_url text not null
);`);
write('');
write(`create table if not exists public.hardscape_materials (
  id uuid primary key default gen_random_uuid(),
  material_name text not null unique
);`);
write('');
write(`create table if not exists public.supplier_materials (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.supplier_branches (id) on delete cascade,
  hardscape_material_id uuid not null references public.hardscape_materials (id) on delete cascade,
  unique (branch_id, hardscape_material_id)
);`);
write('');
write(`create table if not exists public.estimates (
  id uuid primary key default gen_random_uuid(),
  referral text,
  other_referral text,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  zip text not null,
  project_description text,
  images text[] not null default '{}',
  created_at timestamptz not null default now()
);`);
write('');

write('insert into public.brands (brand_name) values');
write(brands.map((name) => `  (${sqlString(name)})`).join(',\n'));
write('on conflict (brand_name) do nothing;');
write('');

write('insert into public.colors (color_name) values');
write(colors.map((name) => `  (${sqlString(name)})`).join(',\n'));
write('on conflict (color_name) do nothing;');
write('');

write('insert into public.thicknesses (thickness_mm, thickness_in) values');
write(thicknesses.map((item) => `  (${sqlString(item.mm)}, ${sqlString(item.inches)})`).join(',\n'));
write('on conflict (thickness_mm, thickness_in) do nothing;');
write('');

for (const product of products) {
  const id = Number(product.product_id);
  write(`insert into public.base_products (
  base_product_id, brand_id, product_name, product_type, product_note
) values (
  ${id},
  (select brand_id from public.brands where brand_name = ${sqlString(product.brand)}),
  ${sqlString(product.product_name)},
  ${sqlString(product.product_type)},
  ${sqlString(product.product_note)}
) on conflict (base_product_id) do nothing;`);
  write('');

  const colorNames = [...new Set([product.color, ...(product.colors_available || [])].filter(Boolean))];
  const thicknessLabels = [...new Set([product.thickness, ...(product.thicknesses_available || [])].filter(Boolean))];
  const variantThicknesses = thicknessLabels.map((label) => {
    const parsed = thicknessFromLabel(label);
    if (String(label).replace(/\s/g, '') === String(product.thickness).replace(/\s/g, '')) {
      parsed.inches = String(product.thickness_in);
    }
    return parsed;
  });

  colorNames.forEach((colorName, colorIndex) => {
    variantThicknesses.forEach((thickness, thicknessIndex) => {
      const isPrimary = colorIndex === 0 && thicknessIndex === 0;
      write(`insert into public.product_variants (
  base_product_id, color_id, thickness_id, product_name, size,
  sqft_pallet, sqft_layer, lnft_pallet, layer_pallet, pcs_pallet
)
select
  ${id},
  (select color_id from public.colors where color_name = ${sqlString(colorName)}),
  (select thickness_id from public.thicknesses where thickness_mm = ${sqlString(thickness.mm)} and thickness_in = ${sqlString(thickness.inches)}),
  ${sqlString(product.product_name)},
  ${sqlString(product.size)},
  ${Number(product.sqft_pallet) || 0},
  ${Number(product.sqft_layer) || 0},
  ${Number(product.lnft_pallet) || 0},
  ${Number(product.layer_pallet) || 0},
  ${Number(product.pcs_pallet) || 0}
where not exists (
  select 1 from public.product_variants
  where base_product_id = ${id}
    and color_id = (select color_id from public.colors where color_name = ${sqlString(colorName)})
    and thickness_id = (select thickness_id from public.thicknesses where thickness_mm = ${sqlString(thickness.mm)} and thickness_in = ${sqlString(thickness.inches)})
    and size = ${sqlString(product.size)}
);`);
      if (isPrimary) {
        const images = [...new Set([
          product.product_image_thumbnail,
          ...(product.product_color_images || []),
          ...(product.product_project_images || []),
        ].filter(isRealImage))];
        for (const imagePath of images) {
          write(`insert into public.product_images (variant_id, image_path)
select variant_id, ${sqlString(imagePath)}
from public.product_variants
where base_product_id = ${id}
  and color_id = (select color_id from public.colors where color_name = ${sqlString(colorName)})
  and thickness_id = (select thickness_id from public.thicknesses where thickness_mm = ${sqlString(thickness.mm)} and thickness_in = ${sqlString(thickness.inches)})
  and size = ${sqlString(product.size)}
on conflict (variant_id, image_path) do nothing;`);
        }
      }
      write('');
    });
  });
}

write(`select setval(
  pg_get_serial_sequence('public.base_products', 'base_product_id'),
  coalesce((select max(base_product_id) from public.base_products), 1)
);`);
write('');

write('insert into public.services (name, description, price, link, details) values');
write(services.map((service) => `  (${sqlString(service.name)}, ${sqlString(service.description)}, ${sqlString(service.price)}, ${sqlString(service.link)}, ${sqlString(service.description)})`).join(',\n'));
write('on conflict (name) do nothing;');
write('');

const publicTables = [
  'brands',
  'colors',
  'thicknesses',
  'base_products',
  'product_variants',
  'product_images',
  'services',
  'suppliers',
  'supplier_branches',
  'brand_logos',
  'supplier_websites',
  'hardscape_materials',
  'supplier_materials',
];

for (const table of publicTables) {
  write(`alter table public.${table} enable row level security;`);
  write(`drop policy if exists "${table}_public_read" on public.${table};`);
  write(`create policy "${table}_public_read" on public.${table} for select to anon, authenticated using (true);`);
  write(`grant select on public.${table} to anon, authenticated;`);
  write('');
}

write('alter table public.estimates enable row level security;');
write('drop policy if exists "estimates_public_insert" on public.estimates;');
write('create policy "estimates_public_insert" on public.estimates for insert to anon, authenticated with check (true);');
write('drop policy if exists "estimates_public_read" on public.estimates;');
write('create policy "estimates_public_read" on public.estimates for select to anon, authenticated using (true);');
write('grant insert, select on public.estimates to anon, authenticated;');
write('');
write('grant usage, select on all sequences in schema public to anon, authenticated;');
write('');

write(`insert into storage.buckets (id, name, public)
values
  ('estimates', 'estimates', true),
  ('brands-logo', 'brands-logo', true)
on conflict (id) do update set public = excluded.public;`);
write('');
write(`drop policy if exists "estimates_public_read" on storage.objects;`);
write(`create policy "estimates_public_read" on storage.objects for select to public using (bucket_id = 'estimates');`);
write(`drop policy if exists "estimates_public_insert" on storage.objects;`);
write(`create policy "estimates_public_insert" on storage.objects for insert to anon, authenticated with check (bucket_id = 'estimates');`);
write(`drop policy if exists "brands_logo_public_read" on storage.objects;`);
write(`create policy "brands_logo_public_read" on storage.objects for select to public using (bucket_id = 'brands-logo');`);
write('');
write(`notify pgrst, 'reload schema';`);
write('');

const outDir = path.join(root, 'database');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'schema.sql');
fs.writeFileSync(outPath, `${lines.join('\n')}\n`);
console.log(`Wrote ${outPath}`);
console.log(`products=${products.length} brands=${brands.length} colors=${colors.length} thicknesses=${thicknesses.length} services=${services.length}`);
