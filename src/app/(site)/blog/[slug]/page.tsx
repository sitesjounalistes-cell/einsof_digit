import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";
import { ArticlePage } from "@/components/pages/ArticlePage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  try {
    const p = await db.blogPost.findUnique({ where: { slug } });
    if (!p || !p.isPublished) return null;
    return { ...p, publishedAt: p.publishedAt?.toISOString() ?? null };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: `Article — ${BRAND}` };
  const title = parseLocaleJson(post.title).fr ?? post.slug;
  const excerpt = parseLocaleJson(post.excerpt).fr ?? "";
  return {
    title: `${title} — ${BRAND}`,
    description: excerpt,
  };
}

export default async function ArticleRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <ArticlePage slug={slug} />;
}
