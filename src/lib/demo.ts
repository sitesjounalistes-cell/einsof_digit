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

/* ── Régénération des créneaux (audit F-02, 17/10/2026) ────────────
   Les créneaux étaient un seed STATIQUE : après le dernier créneau
   (03/11/2026), plus aucune démo bookable alors que le chatbot continue
   de promettre « mardi/jeudi 10h et 15h ». Désormais la grille est
   auto-entretenue : mardi/jeudi 10h00 et 15h00 (UTC = heure de Conakry),
   capacité 2, horizon de 4 semaines, cible de 12 créneaux futurs ACTIFS.
   Appelée par /api/demo/slots, l'outil suggest_slots et le cron quotidien
   — idempotente (aucun doublon : on ne crée que les startsAt absents). */
const SLOT_HOURS = [10, 15]; // heure de Conakry (GMT+0)
const SLOT_WEEKDAYS = [2, 4]; // mardi (2) et jeudi (4)
export const DEMO_SLOT_CAPACITY = 2;
export const DEMO_SLOT_HORIZON_WEEKS = 4;
export const DEMO_SLOT_TARGET = 12;

/** Dates de créneaux voulues entre « maintenant » et l'horizon. */
function upcomingSlotDates(from = new Date()): Date[] {
  const dates: Date[] = [];
  const day = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  for (let i = 0; i < DEMO_SLOT_HORIZON_WEEKS * 7 + 7; i++) {
    const d = new Date(day);
    d.setUTCDate(day.getUTCDate() + i);
    if (!SLOT_WEEKDAYS.includes(d.getUTCDay())) continue;
    for (const h of SLOT_HOURS) {
      const slot = new Date(d);
      slot.setUTCHours(h, 0, 0, 0);
      if (slot.getTime() > from.getTime() + 30 * 60_000) dates.push(slot); // marge 30 min
    }
  }
  return dates;
}

/** Complète la grille si nécessaire : au moins DEMO_SLOT_TARGET créneaux
 *  futurs actifs. Ne touche à rien sinon. Retourne le nombre créés. */
export async function ensureUpcomingSlots(): Promise<number> {
  const now = new Date();
  const existing = await db.demoSlot.findMany({
    where: { startsAt: { gt: now }, isActive: true },
    select: { startsAt: true },
  });
  if (existing.length >= DEMO_SLOT_TARGET) return 0;
  const taken = new Set(existing.map((s) => s.startsAt.getTime()));
  const wanted = upcomingSlotDates(now)
    .filter((d) => !taken.has(d.getTime()))
    .slice(0, DEMO_SLOT_TARGET - existing.length);
  if (wanted.length === 0) return 0;
  const res = await db.demoSlot.createMany({
    data: wanted.map((startsAt) => ({ startsAt, capacity: DEMO_SLOT_CAPACITY, isActive: true })),
    skipDuplicates: true,
  });
  return res.count;
}

/** Hygiène du cron : déssaffecte les créneaux passés (reste en base pour
 *  l'historique des réservations, n'apparaît plus dans les listes). */
export async function deactivatePastSlots(): Promise<number> {
  const res = await db.demoSlot.updateMany({
    where: { startsAt: { lte: new Date() }, isActive: true },
    data: { isActive: false },
  });
  return res.count;
}

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
