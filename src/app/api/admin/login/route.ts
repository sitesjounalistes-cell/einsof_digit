import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminConfigured, passwordMatches, sessionCookie } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`admin-login:${ip}`, 5, 5 * 60_000).allowed) {
    return NextResponse.json({ ok: false, error: { code: "locked", message: "Trop de tentatives." } }, { status: 429 });
  }

  /* Fail-closed (audit S-03) : sans ADMIN_PASSWORD configurée (≥ 8 car.),
     l'Espace équipe refuse toute connexion — plus de mot de passe par défaut. */
  if (!isAdminConfigured()) {
    console.error("[admin/login] ADMIN_PASSWORD absente ou trop courte (< 8) — connexion refusée");
    return NextResponse.json(
      { ok: false, error: { code: "admin_not_configured", message: "ADMIN_PASSWORD manquante côté serveur." } },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success || !passwordMatches(parsed.data.password)) {
    return NextResponse.json({ ok: false, error: { code: "invalid" } }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie());
  return res;
}
