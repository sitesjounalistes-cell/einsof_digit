import type { Lang } from "@/lib/i18n/translations";
import type { LocalizedServiceDetails, ServiceDetail, ServiceSlug } from "./types";
import { SERVICE_DETAILS_FR } from "./fr";
import { SERVICE_DETAILS_EN } from "./en";
import { SERVICE_DETAILS_ES } from "./es";
import { SERVICE_DETAILS_ZH } from "./zh";
import { SERVICE_DETAILS_DE } from "./de";

export type { ServiceDetail, ServiceSlug, ServicePriceRef } from "./types";

/** Pages de services, 5 langues (fallback fr). */
export const SERVICE_DETAILS: Record<Lang, LocalizedServiceDetails> = {
  fr: SERVICE_DETAILS_FR,
  en: SERVICE_DETAILS_EN,
  es: SERVICE_DETAILS_ES,
  zh: SERVICE_DETAILS_ZH,
  de: SERVICE_DETAILS_DE,
};

export const SERVICE_SLUGS: ServiceSlug[] = [
  "web",
  "software",
  "saas",
  "community",
  "acquisition",
  "training",
  "strategy",
];

/** Version hors hook (metadata serveur) : libellé du pôle en fr. */
export function getServiceNameFr(slug: string): string | null {
  const detail = SERVICE_DETAILS_FR[slug as ServiceSlug];
  return detail ? detail.name : null;
}
