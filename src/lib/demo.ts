/**
 * Réservation de démonstration (spec §24 + §27) — logique partagée entre
 * l'API publique (/api/demo/*) et le chatbot (outil book_demo).
 * Fuseau de référence : Africa/Conakry (GMT+0, pas d'heure d'été) —
 * les créneaux sont donc stockés directement en UTC.
 * Règle stricte : les démos ne font l'objet d'AUCUN tarif — jamais de prix ici.
 */

import { z } from "zod";
import { db } from "@/lib/db";
import { upsertLead, normalizePhone } from "@/lib/leads";
import { SAAS_SLUGS } from "@/lib/catalog";

export const DEMO_TIMEZONE = "Africa/Conakry";
export const DEMO_SLOTS_LIMIT = 12;
export const DEMO_CHAT_SLOTS_LIMIT = 4;

/* ── Vue d'un créneau (API + actions chat) ──────────────────── */

export interface DemoSlotView {
  id: string;
  startsAt: string; // ISO UTC
  remaining: number;
}

/** Prochains créneaux actifs avec places restantes, triés, limités. */
export async function listUpcomingSlots(limit = DEMO_SLOTS_LIMIT): Promise<DemoSlotView[]> {
  const now = new Date();
  const pool = await db.demoSlot.findMany({
    where: { startsAt: { gt: now }, isActive: true },
    orderBy: { startsAt: "asc" },
    // pool élargi : les créneaux pleins sont écartés après comptage
    take: Math.max(limit * 4, 24),
  });
  if (pool.length === 0) return [];
  const counts = await db.demoBooking.groupBy({
    by: ["slotId"],
    where: { slotId: { in: pool.map((s) => s.id) }, status: { not: "cancelled" } },
    _count: { _all: true },
  });
  const taken = new Map(counts.map((c) => [c.slotId, c._count._all]));
  return pool
    .map((s) => ({
      id: s.id,
      startsAt: s.startsAt.toISOString(),
      remaining: Math.max(0, s.capacity - (taken.get(s.id) ?? 0)),
    }))
    .filter((s) => s.remaining > 0)
    .slice(0, limit);
}

/* ── Validation des entrées (API publique + outil book_demo) ── */

export const bookDemoSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s+]{7,20}$/, "phone_format")
    .refine((s) => (s.match(/\d/g) ?? []).length >= 7, "phone_digits"),
  email: z.string().trim().email().optional().or(z.literal("")),
  saasSlug: z
    .string()
    .refine((s) => SAAS_SLUGS.includes(s), "unknown_saas")
    .optional()
    .or(z.literal("")),
  slotId: z.string().uuid(),
  locale: z.string().trim().length(2).default("fr"),
  consentContact: z.literal(true),
});

export type BookDemoInput = z.infer<typeof bookDemoSchema>;

export type BookDemoResult =
  | { ok: true; bookingId: string; startsAt: string }
  | { ok: false; code: "invalid_slot" | "full" | "already_booked" };

/** Erreur de contrôle métier déclenchant un rollback de transaction. */
class DemoRuleError extends Error {
  constructor(public code: "invalid_slot" | "full") {
    super(`demo_rule:${code}`);
  }
}

const SLOT_LABEL_FMT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: DEMO_TIMEZONE,
});

/** Réservation transactionnelle avec anti-surréservation (re-vérifie remaining avant create). */
export async function bookDemoSlot(input: BookDemoInput, ip: string): Promise<BookDemoResult> {
  const phone = normalizePhone(input.phone);
  const now = new Date();

  // 1. Contrôles rapides sans écriture (échec précoce, pas de lead inutile)
  const slot = await db.demoSlot.findUnique({ where: { id: input.slotId } });
  if (!slot || !slot.isActive || slot.startsAt <= now) {
    return { ok: false, code: "invalid_slot" };
  }

  // 2. Déduplication : un seul créneau confirmé à venir par téléphone
  const duplicate = await db.demoBooking.findFirst({
    where: { status: "confirmed", slot: { startsAt: { gt: now } }, lead: { phone } },
    select: { id: true },
  });
  if (duplicate) return { ok: false, code: "already_booked" };

  const taken = await db.demoBooking.count({
    where: { slotId: slot.id, status: { not: "cancelled" } },
  });
  if (taken >= slot.capacity) return { ok: false, code: "full" };

  // 3. Lead enrichi ou créé (spec §24 : enrich, never duplicate) — source "demo"
  const slotLabel = SLOT_LABEL_FMT.format(slot.startsAt);
  const { lead } = await upsertLead({
    firstName: input.firstName,
    lastName: input.lastName,
    phone,
    email: input.email ? input.email : null,
    source: "demo",
    interests: [input.saasSlug ? input.saasSlug : "demo"],
    message: `Réservation de démo — créneau du ${slotLabel} (heure de Conakry)`,
    locale: input.locale,
    consent: true, // réserver une démo = accord d'être recontacté pour cette démo
    ip,
  });

  // 4. Transaction interactive : re-vérifie la capacité AVANT create
  try {
    const bookingId = await db.$transaction(
      async (tx) => {
        const fresh = await tx.demoSlot.findUnique({ where: { id: slot.id } });
        if (!fresh || !fresh.isActive || fresh.startsAt <= new Date()) {
          throw new DemoRuleError("invalid_slot");
        }
        const active = await tx.demoBooking.count({
          where: { slotId: fresh.id, status: { not: "cancelled" } },
        });
        if (active >= fresh.capacity) throw new DemoRuleError("full");
        const created = await tx.demoBooking.create({
          data: {
            slotId: fresh.id,
            leadId: lead.id,
            saasSlug: input.saasSlug ? input.saasSlug : null,
            status: "confirmed",
            locale: input.locale,
          },
        });
        await tx.leadEvent.create({
          data: {
            leadId: lead.id,
            type: "demo_requested",
            data: JSON.stringify({
              bookingId: created.id,
              slotId: fresh.id,
              startsAt: fresh.startsAt.toISOString(),
              saas: input.saasSlug || null,
              via: "site",
            }),
          },
        });
        return created.id;
      },
      { timeout: 8_000, maxWait: 3_000 }
    );
    return { ok: true, bookingId, startsAt: slot.startsAt.toISOString() };
  } catch (e) {
    if (e instanceof DemoRuleError) return { ok: false, code: e.code };
    throw e;
  }
}
