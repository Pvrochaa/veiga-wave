-- Pedidos de exemplo — não existe checkout real ainda, então esses dados
-- servem só pra validar o fluxo de rastreamento de ponta a ponta.

insert into orders (order_number, customer_email, customer_name, status, carrier, tracking_code, tracking_url, items, total_cents, created_at, updated_at)
values
  ('VW1001', 'maria@example.com', 'Maria Teste', 'confirmado', null, null, null,
   '[{"name":"Top Golden Hour","qty":1,"price_cents":14900}]', 14900,
   now() - interval '1 day', now() - interval '1 day'),

  ('VW1002', 'ana@example.com', 'Ana Souza', 'separacao', null, null, null,
   '[{"name":"Conjunto Entardecer","qty":1,"price_cents":25900}]', 25900,
   now() - interval '3 days', now() - interval '1 day'),

  ('VW1003', 'julia@example.com', 'Júlia Ferreira', 'enviado', 'Correios', 'BR123456789BR',
   'https://rastreamento.correios.com.br/app/index.php',
   '[{"name":"Top Horizonte","qty":1,"price_cents":14900},{"name":"Calcinha Maré Alta","qty":1,"price_cents":11900}]', 26800,
   now() - interval '6 days', now() - interval '2 days'),

  ('VW1004', 'carol@example.com', 'Carolina Lima', 'entregue', 'Jadlog', 'JAD987654321BR',
   'https://www.jadlog.com.br/tracking',
   '[{"name":"Maiô Decote Profundo","qty":1,"price_cents":22900}]', 22900,
   now() - interval '10 days', now() - interval '4 days'),

  ('VW1005', 'bea@example.com', 'Beatriz Alves', 'enviado', 'Correios', 'BR555222111BR',
   'https://rastreamento.correios.com.br/app/index.php',
   '[{"name":"Saída Maré Baixa","qty":1,"price_cents":18900}]', 18900,
   now() - interval '4 days', now() - interval '1 day')
on conflict (order_number) do nothing;

insert into order_status_events (order_id, status, occurred_at)
select id, 'confirmado', created_at from orders where order_number = 'VW1001';

insert into order_status_events (order_id, status, occurred_at)
select id, 'confirmado', created_at from orders where order_number = 'VW1002'
union all
select id, 'separacao', updated_at from orders where order_number = 'VW1002';

insert into order_status_events (order_id, status, occurred_at)
select id, 'confirmado', created_at from orders where order_number = 'VW1003'
union all
select id, 'separacao', created_at + interval '1 day' from orders where order_number = 'VW1003'
union all
select id, 'enviado', updated_at from orders where order_number = 'VW1003';

insert into order_status_events (order_id, status, occurred_at)
select id, 'confirmado', created_at from orders where order_number = 'VW1004'
union all
select id, 'separacao', created_at + interval '1 day' from orders where order_number = 'VW1004'
union all
select id, 'enviado', created_at + interval '3 days' from orders where order_number = 'VW1004'
union all
select id, 'entregue', updated_at from orders where order_number = 'VW1004';

insert into order_status_events (order_id, status, occurred_at)
select id, 'confirmado', created_at from orders where order_number = 'VW1005'
union all
select id, 'separacao', created_at + interval '1 day' from orders where order_number = 'VW1005'
union all
select id, 'enviado', updated_at from orders where order_number = 'VW1005';
