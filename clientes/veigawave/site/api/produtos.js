const { getPool } = require("../lib/db");
const { isAdminRequest } = require("../lib/admin-auth");

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

function slugify(str) {
  const accentMap = { a: "áàãâä", e: "éèêë", i: "íìîï", o: "óòõôö", u: "úùûü", c: "ç", n: "ñ" };
  const lookup = {};
  Object.entries(accentMap).forEach(([plain, accented]) => {
    for (const ch of accented) lookup[ch] = plain;
  });
  return String(str)
    .toLowerCase()
    .replace(/[^\x00-\x7f]/g, (ch) => lookup[ch] || ch)
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapRow(r) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    desc: r.desc_text,
    priceCents: r.price_cents,
    originalPriceCents: r.original_price_cents,
    category: r.category,
    piece: r.piece,
    imageUrl: r.image_url,
    gradientFrom: r.gradient_from,
    gradientTo: r.gradient_to,
    isNew: r.is_new,
    isBestseller: r.is_bestseller,
    sortOrder: r.sort_order,
  };
}

module.exports = async function handler(req, res) {
  const pool = getPool();

  if (req.method === "GET") {
    try {
      const { rows } = await pool.query(
        `select id, slug, name, desc_text, price_cents, original_price_cents, category, piece,
                image_url, gradient_from, gradient_to, is_new, is_bestseller, sort_order
         from products
         order by sort_order asc, created_at asc`
      );
      res.status(200).json({ products: rows.map(mapRow) });
    } catch (err) {
      console.error("Erro ao listar produtos:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    if (!body.name || !body.priceCents || !body.category) {
      res.status(400).json({ error: "Nome, preço e categoria são obrigatórios." });
      return;
    }
    const slug = body.slug ? slugify(body.slug) : slugify(body.name);

    try {
      const { rows } = await pool.query(
        `insert into products
           (slug, name, desc_text, price_cents, original_price_cents, category, piece,
            image_url, gradient_from, gradient_to, is_new, is_bestseller, sort_order)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         returning id`,
        [
          slug,
          body.name,
          body.desc || null,
          body.priceCents,
          body.originalPriceCents || null,
          body.category,
          body.piece || null,
          body.imageUrl || null,
          body.gradientFrom || "#ffc46b",
          body.gradientTo || "#ff8a5b",
          !!body.isNew,
          !!body.isBestseller,
          body.sortOrder || 0,
        ]
      );
      res.status(200).json({ ok: true, id: rows[0].id });
    } catch (err) {
      if (err.code === "23505") {
        res.status(409).json({ error: "Já existe um produto com esse slug." });
        return;
      }
      console.error("Erro ao criar produto:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  if (req.method === "PUT") {
    const body = parseBody(req);
    if (!body.id) {
      res.status(400).json({ error: "Informe o id do produto." });
      return;
    }
    try {
      await pool.query(
        `update products set
           name = $2, desc_text = $3, price_cents = $4, original_price_cents = $5,
           category = $6, piece = $7, image_url = $8, gradient_from = $9, gradient_to = $10,
           is_new = $11, is_bestseller = $12, sort_order = $13, updated_at = now()
         where id = $1`,
        [
          body.id,
          body.name,
          body.desc || null,
          body.priceCents,
          body.originalPriceCents || null,
          body.category,
          body.piece || null,
          body.imageUrl || null,
          body.gradientFrom || "#ffc46b",
          body.gradientTo || "#ff8a5b",
          !!body.isNew,
          !!body.isBestseller,
          body.sortOrder || 0,
        ]
      );
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  if (req.method === "DELETE") {
    const body = parseBody(req);
    if (!body.id) {
      res.status(400).json({ error: "Informe o id do produto." });
      return;
    }
    try {
      await pool.query(`delete from products where id = $1`, [body.id]);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Erro ao remover produto:", err);
      res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
    }
    return;
  }

  res.status(405).json({ error: "Método não permitido." });
};
