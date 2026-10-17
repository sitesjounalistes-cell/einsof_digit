import { NextResponse } from "next/server";
import { ensureUpcomingSlots, listUpcomingSlots, DEMO_SLOTS_LIMIT } from "@/lib/demo";

/** GET /api/demo/slots — prochains créneaux de démonstration avec places restantes.
 *  Auto-entretien de la grille (audit F-02) : complète les créneaux
 *  mardi/jeudi si nécessaire avant de lister. */
export async function GET() {
  try {
    await ensureUpcomingSlots().catch((e) => console.error("[demo/slots] ensure", e));
    const slots = await listUpcomingSlots(DEMO_SLOTS_LIMIT);
    return NextResponse.json(
      { ok: true, data: slots },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[demo/slots]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
