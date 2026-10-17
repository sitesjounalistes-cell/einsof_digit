"use client";

import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/translations";
import { brandizeDeep } from "@/lib/brand";

/**
 * Contenu de page localisé hors dictionnaire global.
 * Chaque page possède son module dans `src/lib/pages-content/`
 * (5 langues complètes) — évite les conflits d'édition sur
 * translations.ts et garde le contenu détaillé par page.
 *
 * Audit F-05 : le jeton « {brand} » des contenus est résolu ici — la marque
 * n'est jamais écrite en dur (variable NEXT_PUBLIC_BRAND_NAME).
 */
export type Localized<T> = Record<Lang, T>;

/** Rend le contenu localisé pour la langue courante (fallback fr). */
export function useLocalized<T>(content: Localized<T>): T {
  const { lang } = useI18n();
  return brandizeDeep((content[lang] ?? content.fr)) as T;
}

/** Version hors hook (composants serveur, helpers). */
export function pickLocalized<T>(content: Localized<T>, lang: Lang): T {
  return brandizeDeep((content[lang] ?? content.fr)) as T;
}
