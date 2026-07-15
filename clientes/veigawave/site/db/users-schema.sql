create table if not exists users (
  id serial primary key,
  name text not null,
  email text unique not null,
  phone text,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_email on users (lower(email));
