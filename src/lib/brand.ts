/**
 * Brand configuration — never hardcode the brand name in components.
 * Provisional name (see docs/TODO-HUMAN.md — H-01: final name & logo to be confirmed).
 */
export const BRAND =
  process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const BRAND_INITIAL = BRAND.charAt(0);

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export const waLink = (message?: string) =>
  WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}${
        message ? `?text=${encodeURIComponent(message)}` : ""
      }`
    : "";

/**
 * Applique la marque courante à un texte de contenu ou de traduction.
 * Deux formes sont remplacées (audit F-05 — « jamais EINSOF en dur ») :
 *  - le jeton explicite « {brand} » (utilisé dans les contenus/traductions) ;
 *  - le littéral « EINSOF » (filet de sécurité pour les textes non migrés).
 */
export function brandize(text: string): string {
  return text.split("{brand}").join(BRAND).split("EINSOF").join(BRAND);
}

/** brandize appliqué en profondeur à une structure de contenu
 *  (traductions et contenus de pages utilisent le jeton « {brand} »). */
export function brandizeDeep<T>(value: T): T {
  if (typeof value === "string") return brandize(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => brandizeDeep(v)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = brandizeDeep(v);
    }
    return out as unknown as T;
  }
  return value;
}
