import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { upsertLead, normalizePhone } from "@/lib/leads";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { SAAS_SLUGS, findSaas } from "@/lib/catalog";
import { sendTrialAck } from "@/lib/adapters/email";

const schema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  phone: z.string().trim().min(6).max(20),
  email: z.string().email().optional().or(z.literal("")),
  saasSlug: z.string().refine((s) => SAAS_SLUGS.includes(s), "unknown_saas"),
  consent: z.literal(true),
  locale: z.string().max(5).default("fr"),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`trial:${ip}`, 5);
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
    // Duplicate check: one trial per person & per SaaS (spec §12)
    const phone = normalizePhone(d.phone);
    const existing = await db.trialRequest.findFirst({
      where: { saasSlug: d.saasSlug, lead: { phone } },
    });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: { code: "duplicate", message: "Essai déjà demandé." } },
        { status: 409 }
      );
    }

    const { lead } = await upsertLead({
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone,
      email: d.email || null,
      source: "trial",
      interests: [d.saasSlug],
      locale: d.locale,
      consent: d.consent,
      ip,
    });

    const trial = await db.trialRequest.create({
      data: { leadId: lead.id, saasSlug: d.saasSlug, status: "requested", trialDays: 7 },
    });

    await db.leadEvent.create({
      data: { leadId: lead.id, type: "trial_requested", data: JSON.stringify({ trialId: trial.id, saas: d.saasSlug }) },
    });

    // Accusé de réception e-mail (réel via Resend si configuré, sinon journalisé)
    if (d.email) {
      const saasName = findSaas(d.saasSlug)?.name ?? d.saasSlug;
      try {
        await sendTrialAck(d.email, d.firstName, saasName, lead.id);
      } catch (e) {
        console.error("[trial] ack email", e);
      }
    }

    return NextResponse.json({ ok: true, data: { id: trial.id } }, { status: 201 });
  } catch (e) {
    console.error("[trial]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
