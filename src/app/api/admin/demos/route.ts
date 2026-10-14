import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

/** GET /api/admin/demos — réservations de démonstration, groupées par créneau. */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const rows = await db.demoBooking.findMany({
      include: {
        slot: true,
        lead: { select: { firstName: true, lastName: true, phone: true } },
      },
      orderBy: [{ slot: { startsAt: "asc" } }, { createdAt: "asc" }],
    });

    const now = new Date();
    const groups = new Map<
      string,
      {
        slot: (typeof rows)[number]["slot"];
        bookings: (typeof rows)[number][];
      }
    >();
    for (const b of rows) {
      const g = groups.get(b.slotId);
      if (g) g.bookings.push(b);
      else groups.set(b.slotId, { slot: b.slot, bookings: [b] });
    }

    const toView = (slot: (typeof rows)[number]["slot"], bookings: (typeof rows)[number][]) => ({
      id: slot.id,
      startsAt: slot.startsAt.toISOString(),
      capacity: slot.capacity,
      taken: bookings.filter((b) => b.status !== "cancelled").length,
      bookings: bookings.map((b) => ({
        id: b.id,
        status: b.status,
        saasSlug: b.saasSlug,
        locale: b.locale,
        createdAt: b.createdAt.toISOString(),
        lead: {
          firstName: b.lead.firstName,
          lastName: b.lead.lastName,
          phone: b.lead.phone,
        },
      })),
    });

    const upcoming: ReturnType<typeof toView>[] = [];
    const past: ReturnType<typeof toView>[] = [];
    for (const g of groups.values()) {
      if (g.slot.startsAt >= now) upcoming.push(toView(g.slot, g.bookings));
      else past.push(toView(g.slot, g.bookings));
    }
    upcoming.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    past.sort((a, b) => b.startsAt.localeCompare(a.startsAt));

    return NextResponse.json({ ok: true, data: { upcoming, past } });
  } catch (e) {
    console.error("[admin/demos]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["confirmed", "cancelled", "done", "no_show"]),
});

/** PATCH /api/admin/demos — change le statut d'une réservation. */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "validation" } }, { status: 400 });
  }
  try {
    const booking = await db.demoBooking.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true, data: { id: booking.id, status: booking.status } });
  } catch (e) {
    console.error("[admin/demos PATCH]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
