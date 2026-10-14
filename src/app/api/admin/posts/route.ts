import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { parseLocaleJson } from "@/lib/locale-json";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  try {
    const rows = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({
      ok: true,
      data: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: parseLocaleJson(p.title).fr ?? p.slug,
        category: p.category,
        isPublished: p.isPublished,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("[admin/posts]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().uuid(),
  isPublished: z.boolean(),
});

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
    const post = await db.blogPost.update({
      where: { id: parsed.data.id },
      data: {
        isPublished: parsed.data.isPublished,
        ...(parsed.data.isPublished ? { publishedAt: new Date() } : {}),
      },
    });
    return NextResponse.json({ ok: true, data: { id: post.id, isPublished: post.isPublished } });
  } catch (e) {
    console.error("[admin/posts PATCH]", e);
    return NextResponse.json({ ok: false, error: { code: "server" } }, { status: 500 });
  }
}
