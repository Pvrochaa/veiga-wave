create table if not exists orders (
  id serial primary key,
  order_number text unique not null,
  customer_email text not null,
  customer_name text,
  status text not null default 'confirmado'
    check (status in ('confirmado', 'separacao', 'enviado', 'entregue')),
  carrier text,
  tracking_code text,
  tracking_url text,
  items jsonb not null default '[]',
  total_cents integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_status_events (
  id serial primary key,
  order_id integer not null references orders(id) on delete cascade,
  status text not null,
  occurred_at timestamptz not null default now()
);

create index if not exists idx_orders_order_number on orders (lower(order_number));
create index if not exists idx_order_status_events_order_id on order_status_events (order_id);
