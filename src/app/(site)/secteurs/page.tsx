import type { Metadata } from "next";
import { SecteursPage } from "@/components/pages/SecteursPage";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `Secteurs — ${BRAND}`,
  description:
    "14 secteurs servis, sans exception : santé, éducation, immobilier, commerce, banque, mines… des solutions adaptées aux réalités du terrain en Guinée.",
};

export default function SecteursRoute() {
  return <SecteursPage />;
}
