create table if not exists products (
  id serial primary key,
  slug text unique not null,
  name text not null,
  desc_text text,
  price_cents integer not null,
  original_price_cents integer,
  category text not null check (category in ('biquinis', 'maiobody', 'saidas')),
  piece text check (piece in ('tops', 'calcinhas', 'conjuntos')),
  image_url text,
  gradient_from text not null default '#ffc46b',
  gradient_to text not null default '#ff8a5b',
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products (category);
