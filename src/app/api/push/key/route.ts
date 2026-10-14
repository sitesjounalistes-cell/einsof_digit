import { NextResponse } from "next/server";
import { getVapid } from "@/lib/adapters/push";

/** Clé publique VAPID consommée par le navigateur lors de l'abonnement. */
export async function GET() {
  try {
    const { publicKey } = await getVapid();
    return NextResponse.json({ ok: true, data: { publicKey } });
  } catch (e) {
    console.error("[push/key]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
