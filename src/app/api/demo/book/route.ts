import { NextResponse } from "next/server";
import { bookDemoSlot, bookDemoSchema } from "@/lib/demo";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * POST /api/demo/book — réservation d'une démonstration (spec §24/§27).
 * Public, rate-limité 5/min/IP, validation Zod, anti-surréservation
 * transactionnelle côté src/lib/demo.ts.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`demo:${ip}`, 5).allowed) {
    return NextResponse.json(
      { ok: false, error: { code: "rate_limited", message: "Trop de tentatives. Merci de patienter une minute." } },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }

  const parsed = bookDemoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "validation",
          message: "Champs invalides.",
          fields: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  try {
    const result = await bookDemoSlot(parsed.data, ip);
    if (result.ok) {
      return NextResponse.json(
        { ok: true, data: { bookingId: result.bookingId, startsAt: result.startsAt } },
        { status: 201 }
      );
    }
    // invalid_slot → 400 (validation créneau) ; full / already_booked → 409
    const status = result.code === "invalid_slot" ? 400 : 409;
    return NextResponse.json({ ok: false, error: { code: result.code } }, { status });
  } catch (e) {
    console.error("[demo/book]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
