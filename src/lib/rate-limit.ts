/** Limiteur de taux en mémoire (spec §25 : limite sur les routes publiques d'écriture).
 *  Limites réelles appliquées : 5/min (contact, essai, newsletter, démo, login),
 *  20/min (chat, feedback), 30/min (consent, TTS, ASR), 60/min (push-open),
 *  120/min (analytics). Production : basculer sur Upstash (voir DECISIONS.md). */

import { createHash } from "crypto";

const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (b.count >= limit) return { allowed: false, remaining: 0 };
  b.count += 1;
  return { allowed: true, remaining: limit - b.count };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

/* IPs are never stored in clear (spec §24) — salted SHA-256 hash.
   Correctif audit S-05 : vrai hash à sens unique (l'ancien base64url
   était réversible). Le sel est constant car les clés ne vivent qu'en
   mémoire (rate-limit) — aucune IP n'est persistée. */
const IP_SALT = "eins-ip-hash-v1";
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${IP_SALT}::${ip}`).digest("hex").slice(0, 32);
}
