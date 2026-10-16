"use client";

/**
 * Decoupled event bus so any component (hero CTA, pricing, chatbot…)
 * can open the chat, navigate to a section or prefill a form —
 * without import cycles.
 */

export type OpenFormType = "trial" | "demo" | "quote" | "contact";

const CHAT_OPEN = "eins:chat-open";
const NAVIGATE = "eins:navigate";
const OPEN_FORM = "eins:open-form";
const CHAT_PREFILL = "eins:chat-prefill";

export function openChat(prefill?: string) {
  window.dispatchEvent(new CustomEvent(CHAT_OPEN, { detail: { prefill } }));
}

export function onChatOpen(handler: (prefill?: string) => void) {
  const fn = (e: Event) =>
    handler((e as CustomEvent).detail?.prefill as string | undefined);
  window.addEventListener(CHAT_OPEN, fn);
  return () => window.removeEventListener(CHAT_OPEN, fn);
}

export function chatPrefill(text: string) {
  window.dispatchEvent(new CustomEvent(CHAT_PREFILL, { detail: { text } }));
}

export function onChatPrefill(handler: (text: string) => void) {
  const fn = (e: Event) => handler((e as CustomEvent).detail?.text as string);
  window.addEventListener(CHAT_PREFILL, fn);
  return () => window.removeEventListener(CHAT_PREFILL, fn);
}

export function navigateToSection(sectionId: string) {
  window.dispatchEvent(new CustomEvent(NAVIGATE, { detail: { sectionId } }));
}

/**
 * Navigation intelligente multi-pages : l'événement est intercepté par
 * SiteShell qui change de route si la section vit sur une autre page
 * (voir SECTION_ROUTES dans lib/routes.ts), sinon défile sur place.
 */
export function navigateSmart(sectionId: string) {
  navigateToSection(sectionId);
}

/* ── Navigation par chemin (contrôle total du site par le chatbot) ── */
const NAVIGATE_PATH = "eins:navigate-path";

/** Envoie le visiteur vers une page précise du site (ex. /services/web). */
export function navigateToPath(path: string) {
  window.dispatchEvent(new CustomEvent(NAVIGATE_PATH, { detail: { path } }));
}

export function onNavigatePath(handler: (path: string) => void) {
  const fn = (e: Event) => handler((e as CustomEvent).detail?.path as string);
  window.addEventListener(NAVIGATE_PATH, fn);
  return () => window.removeEventListener(NAVIGATE_PATH, fn);
}

export function onNavigate(handler: (sectionId: string) => void) {
  const fn = (e: Event) =>
    handler((e as CustomEvent).detail?.sectionId as string);
  window.addEventListener(NAVIGATE, fn);
  return () => window.removeEventListener(NAVIGATE, fn);
}

const PENDING_FORM = "eins:open-form-pending";

export function openForm(type: OpenFormType, prefill?: Record<string, string>) {
  if (typeof window === "undefined") return;
  /* Architecture multi-pages : le formulaire de contact vit sur /contact.
     Depuis une autre page, on mémorise la demande puis on y navigue —
     ContactSection consomme la demande au montage (préremplissage). */
  if (window.location.pathname !== "/contact") {
    try {
      sessionStorage.setItem(PENDING_FORM, JSON.stringify({ type, prefill }));
    } catch {
      /* mode privé */
    }
    window.location.assign("/contact");
    return;
  }
  window.dispatchEvent(new CustomEvent(OPEN_FORM, { detail: { type, prefill } }));
}

/** Consomme une demande en attente (déposée par une autre page). */
export function consumePendingForm(): { type: OpenFormType; prefill?: Record<string, string> } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_FORM);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_FORM);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function onOpenForm(
  handler: (type: OpenFormType, prefill?: Record<string, string>) => void
) {
  const fn = (e: Event) => {
    const d = (e as CustomEvent).detail;
    handler(d?.type, d?.prefill);
  };
  window.addEventListener(OPEN_FORM, fn);
  return () => window.removeEventListener(OPEN_FORM, fn);
}

export function scrollToSection(sectionId: string) {
  const el = document.getElementById(`section-${sectionId}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.remove("section-flash");
  // restart the flash animation
  void el.offsetWidth;
  el.classList.add("section-flash");
  setTimeout(() => el.classList.remove("section-flash"), 1600);
}

/* ── Admin overlay ──────────────────────────────────────── */

const ADMIN_TOGGLE = "eins:admin-toggle";

export function toggleAdmin() {
  window.dispatchEvent(new CustomEvent(ADMIN_TOGGLE));
}

export function onAdminToggle(handler: () => void) {
  const fn = () => handler();
  window.addEventListener(ADMIN_TOGGLE, fn);
  return () => window.removeEventListener(ADMIN_TOGGLE, fn);
}
