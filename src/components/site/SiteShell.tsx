"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChatProvider } from "@/components/chat/chat-context";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { OmnisOverlay } from "@/components/chat/OmnisOverlay";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress, CurtainIntro, EASE } from "@/components/motion";
import { ConsentBanner } from "@/components/site/ConsentBanner";
import { PwaPrompt } from "@/components/site/PwaPrompt";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { CustomCursor } from "@/components/site/CustomCursor";
import { AdminOverlay } from "@/components/admin/AdminOverlay";
import { RegisterServiceWorker } from "@/components/site/RegisterSW";
import { useMotionMode } from "@/components/providers";
import { onNavigate, scrollToSection } from "@/lib/chat-bus";
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
  const { lightMode } = useMotionMode();
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

  const mainContent = lightMode ? (
    <main className="flex-1">{children}</main>
  ) : (
    <motion.main
      className="flex-1"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.main>
  );

  return (
    <ChatProvider>
      <div className="flex min-h-screen flex-col">
        {curtain && <CurtainIntro />}
        <ScrollProgress />
        <CustomCursor />
        <Navbar />
        {mainContent}
        <Footer />
        <ChatWidget />
        <OmnisOverlay />
        <ConsentBanner />
        <PwaPrompt />
        <MobileActionBar />
        <AdminOverlay />
        <RegisterServiceWorker />
      </div>
    </ChatProvider>
  );
}
