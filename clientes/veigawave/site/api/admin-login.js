const { setSessionCookie, clearSessionCookie, isAdminRequest } = require("../lib/admin-auth");

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
  if (req.method === "POST") {
    const { password } = parseBody(req);
    if (!process.env.ADMIN_PASSWORD) {
      res.status(500).json({ error: "ADMIN_PASSWORD não configurada no servidor." });
      return;
    }
    if (password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ error: "Senha incorreta." });
      return;
    }
    setSessionCookie(res);
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "DELETE") {
    clearSessionCookie(res);
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "GET") {
    res.status(200).json({ authenticated: isAdminRequest(req) });
    return;
  }

  res.status(405).json({ error: "Método não permitido." });
};
