create table if not exists cart_items (
  id serial primary key,
  cart_id text not null,
  product_slug text not null,
  product_name text not null,
  product_desc text,
  product_price text,
  product_gradient text,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_slug)
);

create index if not exists idx_cart_items_cart_id on cart_items (cart_id);
