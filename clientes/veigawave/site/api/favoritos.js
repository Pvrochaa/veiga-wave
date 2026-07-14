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

module.exports = async function handler(req, res) {
  const pool = getPool();

  if (req.method === "GET") {
    const email = (req.query.email || "").trim();
    if (!email) {
      res.status(400).json({ error: "Informe o e-mail." });
      return;
    }
    try {
      const { rows } = await pool.query(
        `select product_slug, product_name, product_desc, product_price, product_gradient, created_at
         from favorites
         where lower(customer_email) = lower($1)
         order by created_at desc`,
        [email]
      );
      res.status(200).json({
        favorites: rows.map((r) => ({
          slug: r.product_slug,
          name: r.product_name,
          desc: r.product_desc,
          price: r.product_price,
          gradient: r.product_gradient,
        })),
      });
    } catch (err) {
      console.error("Erro ao listar favoritos:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    const email = (body.email || "").trim();
    const product = body.product || {};

    if (!email || !product.slug || !product.name) {
      res.status(400).json({ error: "Dados incompletos pra favoritar." });
      return;
    }

    try {
      await pool.query(
        `insert into favorites (customer_email, product_slug, product_name, product_desc, product_price, product_gradient)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (customer_email, product_slug) do nothing`,
        [email, product.slug, product.name, product.desc || null, product.price || null, product.gradient || null]
      );
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Erro ao favoritar:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  if (req.method === "DELETE") {
    const body = parseBody(req);
    const email = (body.email || "").trim();
    const slug = (body.slug || "").trim();

    if (!email || !slug) {
      res.status(400).json({ error: "Dados incompletos pra remover favorito." });
      return;
    }

    try {
      await pool.query(
        `delete from favorites where lower(customer_email) = lower($1) and product_slug = $2`,
        [email, slug]
      );
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  res.status(405).json({ error: "Método não permitido." });
};
