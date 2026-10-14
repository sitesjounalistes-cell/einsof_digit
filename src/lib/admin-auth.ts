import { createHash } from "crypto";
import { cookies } from "next/headers";

/**
 * Admin auth — version simplifiée pour la sandbox (mot de passe + cookie signé).
 * Production visée : Auth.js + argon2 + TOTP obligatoire (spec §26) — voir docs/DECISIONS.md.
 */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "eins-admin-2026";
const COOKIE = "eins-admin";
const MAX_AGE = 8 * 3600; // 8 h (spec §26)

function token(password: string): string {
  return createHash("sha256").update(`eins-admin::${password}`).digest("hex");
}

export function expectedToken(): string {
  return token(ADMIN_PASSWORD);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === expectedToken();
}

export function sessionCookie() {
  return {
    name: COOKIE,
    value: expectedToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export const ADMIN_COOKIE_NAME = COOKIE;
