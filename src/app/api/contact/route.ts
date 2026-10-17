import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { upsertLead } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendContactAck } from "@/lib/adapters/email";

const schema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  phone: z.string().trim().min(6).max(20),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(1).max(120),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  locale: z.string().max(5).default("fr"),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`contact:${ip}`, 5);
  if (!rl.allowed) {
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

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "validation", message: "Champs invalides.", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const d = parsed.data;

  try {
    const isQuote = /devis|quote/i.test(d.subject);
    const { lead } = await upsertLead({
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone,
      email: d.email || null,
      company: d.company || null,
      source: isQuote ? "quote" : "contact",
      locale: d.locale,
      consent: d.consent,
      ip,
    });

    const msg = await db.contactMessage.create({
      data: { leadId: lead.id, subject: d.subject, message: d.message },
    });

    await db.leadEvent.create({
      data: { leadId: lead.id, type: "message", data: JSON.stringify({ messageId: msg.id, subject: d.subject }) },
    });

    // Accusé de réception e-mail (réel via Resend si configuré, sinon journalisé)
    if (d.email) {
      try {
        await sendContactAck(d.email, d.firstName, lead.id);
      } catch (e) {
        console.error("[contact] ack email", e);
      }
    }

    return NextResponse.json({ ok: true, data: { id: msg.id } }, { status: 201 });
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
