import { createHmac, createHash, timingSafeEqual } from "node:crypto";

/**
 * Private-demo access gate.
 *
 * Enabled only when DEMO_MODE=true (Vercel demo deployment). Local development and a
 * future production deployment are unaffected because they don't set DEMO_MODE.
 *
 * Env vars (server-only, never NEXT_PUBLIC_):
 *   DEMO_MODE              "true" to enable the gate
 *   DEMO_PASSWORD          the shared demo password
 *   DEMO_SESSION_SECRET    long random string used to sign access cookies
 *   DEMO_SESSION_VERSION   bump (e.g. 1 -> 2) to revoke every existing session instantly
 *   DEMO_SESSION_HOURS     session lifetime, default 72
 *
 * Revoke / rotate access: change DEMO_PASSWORD and/or bump DEMO_SESSION_VERSION, then redeploy.
 */

export const DEMO_COOKIE = "av_demo_access";

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

function config() {
  const secret = process.env.DEMO_SESSION_SECRET ?? "";
  const password = process.env.DEMO_PASSWORD ?? "";
  const version = process.env.DEMO_SESSION_VERSION ?? "1";
  const hours = Number(process.env.DEMO_SESSION_HOURS ?? "72");
  return { secret, password, version, maxAgeSeconds: Math.max(1, Math.min(hours, 24 * 30)) * 3600 };
}

/** The gate refuses to open (fails closed) if the secrets are missing or too weak. */
export function isDemoConfigured(): boolean {
  const { secret, password } = config();
  return secret.length >= 32 && password.length >= 8;
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Cookie value: "<version>.<expiresAtSeconds>.<hmac>" */
export function createAccessToken(nowSeconds = Math.floor(Date.now() / 1000)) {
  const { secret, version, maxAgeSeconds } = config();
  const exp = nowSeconds + maxAgeSeconds;
  const payload = `${version}.${exp}`;
  return { value: `${payload}.${sign(payload, secret)}`, maxAge: maxAgeSeconds };
}

export function verifyAccessToken(token: string | undefined, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  if (!token || !isDemoConfigured()) return false;
  const { secret, version } = config();
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [v, expStr, sig] = parts;
  if (v !== version) return false; // revoked by version bump
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp <= nowSeconds) return false; // expired
  const expected = Buffer.from(sign(`${v}.${expStr}`, secret));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Constant-time password comparison (hash both sides so lengths always match). */
export function checkDemoPassword(input: string): boolean {
  const { password } = config();
  if (!isDemoConfigured()) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(password).digest();
  return timingSafeEqual(a, b);
}

/** Only allow same-site relative redirects after login (prevents open redirects). */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  if (next.startsWith("/demo-access") || next.startsWith("/api/demo-access")) return "/";
  return next.slice(0, 500);
}
