/**
 * Colonnes JSON par locale (spec §20.8) : {"fr":"…","en":"…"} avec repli fr.
 * SQLite ne connaît pas JSONB : les champs sont des strings JSON encodées.
 */

export type LocaleMap = Record<string, string>;

export function parseLocaleJson(raw: string | null | undefined): LocaleMap {
  if (!raw) return {};
  try {
    const v: unknown = JSON.parse(raw);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const out: LocaleMap = {};
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (typeof val === "string") out[k] = val;
      }
      return out;
    }
    return {};
  } catch {
    return {};
  }
}

/** Choisit la langue demandée, avec repli fr → en → première disponible. */
export function pickLocale(obj: LocaleMap, locale: string): string {
  return obj[locale] ?? obj.fr ?? obj.en ?? Object.values(obj)[0] ?? "";
}
