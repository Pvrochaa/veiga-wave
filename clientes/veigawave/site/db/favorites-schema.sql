create table if not exists favorites (
  id serial primary key,
  customer_email text not null,
  product_slug text not null,
  product_name text not null,
  product_desc text,
  product_price text,
  product_gradient text,
  created_at timestamptz not null default now(),
  unique (customer_email, product_slug)
);

create index if not exists idx_favorites_email on favorites (lower(customer_email));
