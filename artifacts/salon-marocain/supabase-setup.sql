-- =============================================================================
-- Riad Salons — Supabase Setup
-- Run this once in your Supabase SQL Editor (Database → SQL Editor → New query)
-- =============================================================================

-- ── Fabrics / Tissus ──────────────────────────────────────────────────────────
create table if not exists fabrics (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  color       text        not null,
  color_hex   text        not null default '#888888',
  image_url   text,
  price       numeric(10,2) not null default 0,
  unit        text        not null default 'm²',
  in_stock    boolean     not null default true,
  available   boolean     not null default true,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Designs / Motifs ──────────────────────────────────────────────────────────
create table if not exists designs (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  description    text,
  image_url      text,
  price_surcharge numeric(10,2) not null default 0,
  available      boolean     not null default true,
  sort_order     integer     not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── Services / Prestations ────────────────────────────────────────────────────
create table if not exists services (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  description text,
  price       numeric(10,2) not null default 0,
  unit        text        not null default 'forfait',
  available   boolean     not null default true,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table fabrics  enable row level security;
alter table designs  enable row level security;
alter table services enable row level security;

-- Anyone can read (public website)
create policy "Public read fabrics"  on fabrics  for select using (true);
create policy "Public read designs"  on designs  for select using (true);
create policy "Public read services" on services for select using (true);

-- Only authenticated users (admin) can write
create policy "Admin insert fabrics"  on fabrics  for insert with check (auth.role() = 'authenticated');
create policy "Admin update fabrics"  on fabrics  for update using (auth.role() = 'authenticated');
create policy "Admin delete fabrics"  on fabrics  for delete using (auth.role() = 'authenticated');

create policy "Admin insert designs"  on designs  for insert with check (auth.role() = 'authenticated');
create policy "Admin update designs"  on designs  for update using (auth.role() = 'authenticated');
create policy "Admin delete designs"  on designs  for delete using (auth.role() = 'authenticated');

create policy "Admin insert services" on services for insert with check (auth.role() = 'authenticated');
create policy "Admin update services" on services for update using (auth.role() = 'authenticated');
create policy "Admin delete services" on services for delete using (auth.role() = 'authenticated');

-- ── Storage buckets & policies ────────────────────────────────────────────────
-- Bucket "fabrics" was already created via the API
insert into storage.buckets (id, name, public) values ('designs', 'designs', true)
  on conflict (id) do nothing;

create policy "Public read fabric images"
  on storage.objects for select using (bucket_id = 'fabrics');
create policy "Admin upload fabric images"
  on storage.objects for insert with check (bucket_id = 'fabrics' and auth.role() = 'authenticated');
create policy "Admin update fabric images"
  on storage.objects for update using (bucket_id = 'fabrics' and auth.role() = 'authenticated');
create policy "Admin delete fabric images"
  on storage.objects for delete using (bucket_id = 'fabrics' and auth.role() = 'authenticated');

create policy "Public read design images"
  on storage.objects for select using (bucket_id = 'designs');
create policy "Admin upload design images"
  on storage.objects for insert with check (bucket_id = 'designs' and auth.role() = 'authenticated');
create policy "Admin update design images"
  on storage.objects for update using (bucket_id = 'designs' and auth.role() = 'authenticated');
create policy "Admin delete design images"
  on storage.objects for delete using (bucket_id = 'designs' and auth.role() = 'authenticated');

-- ── Seed example data (optional) ─────────────────────────────────────────────
insert into fabrics (name, color, color_hex, price, unit, in_stock, available, sort_order) values
  ('Velours Beige',     'Beige',     '#e8dcc8', 85,  'm²', true,  true, 1),
  ('Velours Bordeaux',  'Bordeaux',  '#7a2d3a', 95,  'm²', true,  true, 2),
  ('Tissu Terracotta',  'Terracotta','#c17a5a', 75,  'm²', true,  true, 3),
  ('Brocart Doré',      'Camel',     '#c4955a', 120, 'm²', false, true, 4);

insert into designs (name, description, price_surcharge, image_url, available, sort_order) values
  ('Sans motif',           'Tissu uni, sans décoration supplémentaire',               0,    'https://YOUR_DOMAIN/designs/sans-motif.png',        true, 1),
  ('Arabesque classique',  'Entrelacs arabesques brodés à la main',                  800,  'https://YOUR_DOMAIN/designs/arabesque.png',          true, 2),
  ('Géométrique Zellij',   'Motifs géométriques inspirés du zellige marocain',       600,  'https://YOUR_DOMAIN/designs/zellij.png',             true, 3),
  ('Floral Fassi',         'Broderies florales traditionnelles de Fès',              1000, 'https://YOUR_DOMAIN/designs/floral-fassi.png',       true, 4),
  ('Losanges berbères',    'Motifs losanges issus du patrimoine berbère',             500,  'https://YOUR_DOMAIN/designs/losanges-berberes.png',  true, 5);

insert into services (name, description, price, unit, available, sort_order) values
  ('Livraison & Installation', 'Livraison à domicile et montage par nos équipes',       500,  'forfait', true, 1),
  ('Table centrale assortie',  'Même finition bois, plateau assorti au salon',           900,  'pièce',   true, 2),
  ('Coffre de rangement',      'Coffre intégré sous l''assise, charnières silencieuses', 1500, 'pièce',   true, 3),
  ('Accoudoirs',               'Accoudoirs rembourrés assortis',                         800,  'paire',   true, 4),
  ('Boiserie premium',         'Bois massif taillé à la main',                           2000, 'forfait', true, 5);
