"use client";

import React, { useState } from "react";
import { useConsent } from "@/lib/consent";
import { useI18n } from "@/lib/i18n";
import { GoldButton } from "@/components/site/kit";
import { Switch } from "@/components/ui/switch";

/**
 * Bandeau de consentement (spéc. §28) — affiché tant que le visiteur
 * n'a pas fait son choix. Trois catégories : essentiels (verrouillés),
 * statistiques anonymes, conservation des conversations.
 */
export function ConsentBanner() {
  const { decided, analytics, chatStorage, decide } = useConsent();
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [ana, setAna] = useState(false);
  const [chat, setChat] = useState(false);

  if (decided) return null;

  const openCustom = () => {
    setAna(analytics);
    setChat(chatStorage);
    setExpanded(true);
  };

  const rows: { name: string; desc: string; locked: boolean; value: boolean; set: (v: boolean) => void }[] = [
    { name: t("consent.cats.ess"), desc: t("consent.essD"), locked: true, value: true, set: () => {} },
    { name: t("consent.cats.ana"), desc: t("consent.anaD"), locked: false, value: ana, set: setAna },
    { name: t("consent.cats.chat"), desc: t("consent.chatD"), locked: false, value: chat, set: setChat },
  ];

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("consent.t")}
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[85] animate-in fade-in-0 slide-in-from-bottom-4 duration-500 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md"
    >
      <div className="glass-panel rounded-xl p-5 shadow-2xl">
        <h3 className="font-serif text-lg">{t("consent.t")}</h3>
        <p className="mt-2 text-sm text-mute">{t("consent.d")}</p>

        {!expanded ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <GoldButton
              variant="primary"
              className="min-h-11! px-5! text-xs!"
              onClick={() => decide(true, true)}
            >
              {t("consent.accept")}
            </GoldButton>
            <GoldButton
              variant="outline"
              className="min-h-11! px-5! text-xs!"
              onClick={() => decide(false, false)}
            >
              {t("consent.refuse")}
            </GoldButton>
            <GoldButton
              variant="ghost"
              className="min-h-11! text-sm! underline underline-offset-4"
              onClick={openCustom}
              ariaLabel={t("consent.custom")}
            >
              {t("consent.custom")}
            </GoldButton>
          </div>
        ) : (
          <div className="mt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface/60 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{row.name}</p>
                    <p className="mt-0.5 text-xs text-mute">{row.desc}</p>
                  </div>
                  <Switch
                    checked={row.value}
                    disabled={row.locked}
                    onCheckedChange={row.set}
                    aria-label={row.name}
                  />
                </div>
              ))}
            </div>
            <GoldButton
              variant="primary"
              className="mt-3! w-full min-h-11! text-xs!"
              onClick={() => decide(ana, chat)}
            >
              {t("consent.save")}
            </GoldButton>
          </div>
        )}
      </div>
    </div>
  );
}
