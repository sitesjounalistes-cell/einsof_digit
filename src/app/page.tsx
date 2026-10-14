"use client";

import { ChatProvider } from "@/components/chat/chat-context";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { OmnisOverlay } from "@/components/chat/OmnisOverlay";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { StatsSection } from "@/components/site/StatsSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { PillarsSection } from "@/components/site/PillarsSection";
import { SaasSection } from "@/components/site/SaasSection";
import { SectorsSection } from "@/components/site/SectorsSection";
import { ProcessSection } from "@/components/site/ProcessSection";
import { PricingSection } from "@/components/site/PricingSection";
import { FaqSection } from "@/components/site/FaqSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ProjectsSection } from "@/components/site/ProjectsSection";
import { JournalSection } from "@/components/site/JournalSection";
import { PartnersSection } from "@/components/site/PartnersSection";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { DocumentsSection } from "@/components/site/DocumentsSection";
import { TrialSection } from "@/components/site/TrialSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress, CurtainIntro } from "@/components/motion";
import { ConsentBanner } from "@/components/site/ConsentBanner";
import { PwaPrompt } from "@/components/site/PwaPrompt";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { CustomCursor } from "@/components/site/CustomCursor";
import { AdminOverlay } from "@/components/admin/AdminOverlay";
import { RegisterServiceWorker } from "@/components/site/RegisterSW";

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex min-h-screen flex-col">
        <CurtainIntro />
        <ScrollProgress />
        <CustomCursor />
        <Navbar />
        <main className="flex-1">
          <Hero />
          <StatsSection />
          <ServicesSection />
          <PillarsSection />
          <SaasSection />
          <SectorsSection />
          <ProcessSection />
          <PricingSection />
          <FaqSection />
          <AboutSection />
          <ProjectsSection />
          <JournalSection />
          <PartnersSection />
          <TestimonialsSection />
          <DocumentsSection />
          <TrialSection />
          <ContactSection />
        </main>
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
