import { NextResponse } from "next/server";
import { z } from "zod";
import ZAI from "z-ai-web-dev-sdk";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  text: z.string().min(1).max(1000),
  lang: z.enum(["fr", "en", "es", "zh", "de"]).default("fr"),
  speed: z.number().min(0.5).max(2).optional(),
});

/**
 * Voix serveur (repli lorsque le navigateur n'expose aucune voix de
 * synthèse exploitable). « xiaochen » = timbre posé et professionnel ;
 * « jam » pour l'anglais (accent britannique soigné).
 */
const VOICE_BY_LANG: Record<string, string> = {
  fr: "xiaochen",
  en: "jam",
  es: "xiaochen",
  zh: "xiaochen",
  de: "xiaochen",
};

/**
 * POST /api/voice/speak — synthèse vocale SERVEUR (skill TTS).
 * Retourne un flux audio/wav 24 kHz prêt à jouer dans un <audio>.
 * Le client ne l'utilise que si la synthèse navigateur est indisponible —
 * elle reste la voie principale (voix neuronales locales, zéro latence).
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`tts:${ip}`, 30).allowed) {
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
  const d = parsed.data;

  try {
    const zai = await ZAI.create();
    const res = await zai.audio.tts.create({
      input: d.text,
      voice: VOICE_BY_LANG[d.lang] ?? "xiaochen",
      speed: d.speed ?? 1.0,
      response_format: "wav",
      stream: false,
    });
    const buffer = Buffer.from(new Uint8Array(await res.arrayBuffer()));
    if (buffer.length < 512) throw new Error("empty_audio");
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[voice/speak]", e);
    return NextResponse.json({ ok: false, error: { code: "tts_failed" } }, { status: 502 });
  }
}
