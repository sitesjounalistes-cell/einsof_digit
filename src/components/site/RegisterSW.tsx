"use client";

import { useEffect } from "react";

/**
 * Enregistre le service worker (mode production uniquement).
 *
 * INTÉGRITÉ D'HYDRATATION : en développement (aperçu), un SW qui sert un
 * HTML périmé (précaché lors d'une compile antérieure) pendant que le JS
 * neuf s'exécute produit le mismatch systématique des ids Radix
 * (« radix-_R_… » ≠ « radix-_r_… »). Le SW est donc DÉSACTIVÉ en dev et
 * tout enregistrement + cache résiduel est purgé au passage.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      /* Purge : désinstalle tout SW résiduel (sessions précédentes) et
         vide les caches « einsof-* » pour ne jamais resservir un HTML
         d'une compile antérieure. */
      navigator.serviceWorker.getRegistrations?.().then((regs) => {
        for (const reg of regs) void reg.unregister();
      }).catch(() => {});
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const k of keys) if (k.startsWith("einsof-")) void caches.delete(k);
        }).catch(() => {});
      }
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline mode unavailable — silently ignored */
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
