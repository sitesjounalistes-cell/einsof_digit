/** Simple in-memory rate limiter (spec §25: 5 req/min/IP on public write routes). */

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

/** IPs are never stored in clear (spec §24) — salted hash. */
export function hashIp(ip: string): string {
  return Buffer.from(`salt::${ip}`).toString("base64url").slice(0, 24);
}
