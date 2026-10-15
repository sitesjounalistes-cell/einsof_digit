import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/pages/ServiceDetailPage";
import {
  SERVICE_DETAILS,
  SERVICE_SLUGS,
  type ServiceSlug,
} from "@/lib/pages-content/service-details";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

/** Pages statiques : un paramètre par pôle de service. */
export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = SERVICE_DETAILS.fr[slug as ServiceSlug];
  if (!detail) return { title: `Service — ${BRAND}` };
  return {
    title: `${detail.name} — Services — ${BRAND}`,
    description: detail.hero.sub,
  };
}

export default async function ServiceDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SERVICE_SLUGS.includes(slug as ServiceSlug)) notFound();
  return <ServiceDetailPage slug={slug as ServiceSlug} />;
}
