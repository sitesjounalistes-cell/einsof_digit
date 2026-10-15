import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SaasDetailPage } from "@/components/pages/SaasDetailPage";
import {
  SAAS_DETAILS,
  SAAS_DETAIL_SLUGS,
  type SaasSlug,
} from "@/lib/pages-content/saas-details";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

/** Pages statiques : un paramètre par logiciel SaaS. */
export function generateStaticParams() {
  return SAAS_DETAIL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = SAAS_DETAILS.fr[slug as SaasSlug];
  if (!detail) return { title: `Logiciel — ${BRAND}` };
  return {
    title: `${detail.name} — Logiciels — ${BRAND}`,
    description: detail.hero.sub,
  };
}

export default async function SaasDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SAAS_DETAIL_SLUGS.includes(slug as SaasSlug)) notFound();
  return <SaasDetailPage slug={slug as SaasSlug} />;
}
