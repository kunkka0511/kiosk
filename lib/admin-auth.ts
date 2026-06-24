import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "mandala_admin_session";
const MAX_AGE = 60 * 60 * 8;

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function adminConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME?.trim() &&
    process.env.ADMIN_PASSWORD &&
    secret().length >= 16,
  );
}

export function validAdminCredentials(username: string, password: string) {
  if (!adminConfigured()) return false;
  return safeEqual(username, process.env.ADMIN_USERNAME!.trim()) &&
    safeEqual(password, process.env.ADMIN_PASSWORD!);
}

export async function createAdminSession(username: string) {
  const payload = Buffer.from(JSON.stringify({
    username,
    expiresAt: Date.now() + MAX_AGE * 1000,
  })).toString("base64url");
  const token = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function isAdminSessionValid() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.username === process.env.ADMIN_USERNAME && data.expiresAt > Date.now();
  } catch {
    return false;
  }
}
