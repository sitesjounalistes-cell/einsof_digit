"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatProvider } from "@/components/chat/chat-context";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { OmnisOverlay } from "@/components/chat/OmnisOverlay";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress, CurtainIntro } from "@/components/motion";
import { ConsentBanner } from "@/components/site/ConsentBanner";
import { PwaPrompt } from "@/components/site/PwaPrompt";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { CustomCursor } from "@/components/site/CustomCursor";
import { AdminOverlay } from "@/components/admin/AdminOverlay";
import { RegisterServiceWorker } from "@/components/site/RegisterSW";
import { AnalyticsListener } from "@/lib/analytics";
import { onNavigate, onNavigatePath, scrollToSection } from "@/lib/chat-bus";
import { SECTION_ROUTES } from "@/lib/routes";

/**
 * Coquille partagée par toutes les pages (architecture multi-pages) :
 * navbar, footer, chat, overlays RGPD/PWA/admin + gestion des
 * transitions de page et de la navigation inter-pages du chatbot.
 */

/** Attend que la section existe dans le DOM (après changement de route). */
function scrollToSectionWhenReady(sectionId: string, deadline = 2500) {
  const start = performance.now();
  const tick = () => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      scrollToSection(sectionId);
      return;
    }
    if (performance.now() - start < deadline) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function SiteShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  /* Rideau d'ouverture : une seule fois par session (multi-pages) */
  const [curtain, setCurtain] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        if (!sessionStorage.getItem("eins-curtain")) {
          setCurtain(true);
          sessionStorage.setItem("eins-curtain", "1");
        }
      } catch {
        /* mode privé */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Navigation inter-pages (chatbot « navigate », liens profonds) */
  useEffect(
    () =>
      onNavigate((sectionId) => {
        const route = SECTION_ROUTES[sectionId];
        if (!route) return;
        const current = window.location.pathname;
        if (current === route.page) {
          scrollToSection(route.anchor ?? sectionId);
        } else {
          router.push(route.page);
          scrollToSectionWhenReady(route.anchor ?? sectionId);
        }
      }),
    [router]
  );

  /* Contrôle total du site (chatbot) : navigation directe par chemin
     — le modèle peut emmener le visiteur sur n'importe quelle page. */
  useEffect(
    () =>
      onNavigatePath((path) => {
        const current = window.location.pathname.replace(/\/$/, "");
        const target = path.replace(/\/$/, "") || "/";
        if (current === target || (target === "/" && current === "")) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          router.push(path);
        }
      }),
    [router]
  );

  /* main sans animation : chaque section anime sa propre entrée —
     un fondu d'entrée sur <main> risquerait de laisser la page entière
     invisible si les rAF sont gelés (onglet arrière-plan, capture, etc.) */
  return (
    <ChatProvider>
      <div className="flex min-h-screen flex-col">
        {curtain && <CurtainIntro />}
        <ScrollProgress />
        <CustomCursor />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <OmnisOverlay />
        <ConsentBanner />
        <PwaPrompt />
        <MobileActionBar />
        <AdminOverlay />
        <RegisterServiceWorker />
        {/* Tracking comportemental automatique (soumis au consentement §28) */}
        <AnalyticsListener />
      </div>
    </ChatProvider>
  );
}
