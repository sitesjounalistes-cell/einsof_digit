import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Admin auth — mot de passe serveur + cookie httpOnly SIGNÉ (HMAC-SHA256).
 *
 * Correctifs de l'audit du 17/10/2026 (docs/AUDIT-2026-10-17.md — S-03/S-04) :
 * - Plus AUCUN mot de passe par défaut : ADMIN_PASSWORD est OBLIGATOIRE.
 *   Sans elle, la connexion renvoie 503 « admin_not_configured » (fail-closed).
 * - Le token n'est plus un simple sha256(mot de passe) déterministe et éternel :
 *   payload = « admin:<expiration-ms> », signature = HMAC-SHA256(payload, clé
 *   dérivée du mot de passe). La session de 8 h est donc vérifiée CÔTÉ SERVEUR
 *   (et pas seulement via maxAge du cookie), et changer le mot de passe
 *   révoque instantanément toutes les sessions existantes.
 * - Comparaisons en timingSafeEqual (anti timing-attack).
 *
 * Production visée : Auth.js + argon2 + TOTP obligatoire (spec §26) — voir
 * docs/DECISIONS.md et docs/TODO-HUMAN.md.
 */

const COOKIE = "eins-admin";
const MAX_AGE = 8 * 3600; // 8 h (spec §26)

/** Clé de signature HMAC — dérivée du mot de passe (rotation à chaque changement). */
function signingKey(password: string): Buffer {
  return createHmac("sha256", "eins-admin-session-v1").update(password).digest();
}

function sign(payload: string, password: string): string {
  const sig = createHmac("sha256", signingKey(password)).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** True si ADMIN_PASSWORD est définie et exploitable (≥ 8 caractères). */
export function isAdminConfigured(): boolean {
  const pwd = process.env.ADMIN_PASSWORD?.trim() ?? "";
  return pwd.length >= 8;
}

/** Token de session actuel : « admin:<expire-le> » + signature HMAC. */
export function sessionToken(): string {
  const password = process.env.ADMIN_PASSWORD!.trim();
  return sign(`admin:${Date.now() + MAX_AGE * 1000}`, password);
}

/** Vérifie signature + expiration serveur du token reçu. */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password || password.length < 8) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(
    createHmac("sha256", signingKey(password)).update(payload).digest("base64url")
  );
  if (sig.length !== expected.length || !timingSafeEqual(sig, expected)) return false;
  const expiry = Number(payload.split(":")[1]);
  return Number.isFinite(expiry) && expiry > Date.now();
}

/** Comparaison du mot de passe en temps constant. */
export function passwordMatches(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD?.trim() ?? "";
  if (!password) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export function sessionCookie() {
  return {
    name: COOKIE,
    value: sessionToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export const ADMIN_COOKIE_NAME = COOKIE;
