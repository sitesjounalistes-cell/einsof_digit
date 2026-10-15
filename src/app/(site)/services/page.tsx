import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/ServicesPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Services — ${BRAND}`,
  description:
    "Sites web, logiciels sur mesure, SaaS de gestion, community management, acquisition client, formations et stratégie : sept pôles d'expertise complémentaires, un seul interlocuteur pour tout votre digital.",
};

export default function ServicesRoute() {
  return <ServicesPage />;
}
