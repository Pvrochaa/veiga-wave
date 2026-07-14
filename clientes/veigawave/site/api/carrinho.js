const { getPool } = require("../lib/db");

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function mapRow(r) {
  return {
    slug: r.product_slug,
    name: r.product_name,
    desc: r.product_desc,
    price: r.product_price,
    gradient: r.product_gradient,
    quantity: r.quantity,
  };
}

module.exports = async function handler(req, res) {
  const pool = getPool();

  if (req.method === "GET") {
    const cartId = (req.query.cartId || "").trim();
    if (!cartId) {
      res.status(400).json({ error: "Informe o cartId." });
      return;
    }
    try {
      const { rows } = await pool.query(
        `select product_slug, product_name, product_desc, product_price, product_gradient, quantity
         from cart_items
         where cart_id = $1
         order by created_at asc`,
        [cartId]
      );
      res.status(200).json({ items: rows.map(mapRow) });
    } catch (err) {
      console.error("Erro ao listar carrinho:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    const cartId = (body.cartId || "").trim();
    const product = body.product || {};

    if (!cartId || !product.slug || !product.name) {
      res.status(400).json({ error: "Dados incompletos pra adicionar ao carrinho." });
      return;
    }

    try {
      await pool.query(
        `insert into cart_items (cart_id, product_slug, product_name, product_desc, product_price, product_gradient, quantity)
         values ($1, $2, $3, $4, $5, $6, 1)
         on conflict (cart_id, product_slug)
         do update set quantity = cart_items.quantity + 1, updated_at = now()`,
        [cartId, product.slug, product.name, product.desc || null, product.price || null, product.gradient || null]
      );
      const { rows } = await pool.query(
        `select coalesce(sum(quantity), 0)::int as total from cart_items where cart_id = $1`,
        [cartId]
      );
      res.status(200).json({ ok: true, totalItems: rows[0].total });
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  if (req.method === "PATCH") {
    const body = parseBody(req);
    const cartId = (body.cartId || "").trim();
    const slug = (body.slug || "").trim();
    const quantity = Number(body.quantity);

    if (!cartId || !slug || !Number.isFinite(quantity)) {
      res.status(400).json({ error: "Dados incompletos pra atualizar quantidade." });
      return;
    }

    try {
      if (quantity <= 0) {
        await pool.query(`delete from cart_items where cart_id = $1 and product_slug = $2`, [cartId, slug]);
      } else {
        await pool.query(
          `update cart_items set quantity = $3, updated_at = now() where cart_id = $1 and product_slug = $2`,
          [cartId, slug, quantity]
        );
      }
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  if (req.method === "DELETE") {
    const body = parseBody(req);
    const cartId = (body.cartId || "").trim();
    const slug = (body.slug || "").trim();

    if (!cartId || !slug) {
      res.status(400).json({ error: "Dados incompletos pra remover item." });
      return;
    }

    try {
      await pool.query(`delete from cart_items where cart_id = $1 and product_slug = $2`, [cartId, slug]);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Erro ao remover item:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  res.status(405).json({ error: "Método não permitido." });
};
