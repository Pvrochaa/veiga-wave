-- Migra favorites de "identificado por e-mail digitado" pra "identificado
-- pelo usuário logado de verdade" (users.id). Os favoritos de teste criados
-- antes de existir login real (sem usuário associado) são descartados.

alter table favorites add column if not exists user_id integer references users(id) on delete cascade;

delete from favorites where user_id is null;

alter table favorites alter column user_id set not null;
alter table favorites drop constraint if exists favorites_customer_email_product_slug_key;
alter table favorites drop column if exists customer_email;
alter table favorites add constraint favorites_user_product_unique unique (user_id, product_slug);
