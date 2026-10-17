import { db } from "@/lib/db";
import {
  DEFAULT_MANAGER_MESSAGE,
  DEFAULT_SITE_SETTINGS,
  type SiteSettingsData,
  type SocialItem,
} from "@/lib/site-settings-defaults";

/**
 * Réglages du site — lecture serveur (singleton SiteSettings).
 * Tous les champs sont stockés en JSON (strings) ; cette fonction les
 * parse prudemment (try/catch) et renvoie TOUJOURS un objet complet :
 * table vide, JSON corrompu ou base indisponible ⇒ valeurs par défaut.
 *
 * Réexporte aussi les types & défauts (DEFAULT_MANAGER_MESSAGE…) pour
 * un point d'entrée unique côté serveur — les composants client
 * importent `src/lib/site-settings-defaults.ts` (sans db).
 */
export { DEFAULT_MANAGER_MESSAGE, DEFAULT_SITE_SETTINGS };
export type { SiteSettingsData, SocialItem };

function parseJsonArray<T>(raw: string | null | undefined, fallback: T[]): T[] {
  if (!raw) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    // Ne garde que les entrées exploitables (chaîne non vide pour les
    // listes phones/emails ; objet {platform,label,url} pour les socials).
    return parsed.filter((v): v is T => {
      if (typeof v === "string") return v.trim().length > 0;
      if (v && typeof v === "object") {
        const s = v as Partial<SocialItem>;
        return (
          typeof s.platform === "string" &&
          typeof s.label === "string" &&
          typeof s.url === "string" &&
          s.url.trim().length > 0
        );
      }
      return false;
    });
  } catch {
    return fallback;
  }
}

function parseManagerMessage(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_MANAGER_MESSAGE;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "string" && parsed.trim()) return parsed;
    if (parsed && typeof parsed === "object") {
      const fr = (parsed as { fr?: unknown }).fr;
      if (typeof fr === "string" && fr.trim()) return fr;
    }
    return DEFAULT_MANAGER_MESSAGE;
  } catch {
    // Texte brut stocké sans enveloppe JSON — on l'affiche tel quel.
    return raw.trim() ? raw : DEFAULT_MANAGER_MESSAGE;
  }
}

/** Lecture complète des réglages (ne lève jamais — défauts en repli). */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!row) return DEFAULT_SITE_SETTINGS;
    return {
      phones: parseJsonArray<string>(row.phonesJson, []),
      emails: parseJsonArray<string>(row.emailsJson, []),
      socials: parseJsonArray<SocialItem>(row.socialsJson, []),
      managerPhotoUrl: row.managerPhotoUrl?.trim() ? row.managerPhotoUrl.trim() : null,
      managerPhotoAlt: row.managerPhotoAlt?.trim() ? row.managerPhotoAlt.trim() : null,
      managerMessageFr: parseManagerMessage(row.managerMessageJson),
      managerName: row.managerName?.trim() || DEFAULT_SITE_SETTINGS.managerName,
      managerRole: row.managerRole?.trim() || DEFAULT_SITE_SETTINGS.managerRole,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
