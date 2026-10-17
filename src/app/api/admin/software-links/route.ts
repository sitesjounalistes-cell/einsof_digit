import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { SAAS_SLUGS } from "@/lib/catalog";
import { parseYouTubeId } from "@/lib/youtube";

/**
 * Liens par logiciel SaaS (table SoftwareLink) — Espace équipe.
 *  - GET  : les 7 slugs du catalogue (valeurs null par défaut si absent de la base)
 *  - PUT  : { slug, demoUrl?, videoUrl? } → upsert (null = suppression du lien)
 * La vidéo doit être une URL YouTube valide (watch, youtu.be, shorts, embed).
 * La démo doit être une URL https quelconque (instance du logiciel).
 */

const slugSchema = z.enum(SAAS_SLUGS as [string, ...string[]]);

/** https requis — pas d'URL relative ni de javascript: */
const demoUrlSchema = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine((u) => u.startsWith("https://"), "demoUrl_https")
  .nullable()
  .optional()
  .or(z.literal(""));

const videoUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((u) => u === "" || (u.startsWith("https://") && parseYouTubeId(u) !== null), "videoUrl_youtube")
  .nullable()
  .optional()
  .or(z.literal(""));

const putSchema = z.object({
  slug: slugSchema,
  demoUrl: demoUrlSchema,
  videoUrl: videoUrlSchema,
});

function clean(v?: string | null): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const rows = await db.softwareLink.findMany({ where: { slug: { in: [...SAAS_SLUGS] } } });
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    const data = SAAS_SLUGS.map((slug) => {
      const row = bySlug.get(slug);
      return { slug, demoUrl: row?.demoUrl ?? null, videoUrl: row?.videoUrl ?? null };
    });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error("[admin/software-links GET]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "validation", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }
  const { slug, demoUrl, videoUrl } = parsed.data;
  try {
    const row = await db.softwareLink.upsert({
      where: { slug },
      create: { slug, demoUrl: clean(demoUrl), videoUrl: clean(videoUrl) },
      update: {
        ...(demoUrl !== undefined ? { demoUrl: clean(demoUrl) } : {}),
        ...(videoUrl !== undefined ? { videoUrl: clean(videoUrl) } : {}),
      },
    });
    return NextResponse.json({
      ok: true,
      data: { slug: row.slug, demoUrl: row.demoUrl, videoUrl: row.videoUrl },
    });
  } catch (e) {
    console.error("[admin/software-links PUT]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
