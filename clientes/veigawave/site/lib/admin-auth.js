const crypto = require("crypto");

const COOKIE_NAME = "admin_session";
const SESSION_HOURS = 12;

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const cookies = {};
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  });
  return cookies;
}

function sign(payload) {
  const secret = process.env.ADMIN_PASSWORD || "";
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function createSessionCookieValue() {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `admin:${expiry}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

function isValidSession(token) {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [role, expiryStr, sig] = parts;
    if (role !== "admin") return false;
    if (Date.now() > Number(expiryStr)) return false;
    const expectedSig = sign(`${role}:${expiryStr}`);
    return sig === expectedSig;
  } catch {
    return false;
  }
}

function isAdminRequest(req) {
  const cookies = parseCookies(req);
  return isValidSession(cookies[COOKIE_NAME]);
}

function setSessionCookie(res) {
  const value = createSessionCookieValue();
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_HOURS * 60 * 60}`
  );
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}

module.exports = { isAdminRequest, setSessionCookie, clearSessionCookie, parseCookies };
