import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertLead } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendNewsletterWelcome } from "@/lib/adapters/email";

const schema = z.object({
  email: z.string().email(),
  locale: z.string().max(5).default("fr"),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`news:${ip}`, 5).allowed) {
    return NextResponse.json({ ok: false, error: { code: "rate_limited" } }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const { lead } = await upsertLead({
      firstName: "Abonné",
      lastName: "Newsletter",
      phone: "+224000000000",
      email: parsed.data.email,
      source: "newsletter",
      locale: parsed.data.locale,
      consent: true,
      ip,
    });

    // E-mail de bienvenue (réel via Resend si configuré, sinon journalisé)
    if (parsed.data.email) {
      try {
        await sendNewsletterWelcome(parsed.data.email, lead.id);
      } catch (e) {
        console.error("[newsletter] welcome email", e);
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[newsletter]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
