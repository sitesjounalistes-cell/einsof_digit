import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseLocaleJson } from "@/lib/locale-json";
import { parseAds, parseKeywordsCsv } from "@/lib/post-ads";
import { ArticlePage } from "@/components/pages/ArticlePage";
import { JsonLd } from "@/components/site/JsonLd";
import { PAGE_KEYWORDS, articleJsonLd, buildMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  try {
    const p = await db.blogPost.findUnique({ where: { slug } });
    if (!p || !p.isPublished) return null;
    return {
      ...p,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      updatedAt: p.updatedAt.toISOString(),
    };
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
  /* SEO par article (dashboard) — repli automatique : title / excerpt. */
  const metaTitle = post.metaTitle?.trim() || title;
  const metaDescription = post.metaDescription?.trim() || excerpt;
  const keywords = [
    ...parseKeywordsCsv(post.keywords),
    ...PAGE_KEYWORDS.blog,
  ];
  return buildMetadata({
    path: `/blog/${slug}`,
    title: metaTitle,
    description: metaDescription,
    keywords,
    type: "article",
  });
}

export default async function ArticleRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const title = parseLocaleJson(post.title).fr ?? post.slug;
  const excerpt = parseLocaleJson(post.excerpt).fr ?? "";
  const keywords = [...parseKeywordsCsv(post.keywords), ...PAGE_KEYWORDS.blog];
  const ads = parseAds(post.adsJson);
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          excerpt,
          slug,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          keywords,
        })}
      />
      <ArticlePage slug={slug} ads={ads} />
    </>
  );
}
