-- Migra o catálogo que hoje está hardcoded em assets/js/main.js pra tabela
-- de verdade, deduplicando as repetições entre lançamentos/mais vendidos/sale.

insert into products (slug, name, desc_text, price_cents, original_price_cents, category, piece, gradient_from, gradient_to, is_new, is_bestseller, sort_order)
values
  ('top-golden-hour', 'Top Golden Hour', 'Cortininha • Dourado degradê', 14900, null, 'biquinis', 'tops', '#ffc15e', '#ff8a5b', true, false, 10),
  ('calcinha-mare-alta', 'Calcinha Maré Alta', 'Asa-delta • Coral', 11900, null, 'biquinis', 'calcinhas', '#ff8a5b', '#ff6b9d', true, false, 20),
  ('conjunto-entardecer', 'Conjunto Entardecer', 'Hot pant • Rosé', 25900, null, 'biquinis', 'conjuntos', '#ff6b9d', '#ffc15e', true, false, 30),
  ('top-horizonte', 'Top Horizonte', 'Triângulo • Turquesa', 14900, null, 'biquinis', 'tops', '#2ec4b6', '#1b6ca8', true, false, 40),
  ('saida-mare-baixa', 'Saída Maré Baixa', 'Kimono leve • Areia', 18900, null, 'saidas', null, '#ffc15e', '#2ec4b6', true, false, 50),

  ('conjunto-deep-blue', 'Conjunto Deep Blue', 'Lateral larga • Azul profundo', 24900, 28900, 'biquinis', 'conjuntos', '#1b6ca8', '#0b3d5c', false, true, 60),
  ('top-recorte-ondas', 'Top Recorte Ondas', 'Cortininha • Turquesa', 13900, null, 'biquinis', 'tops', '#2ec4b6', '#1b6ca8', false, true, 70),
  ('calcinha-sunset', 'Calcinha Sunset', 'Fio • Coral degradê', 10900, null, 'biquinis', 'calcinhas', '#ff8a5b', '#ffc15e', false, true, 80),
  ('maio-costas-nadador', 'Maiô Costas Nadador', 'Recorte lateral • Rosé', 21900, null, 'maiobody', null, '#ff6b9d', '#ff8a5b', false, true, 90),
  ('conjunto-ilha', 'Conjunto Ilha', 'Asa-delta • Verde mar', 25900, 29900, 'biquinis', 'conjuntos', '#2ec4b6', '#0b3d5c', false, true, 100),

  ('calcinha-hot-pant-areia', 'Calcinha Hot Pant Areia', 'Hot pant • Areia', 11500, null, 'biquinis', 'calcinhas', '#e7ddc9', '#c9a45c', false, false, 110),
  ('maio-decote-profundo', 'Maiô Decote Profundo', 'Decote V • Preto solar', 22900, null, 'maiobody', null, '#07211f', '#0a8478', false, false, 120),
  ('body-recorte-cintura', 'Body Recorte Cintura', 'Cava alta • Turquesa', 23900, null, 'maiobody', null, '#14c6b2', '#0a8478', true, false, 130),
  ('maio-amarracao-lateral', 'Maiô Amarração Lateral', 'Sustentação • Coral', 21900, null, 'maiobody', null, '#ff6a45', '#ffc46b', false, false, 140),
  ('body-manga-longa', 'Body Manga Longa', 'Proteção UV • Areia', 25900, null, 'maiobody', null, '#e7ddc9', '#0a8478', true, false, 150),

  ('canga-horizonte', 'Canga Horizonte', 'Estampa degradê • 100% viscose', 9900, null, 'saidas', null, '#ff6a45', '#14c6b2', false, false, 160),
  ('chapeu-palha-solar', 'Chapéu Palha Solar', 'Aba larga • Natural', 8900, null, 'saidas', null, '#e7ddc9', '#c9a45c', false, false, 170),
  ('bolsa-de-praia-tecida', 'Bolsa de Praia Tecida', 'Palha + couro sintético', 15900, null, 'saidas', null, '#0a8478', '#07211f', false, false, 180),
  ('vestido-transpassado', 'Vestido Transpassado', 'Saída longa • Coral', 17900, null, 'saidas', null, '#ff6b9d', '#ff6a45', true, false, 190),

  ('conjunto-mare-cheia', 'Conjunto Maré Cheia', 'Asa-delta • Turquesa', 15900, 25900, 'biquinis', 'conjuntos', '#14c6b2', '#0a8478', false, false, 200),
  ('top-areia-dourada', 'Top Areia Dourada', 'Cortininha • Areia', 8900, 13900, 'biquinis', 'tops', '#e7ddc9', '#ffc46b', false, false, 210),
  ('calcinha-fio-coral', 'Calcinha Fio Coral', 'Fio • Coral', 6900, 10900, 'biquinis', 'calcinhas', '#ff8a5b', '#ff6b9d', false, false, 220),
  ('maio-classico-profundo', 'Maiô Clássico Profundo', 'Decote reto • Profundo', 14900, 22900, 'maiobody', null, '#07211f', '#0a8478', false, false, 230),
  ('saida-kimono-por-do-sol', 'Saída Kimono Pôr do Sol', 'Viscose leve • Degradê', 11900, 18900, 'saidas', null, '#ff6a45', '#ffc46b', false, false, 240),
  ('conjunto-ultima-onda', 'Conjunto Última Onda', 'Hot pant • Rosé', 16900, 25900, 'biquinis', 'conjuntos', '#ff6b9d', '#ffc15e', false, false, 250)
on conflict (slug) do nothing;
