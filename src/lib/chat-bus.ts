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

export function onNavigate(handler: (sectionId: string) => void) {
  const fn = (e: Event) =>
    handler((e as CustomEvent).detail?.sectionId as string);
  window.addEventListener(NAVIGATE, fn);
  return () => window.removeEventListener(NAVIGATE, fn);
}

export function openForm(type: OpenFormType, prefill?: Record<string, string>) {
  window.dispatchEvent(new CustomEvent(OPEN_FORM, { detail: { type, prefill } }));
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
