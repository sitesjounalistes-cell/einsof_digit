import type { Lang } from "@/lib/i18n/translations";
import type { LocalizedSaasDetails, SaasDetail, SaasSlug } from "./types";
import { SAAS_DETAILS_FR } from "./fr";
import { SAAS_DETAILS_EN } from "./en";
import { SAAS_DETAILS_ES } from "./es";
import { SAAS_DETAILS_ZH } from "./zh";
import { SAAS_DETAILS_DE } from "./de";

export type { SaasDetail, SaasSlug } from "./types";

/** Pages des logiciels SaaS, 5 langues (fallback fr). */
export const SAAS_DETAILS: Record<Lang, LocalizedSaasDetails> = {
  fr: SAAS_DETAILS_FR,
  en: SAAS_DETAILS_EN,
  es: SAAS_DETAILS_ES,
  zh: SAAS_DETAILS_ZH,
  de: SAAS_DETAILS_DE,
};

export const SAAS_DETAIL_SLUGS: SaasSlug[] = [
  "factura-pro",
  "gestion-comptable",
  "gestion-hospitaliere",
  "gestion-ecole",
  "gestion-immobiliere",
  "gestion-pharmacie",
];

/** Version hors hook (metadata serveur) : nom du produit en fr. */
export function getSaasNameFr(slug: string): string | null {
  const detail = SAAS_DETAILS_FR[slug as SaasSlug];
  return detail ? detail.name : null;
}
