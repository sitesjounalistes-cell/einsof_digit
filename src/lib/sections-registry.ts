/**
 * Sections registry — stable ids used by the chatbot navigation (data-section-id)
 * and by analytics. Single-page architecture (sandbox constraint): sections are
 * anchors of the home route.
 */
export interface SectionDef {
  id: string;
  fr: string;
}

export const SECTIONS: SectionDef[] = [
  { id: "hero", fr: "Accueil" },
  { id: "stats", fr: "Chiffres clés" },
  { id: "services", fr: "Services" },
  { id: "pillars", fr: "Nos engagements" },
  { id: "saas", fr: "Logiciels SaaS" },
  { id: "sectors", fr: "Secteurs d'activité" },
  { id: "process", fr: "Méthode de travail" },
  { id: "pricing", fr: "Tarifs" },
  { id: "faq", fr: "Questions fréquentes" },
  { id: "about", fr: "À propos" },
  { id: "trial", fr: "Essai gratuit" },
  { id: "contact", fr: "Contact" },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);

export function isValidSection(id: string): boolean {
  return SECTION_IDS.includes(id);
}
