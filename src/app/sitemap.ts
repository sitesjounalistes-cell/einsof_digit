import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { SERVICE_SLUGS } from "@/lib/pages-content/service-details";
import { SAAS_DETAIL_SLUGS } from "@/lib/pages-content/saas-details";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Sitemap complet du site — toutes les pages statiques + les pages
 * dynamiques (pôles de services, logiciels SaaS, articles du Journal).
 * Les URLs du blog sont lues depuis la base ; en cas d'indisponibilité
 * de la base, le sitemap reste valide sans elles.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1, freq: "weekly" as const },
    { path: "/services", priority: 0.95, freq: "weekly" as const },
    { path: "/logiciels", priority: 0.95, freq: "weekly" as const },
    { path: "/tarifs", priority: 0.9, freq: "weekly" as const },
    { path: "/realisations", priority: 0.8, freq: "monthly" as const },
    { path: "/secteurs", priority: 0.8, freq: "monthly" as const },
    { path: "/methode", priority: 0.7, freq: "monthly" as const },
    { path: "/a-propos", priority: 0.7, freq: "monthly" as const },
    { path: "/blog", priority: 0.8, freq: "weekly" as const },
    { path: "/faq", priority: 0.7, freq: "monthly" as const },
    { path: "/contact", priority: 0.85, freq: "yearly" as const },
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const saasRoutes: MetadataRoute.Sitemap = SAAS_DETAIL_SLUGS.map((slug) => ({
    url: `${SITE_URL}/logiciels/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    blogRoutes = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    /* base indisponible → sitemap statique uniquement */
  }

  return [...staticRoutes, ...serviceRoutes, ...saasRoutes, ...blogRoutes];
}
