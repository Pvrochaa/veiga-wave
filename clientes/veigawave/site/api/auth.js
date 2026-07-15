const { getPool } = require("../lib/db");
const { hashPassword, verifyPassword, setUserSessionCookie, clearUserSessionCookie, getUserFromRequest } = require("../lib/auth");

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
    const session = getUserFromRequest(req);
    if (!session) {
      res.status(200).json({ user: null });
      return;
    }
    try {
      const { rows } = await pool.query(`select id, name, email from users where id = $1`, [session.id]);
      res.status(200).json({ user: rows[0] || null });
    } catch (err) {
      console.error("Erro ao buscar sessão:", err);
      res.status(200).json({ user: null });
    }
    return;
  }

  if (req.method === "DELETE") {
    clearUserSessionCookie(res);
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "POST") {
    const body = parseBody(req);

    if (body.action === "signup") {
      const name = (body.name || "").trim();
      const email = (body.email || "").trim();
      const phone = (body.phone || "").trim();
      const password = body.password || "";

      if (!name || !email || password.length < 6) {
        res.status(400).json({ error: "Preenche nome, e-mail e uma senha com pelo menos 6 caracteres." });
        return;
      }

      try {
        const { rows: existing } = await pool.query(`select id from users where lower(email) = lower($1)`, [email]);
        if (existing.length > 0) {
          res.status(409).json({ error: "Já existe uma conta com esse e-mail." });
          return;
        }

        const passwordHash = await hashPassword(password);
        const { rows } = await pool.query(
          `insert into users (name, email, phone, password_hash) values ($1,$2,$3,$4) returning id, name, email`,
          [name, email, phone || null, passwordHash]
        );
        const user = rows[0];
        setUserSessionCookie(res, user);
        res.status(200).json({ user });
      } catch (err) {
        console.error("Erro ao criar conta:", err);
        res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
      }
      return;
    }

    if (body.action === "login") {
      const email = (body.email || "").trim();
      const password = body.password || "";

      try {
        const { rows } = await pool.query(`select id, name, email, password_hash from users where lower(email) = lower($1)`, [
          email,
        ]);
        const user = rows[0];
        const validPassword = user ? await verifyPassword(password, user.password_hash) : false;

        if (!user || !validPassword) {
          res.status(401).json({ error: "E-mail ou senha incorretos." });
          return;
        }

        const safeUser = { id: user.id, name: user.name, email: user.email };
        setUserSessionCookie(res, safeUser);
        res.status(200).json({ user: safeUser });
      } catch (err) {
        console.error("Erro ao entrar:", err);
        res.status(500).json({ error: "Erro interno. Tenta de novo em instantes." });
      }
      return;
    }

    res.status(400).json({ error: "Ação inválida." });
    return;
  }

  res.status(405).json({ error: "Método não permitido." });
};
