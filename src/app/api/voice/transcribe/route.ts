import { NextResponse } from "next/server";
import { z } from "zod";
import ZAI from "z-ai-web-dev-sdk";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  /** Audio encodé en base64 (WAV 16 kHz mono produit côté client, ou data URL). */
  audioBase64: z.string().min(64).max(9_600_000),
  mime: z.string().max(120).optional(),
});

/**
 * POST /api/voice/transcribe — reconnaissance vocale SERVEUR (skill ASR).
 *
 * Pourquoi une transcription serveur ? L'API Web Speech du navigateur
 * (webkitSpeechRecognition) est absente de Firefox, bloquée dans certains
 * contextes d'iframe et dépendante des serveurs du navigateur : le mode
 * vocal de l’agence ne peut pas reposer uniquement dessus. Cette route garantit
 * une reconnaissance disponible sur TOUS les navigateurs modernes.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`asr:${ip}`, 30).allowed) {
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

  /* Tolère un data URL complet (« data:audio/wav;base64,…. »). */
  const raw = parsed.data.audioBase64;
  const b64 = raw.includes(",") ? raw.slice(raw.lastIndexOf(",") + 1) : raw;

  try {
    const zai = await ZAI.create();
    const res = await zai.audio.asr.create({ file_base64: b64 });
    const text = String(res?.text ?? "").replace(/\s+/g, " ").trim();
    return NextResponse.json({ ok: true, data: { text } });
  } catch (e) {
    console.error("[voice/transcribe]", e);
    return NextResponse.json({ ok: false, error: { code: "asr_failed" } }, { status: 502 });
  }
}
