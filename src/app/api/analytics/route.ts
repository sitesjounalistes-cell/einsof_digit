import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().max(60),
  props: z.record(z.string(), z.unknown()).optional(),
  path: z.string().max(200).optional(),
  locale: z.string().max(5).optional(),
  visitorId: z.string().max(64).optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`analytics:${ip}`, 120).allowed) {
    return NextResponse.json({ ok: true }, { status: 202 }); // silently drop
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_json" } }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: true }, { status: 202 }); // analytics never blocks UX
  }
  try {
    await db.analyticsEvent.create({
      data: {
        name: parsed.data.name,
        props: parsed.data.props ? JSON.stringify(parsed.data.props) : null,
        path: parsed.data.path ?? null,
        locale: parsed.data.locale ?? null,
        visitorId: parsed.data.visitorId ?? null,
      },
    });
  } catch (e) {
    console.error("[analytics]", e);
  }
  return NextResponse.json({ ok: true }, { status: 202 });
}
