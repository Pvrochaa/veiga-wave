const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { parseCookies } = require("./admin-auth");

const COOKIE_NAME = "user_session";
const SESSION_DAYS = 30;

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function sign(payload) {
  const secret = process.env.SESSION_SECRET || "";
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function setUserSessionCookie(res, user) {
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${user.id}:${user.email}:${expiry}`;
  const sig = sign(payload);
  const value = Buffer.from(`${payload}:${sig}`).toString("base64url");
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_DAYS * 24 * 60 * 60}`
  );
}

function clearUserSessionCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}

function getUserFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 4) return null;
    const [id, email, expiryStr, sig] = parts;
    if (Date.now() > Number(expiryStr)) return null;
    const expectedSig = sign(`${id}:${email}:${expiryStr}`);
    if (sig !== expectedSig) return null;
    return { id: Number(id), email };
  } catch {
    return null;
  }
}

module.exports = { hashPassword, verifyPassword, setUserSessionCookie, clearUserSessionCookie, getUserFromRequest };
