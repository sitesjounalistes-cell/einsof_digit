"use client";

import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { GoldButton } from "@/components/site/kit";
import { onChatOpen } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";

/**
 * Barre d'action mobile (spéc. §24) — apparaît après 30 % de défilement,
 * se cache près du bas de page (footer visible) et définitivement après
 * l'ouverture du chat. Masquée sur desktop (md:hidden), laisse la place
 * au bouton flottant du chat (pr-16) et respecte la safe-area iOS.
 */
export function MobileActionBar() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const chatUsedRef = useRef(false);

  useEffect(() => {
    const update = () => {
      if (chatUsedRef.current) return;
      const doc = document.documentElement;
      const docH = Math.max(doc.scrollHeight, document.body.scrollHeight);
      const vh = window.innerHeight;
      const scrollable = docH - vh;
      const y = window.scrollY;
      const scrolledEnough = scrollable > 0 && y > scrollable * 0.3;
      const nearBottom = y + vh > docH - 200;
      setVisible(scrolledEnough && !nearBottom);
    };

    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const raf = requestAnimationFrame(update);

    const offChat = onChatOpen(() => {
      chatUsedRef.current = true;
      setVisible(false);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      offChat();
    };
  }, []);

  return (
    <nav
      aria-label="Actions rapides"
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-[75] glass-panel border-t border-line px-4 py-3 pr-16 flex gap-3 transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <GoldButton
        variant="primary"
        className="min-h-11 flex-1 px-3! text-xs!"
        href="/logiciels#section-trial"
        onClick={() => trackCta("mobilebar", "trial")}
      >
        {t("mobilebar.trial")}
      </GoldButton>
      <GoldButton
        variant="outline"
        className="min-h-11 flex-1 px-3! text-xs!"
        href="/contact"
        onClick={() => trackCta("mobilebar", "quote")}
      >
        {t("mobilebar.quote")}
      </GoldButton>
    </nav>
  );
}
