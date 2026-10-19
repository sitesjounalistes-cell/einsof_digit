"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { DICTS, type Dict, type Lang, LANGS } from "./translations";

/* ── External store (localStorage, défaut fr) — hydration safe ── */

let currentLang: Lang = "fr";
const langListeners = new Set<() => void>();

function emitLang() {
  langListeners.forEach((l) => l());
}

function subscribeLang(fn: () => void) {
  langListeners.add(fn);
  return () => langListeners.delete(fn);
}

function loadLang() {
  /* Français par défaut pour tous — y compris les robots (Googlebot
     rend la page en Chrome en-US : l'auto-détection navigator.language
     faisait indexer le contenu ANGLAIS du site, marché guinéen FR.
     L'anglais reste disponible via le sélecteur explicite, persisté. */
  let next: Lang = "fr";
  try {
    const saved = localStorage.getItem("eins-lang") as Lang | null;
    if (saved && LANGS.some((l) => l.code === saved)) next = saved;
  } catch {
    /* private mode */
  }
  if (next !== currentLang) {
    currentLang = next;
    emitLang();
  }
}

function setLangStore(l: Lang) {
  if (l === currentLang) return;
  currentLang = l;
  try {
    localStorage.setItem("eins-lang", l);
  } catch {
    /* ignore */
  }
  emitLang();
}

/* ── Resolution helpers ─────────────────────────────────────── */

function resolve(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const key of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Resolve a dotted path, e.g. t("hero.ctaPrimary"). Falls back to fr. */
  t: (path: string) => string;
  /** Resolve a dotted path to any value (arrays, objects). */
  tr: <T = unknown>(path: string) => T | undefined;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "fr",
  setLang: () => {},
  t: (p) => p,
  tr: () => undefined,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribeLang, () => currentLang, () => "fr" as Lang);

  useEffect(() => {
    loadLang();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangStore(l), []);

  const t = useCallback(
    (path: string): string => {
      const v = resolve(DICTS[lang], path) ?? resolve(DICTS.fr, path);
      return typeof v === "string" ? v : path;
    },
    [lang]
  );

  const tr = useCallback(
    <T,>(path: string): T | undefined => {
      const v = resolve(DICTS[lang], path) ?? resolve(DICTS.fr, path);
      return (v as T) ?? undefined;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t, tr }), [lang, setLang, t, tr]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

export { LANGS };
export type { Lang, Dict };
