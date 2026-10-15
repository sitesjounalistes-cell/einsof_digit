import type { Metadata } from "next";
import { BlogPage } from "@/components/pages/BlogPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Journal — ${BRAND}`,
  description:
    "Actualités et conseils d'experts de l'agence : SaaS et gestion, sites web, stratégie digitale. Des articles de fond pour réussir votre transformation digitale en Guinée.",
};

export default function BlogRoute() {
  return <BlogPage />;
}
