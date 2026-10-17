"use client";

import React, { useEffect, useRef, useState } from "react";
import { useConsent } from "@/lib/consent";
import { useI18n } from "@/lib/i18n";
import { GoldButton } from "@/components/site/kit";
import { track } from "@/lib/analytics";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

const VISITS_KEY = "eins-visits";
const VISIT_SESSION_KEY = "eins-visit-counted";
const DISMISS_KEY = "eins-pwa-dismissed";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const ELAPSED_MS = 45_000;

/**
 * Invitation à l'installation PWA — une seule invitation à la fois :
 * jamais pendant le bandeau de consentement (decision requise d'abord),
 * pas en mode standalone, pas pendant 30 jours après un « Plus tard »,
 * et seulement à partir de la 2ᵉ visite ou après 45 s sur la page.
 */
export function PwaPrompt() {
  const { decided } = useConsent();
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [iosSteps, setIosSteps] = useState(false);
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const closedRef = useRef(false);

  useEffect(() => {
    if (!decided) return;

    /* Compteur de visites — incrémenté une fois par session */
    let visits = 1;
    try {
      if (!sessionStorage.getItem(VISIT_SESSION_KEY)) {
        sessionStorage.setItem(VISIT_SESSION_KEY, "1");
        visits = (Number(localStorage.getItem(VISITS_KEY)) || 0) + 1;
        localStorage.setItem(VISITS_KEY, String(visits));
      } else {
        visits = Number(localStorage.getItem(VISITS_KEY)) || 1;
      }
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY)) || 0;
      if (dismissedAt && Date.now() - dismissedAt < THIRTY_DAYS_MS) return;
    } catch {
      return; /* stockage indisponible : pas d'invitation */
    }
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      deferred.current = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", onBip);

    const maybeShow = () => {
      if (!closedRef.current) setVisible(true);
    };
    const timers: number[] = [];
    if (visits >= 2) timers.push(window.setTimeout(maybeShow, 400));
    timers.push(window.setTimeout(maybeShow, ELAPSED_MS));

    const onInstalled = () => {
      track("pwa_installed");
      closedRef.current = true;
      setVisible(false);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [decided]);

  if (!decided || !visible) return null;

  const close = () => {
    closedRef.current = true;
    setVisible(false);
    setIosSteps(false);
  };

  const dismissLater = () => {
    track("pwa_prompt_dismissed");
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    close();
  };

  const install = async () => {
    track("pwa_prompt_accepted");
    const ev = deferred.current;
    if (!ev) {
      setIosSteps(true);
      return;
    }
    try {
      await ev.prompt();
    } catch {
      /* ignore */
    }
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    close();
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("pwa.t")}
      className="fixed bottom-4 left-4 right-4 z-[80] animate-in fade-in-0 slide-in-from-bottom-4 duration-500 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm"
    >
      <div className="glass-panel rounded-xl p-5 shadow-2xl">
        <h3 className="font-serif text-lg">{t("pwa.t")}</h3>

        {iosSteps ? (
          <>
            <p className="mt-2 text-sm font-medium">{t("pwa.iosT")}</p>
            <ol className="mt-3 flex flex-col gap-2.5">
              {(["pwa.ios1", "pwa.ios2", "pwa.ios3"] as const).map((key, i) => (
                <li key={key} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-surface/60 font-serif text-xs text-goldtext"
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-mute">{t(key)}</span>
                </li>
              ))}
            </ol>
            <GoldButton variant="primary" className="mt-4! w-full min-h-11! text-xs!" onClick={close}>
              {t("pwa.done")}
            </GoldButton>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-mute">{t("pwa.d")}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <GoldButton
                variant="primary"
                className="min-h-11! px-5! text-xs!"
                onClick={() => void install()}
              >
                {t("pwa.install")}
              </GoldButton>
              <GoldButton
                variant="outline"
                className="min-h-11! px-5! text-xs!"
                onClick={dismissLater}
              >
                {t("pwa.later")}
              </GoldButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
