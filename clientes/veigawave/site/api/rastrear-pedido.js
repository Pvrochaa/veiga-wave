const { getPool } = require("../lib/db");

const STATUS_LABELS = {
  confirmado: "Confirmado",
  separacao: "Em separação",
  enviado: "Enviado",
  entregue: "Entregue",
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
    return;
  }

  let body = req.body;
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      res.status(400).json({ error: "JSON inválido." });
      return;
    }
  }

  const orderNumber = (body.orderNumber || "").trim();
  const email = (body.email || "").trim();

  if (!orderNumber || !email) {
    res.status(400).json({ error: "Informe o número do pedido e o e-mail." });
    return;
  }

  const notFound = () =>
    res.status(404).json({
      error: "Pedido não encontrado. Confira o número do pedido e o e-mail informados.",
    });

  try {
    const pool = getPool();

    const { rows } = await pool.query(
      `select id, order_number, status, carrier, tracking_code, tracking_url, items, total_cents, created_at
       from orders
       where lower(order_number) = lower($1) and lower(customer_email) = lower($2)
       limit 1`,
      [orderNumber, email]
    );

    if (rows.length === 0) {
      notFound();
      return;
    }

    const order = rows[0];

    const { rows: events } = await pool.query(
      `select status, occurred_at from order_status_events where order_id = $1 order by occurred_at asc`,
      [order.id]
    );

    res.status(200).json({
      orderNumber: order.order_number,
      status: order.status,
      statusLabel: STATUS_LABELS[order.status] || order.status,
      carrier: order.carrier,
      trackingCode: order.tracking_code,
      trackingUrl: order.tracking_url,
      items: order.items,
      totalCents: order.total_cents,
      createdAt: order.created_at,
      timeline: events.map((e) => ({
        status: e.status,
        statusLabel: STATUS_LABELS[e.status] || e.status,
        occurredAt: e.occurred_at,
      })),
    });
  } catch (err) {
    console.error("Erro ao rastrear pedido:", err);
    res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
  }
};
