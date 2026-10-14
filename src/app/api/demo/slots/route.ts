import { NextResponse } from "next/server";
import { listUpcomingSlots, DEMO_SLOTS_LIMIT } from "@/lib/demo";

/** GET /api/demo/slots — prochains créneaux de démonstration avec places restantes. */
export async function GET() {
  try {
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
