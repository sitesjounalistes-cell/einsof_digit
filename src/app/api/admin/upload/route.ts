import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isAdmin } from "@/lib/admin-auth";

/**
 * Upload d'images (partagé — Espace équipe) : FormData { file }.
 * - Formats acceptés : JPEG, PNG, WebP, AVIF, GIF — max 6 Mo ;
 * - le type déclaré est vérifié par lecture des octets magiques (anti-usurpation) ;
 * - stockage : public/uploads/<nom-slugifié>-<timestamp>.<ext>
 *   (ex : realisation-1732185600000.jpg) ;
 * - réponse : { ok: true, data: { url: "/uploads/…" } }.
 * Accès réservé à l'équipe (isAdmin).
 */

export const runtime = "nodejs";

const MAX_BYTES = 6 * 1024 * 1024; // 6 Mo

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

function slugifyBase(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
}

/** Détecte le vrai type d'image par octets magiques. Retourne le mime ou null. */
function sniffImage(b: Uint8Array): string | null {
  if (b.length < 12) return null;
  // JPEG : FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  // PNG : 89 50 4E 47 0D 0A 1A 0A
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  // GIF : GIF87a / GIF89a
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";
  // WebP : "RIFF" + 4 octets taille + "WEBP"
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) {
    return "image/webp";
  }
  // AVIF / HEIF : taille + "ftyp" + marque (avif, avis…)
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
    if (brand.startsWith("avi")) return "image/avif";
  }
  return null;
}

const bad = (code: string, status: number) =>
  NextResponse.json({ ok: false, error: { code } }, { status });

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return bad("unauthorized", 401);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("bad_form", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return bad("no_file", 400);
  if (file.size <= 0) return bad("empty_file", 400);
  if (file.size > MAX_BYTES) return bad("too_large", 413);

  // Certains navigateurs non standards envoient "image/jpg" — normalisé.
  const mime = file.type.toLowerCase() === "image/jpg" ? "image/jpeg" : file.type.toLowerCase();
  const ext = MIME_EXT[mime];
  if (!ext) return bad("bad_type", 415);

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffImage(buf);
    if (!sniffed || sniffed !== mime) return bad("bad_type", 415);

    const base = slugifyBase(file.name.replace(/\.[^.]+$/, ""));
    const name = `${base}-${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), buf);

    return NextResponse.json(
      { ok: true, data: { url: `/uploads/${name}` } },
      { status: 201 }
    );
  } catch (e) {
    console.error("[admin/upload]", e);
    return bad("server", 500);
  }
}
