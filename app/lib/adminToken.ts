import crypto from "crypto";

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function unb64url(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4 ? 4 - (input.length % 4) : 0;
  return Buffer.from(input + "=".repeat(pad), "base64");
}

export function signAdminToken(ttlSeconds = 60 * 60 * 24) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) throw new Error("Missing ADMIN_TOKEN_SECRET");

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + ttlSeconds,
    n: crypto.randomBytes(12).toString("hex"),
  };

  const body = b64url(JSON.stringify(payload));
  const sig = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyAdminToken(token: string) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [body, sig] = parts;
  const expected = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;

  try {
    const payload = JSON.parse(unb64url(body).toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number") return false;
    if (now > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}
