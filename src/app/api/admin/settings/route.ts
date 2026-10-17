import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/site-settings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings-defaults";

/**
 * Réglages Site & Contact (singleton) — GET (données + champs bruts)
 * et PUT (enregistrement) pour l'Espace équipe. isAdmin() obligatoire.
 */

/* ── Validation (zod) ─────────────────────────────────────────── */

const socialSchema = z.object({
  platform: z.string().trim().min(1).max(30),
  label: z.string().trim().min(1).max(60),
  url: z
    .string()
    .trim()
    .url()
    .max(300)
    .refine((u) => u.startsWith("https://"), "URL https obligatoire"),
});

const putSchema = z.object({
  phones: z
    .array(z.string().trim().min(3).max(40))
    .max(6, "6 numéros maximum"),
  emails: z
    .array(z.string().trim().email().max(120))
    .max(6, "6 adresses maximum"),
  socials: z.array(socialSchema).max(10, "10 réseaux maximum"),
  managerPhotoUrl: z.string().trim().max(300).nullable().optional(),
  managerPhotoAlt: z.string().trim().max(200).nullable().optional(),
  managerMessageFr: z.string().min(1, "Message requis").max(2000, "2000 caractères maximum"),
  managerName: z.string().trim().max(80).optional(),
  managerRole: z.string().trim().max(120).optional(),
});

function clean(v: string | null | undefined): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

/* ── GET : données parsées + champs bruts (utile au panel) ───── */

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const data = await getSiteSettings();
    const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    return NextResponse.json({
      ok: true,
      data,
      raw: {
        phonesJson: row?.phonesJson ?? "[]",
        emailsJson: row?.emailsJson ?? "[]",
        socialsJson: row?.socialsJson ?? "[]",
        managerPhotoUrl: row?.managerPhotoUrl ?? null,
        managerPhotoAlt: row?.managerPhotoAlt ?? null,
        managerMessageJson: row?.managerMessageJson ?? null,
        managerName: row?.managerName ?? null,
        managerRole: row?.managerRole ?? null,
        updatedAt: row?.updatedAt ?? null,
      },
    });
  } catch {
    return NextResponse.json({ ok: true, data: DEFAULT_SITE_SETTINGS, raw: null });
  }
}

/* ── PUT : enregistrement du singleton (upsert) ──────────────── */

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "invalid_json" } }, { status: 400 });
  }

  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "validation", detail: z.flattenError(parsed.error) } },
      { status: 400 }
    );
  }

  const input = parsed.data;
  // Normalisation : listes nettoyées (vides supprimées, e-mails en minuscules).
  const phones = input.phones.map((p) => p.trim()).filter((p) => p.length > 0);
  const emails = input.emails.map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
  const socials = input.socials.map((s) => ({
    platform: s.platform.trim(),
    label: s.label.trim(),
    url: s.url.trim(),
  }));

  const phonesJson = JSON.stringify(phones);
  const emailsJson = JSON.stringify(emails);
  const socialsJson = JSON.stringify(socials);
  const managerMessageJson = JSON.stringify({ fr: input.managerMessageFr });
  const managerPhotoUrl = clean(input.managerPhotoUrl);
  const managerPhotoAlt = clean(input.managerPhotoAlt);
  const managerName = clean(input.managerName);
  const managerRole = clean(input.managerRole);

  try {
    await db.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        phonesJson,
        emailsJson,
        socialsJson,
        managerPhotoUrl,
        managerPhotoAlt,
        managerMessageJson,
        managerName,
        managerRole,
      },
      create: {
        id: "singleton",
        phonesJson,
        emailsJson,
        socialsJson,
        managerPhotoUrl,
        managerPhotoAlt,
        managerMessageJson,
        managerName,
        managerRole,
      },
    });

    const data = await getSiteSettings();
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
