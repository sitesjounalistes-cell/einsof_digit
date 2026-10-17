/**
 * Réglages du site — types & valeurs par défaut (module isomorphe).
 * Ce fichier est volontairement SANS dépendance serveur (pas de db) :
 * il est importable depuis les composants client (panneau admin, sections
 * publiques) comme depuis les routes API.
 *
 * La lecture base de données vit dans `src/lib/site-settings.ts` (serveur).
 */
import { BRAND } from "@/lib/brand";

/** Réseau social configuré (platform = clé d'icône : facebook, instagram, …) */
export interface SocialItem {
  platform: string;
  label: string;
  url: string;
}

/** Données publiques des réglages — toujours complet (défauts inclus). */
export interface SiteSettingsData {
  phones: string[];
  emails: string[];
  socials: SocialItem[];
  managerPhotoUrl: string | null;
  managerPhotoAlt: string | null;
  /** Mot du gérant — 2 paragraphes séparés par une ligne vide (\n\n). */
  managerMessageFr: string;
  managerName: string;
  managerRole: string;
}

/** Texte officiel du mot du gérant (défaut, éditable dans le panel). */
export const DEFAULT_MANAGER_MESSAGE = `Quand nous avons posé la première pierre d'${BRAND}, nous avions une conviction simple : les entreprises guinéennes méritent des outils numériques à la hauteur de leur ambition. Sept ans plus tard, cette conviction est devenue une méthode : écouter d'abord, chiffrer juste, livrer propre et rester présent après la mise en ligne.

Aujourd'hui, avec une équipe d'environ dix experts, nous accompagnons des clients dans toute la Guinée et au-delà — des prix annoncés d'avance, des engagements écrits noir sur blanc, et un accompagnement qui ne s'arrête pas à la livraison. Votre projet mérite cette exigence. Bienvenue chez ${BRAND}.`;

/**
 * Défauts : listes VIDE pour phones/emails/socials — le front public
 * garde alors son affichage actuel (fallback i18n). Le nom et le rôle
 * restent génériques : le client les éditera depuis l'Espace équipe.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  phones: [],
  emails: [],
  socials: [],
  managerPhotoUrl: null,
  managerPhotoAlt: null,
  managerMessageFr: DEFAULT_MANAGER_MESSAGE,
  managerName: "Le Gérant",
  managerRole: `Fondateur & Gérant — ${BRAND}`,
};

/** Clés de plateformes proposées dans le panel admin (icônes lucide). */
export const SOCIAL_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "autre", label: "Autre" },
] as const;
