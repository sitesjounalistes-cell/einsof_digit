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
