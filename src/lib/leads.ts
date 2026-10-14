import { db } from "@/lib/db";
import { hashIp } from "@/lib/rate-limit";

/** Normalise a phone to E.164-ish, default country Guinea (+224). */
export function normalizePhone(raw: string): string {
  let p = raw.replace(/[^\d+]/g, "");
  if (!p) return raw;
  if (p.startsWith("00")) p = `+${p.slice(2)}`;
  if (!p.startsWith("+")) {
    if (p.startsWith("224")) p = `+${p}`;
    else if (p.startsWith("0") && (p.length === 9 || p.length === 10))
      p = `+224${p.replace(/^0+/, "")}`;
    else if (p.length === 8 || p.length === 9) p = `+224${p}`;
    else p = `+${p}`;
  }
  return p;
}

export interface LeadInput {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  sector?: string | null;
  message?: string | null;
  source: string;
  interests?: string[];
  locale?: string;
  consent: boolean;
  ip: string;
}

/**
 * Find-or-create a Lead by phone or email (spec §24: enrich, never duplicate),
 * and log a lead_event for every new interaction.
 */
export async function upsertLead(input: LeadInput) {
  const phone = normalizePhone(input.phone);
  const email = input.email?.trim().toLowerCase() || null;

  let lead =
    (phone
      ? await db.lead.findFirst({ where: { phone }, orderBy: { createdAt: "desc" } })
      : null) ??
    (email
      ? await db.lead.findFirst({ where: { email }, orderBy: { createdAt: "desc" } })
      : null);

  const isNew = !lead;

  if (lead) {
    await db.lead.update({
      where: { id: lead.id },
      data: {
        firstName: input.firstName || lead.firstName,
        lastName: input.lastName || lead.lastName,
        email: email ?? lead.email,
        company: input.company ?? lead.company,
        interests: Array.from(
          new Set([...(lead.interests ? lead.interests.split(",") : []), ...(input.interests ?? [])])
        ).join(","),
        consentContact: input.consent || lead.consentContact,
        consentAt: input.consent ? new Date() : lead.consentAt,
      },
    });
  } else {
    lead = await db.lead.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone,
        email,
        company: input.company ?? null,
        sector: input.sector ?? null,
        message: input.message ?? null,
        source: input.source,
        interests: (input.interests ?? []).join(","),
        locale: input.locale ?? "fr",
        consentContact: input.consent,
        consentAt: input.consent ? new Date() : null,
      },
    });
  }

  await db.leadEvent.create({
    data: {
      leadId: lead.id,
      type: isNew ? "created" : "interaction",
      data: JSON.stringify({
        source: input.source,
        message: input.message?.slice(0, 500) ?? null,
        ip: hashIp(input.ip),
      }),
    },
  });

  return { lead, isNew };
}
