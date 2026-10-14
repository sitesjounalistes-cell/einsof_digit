/**
 * Base de connaissances du chatbot — construite STRICTEMENT à partir du cahier
 * des charges (services §1, tarifs §19, politiques §19.3, §12, FAQ dérivée).
 * Règle stricte : le chatbot ne cite que ce qui figure ici (spec §27).
 */

import {
  SAAS_PRODUCTS,
  WEB_OFFERS,
  WEB_RENEWAL,
  SOFTWARE_OFFERS,
  formatGNF,
} from "@/lib/catalog";
import { BRAND } from "@/lib/brand";

function priceLine(o: {
  amount: number | null;
  period: string;
  isFrom?: boolean;
  isQuoteOnly?: boolean;
  billableMonths?: number;
}): string {
  if (o.isQuoteOnly || o.amount === null) return "sur devis";
  const amount = formatGNF(o.amount);
  const per =
    o.period === "month" ? "par mois" : o.period === "year" ? "par an" : "au total";
  const from = o.isFrom ? "à partir de " : "";
  const months = o.billableMonths ? ` (${o.billableMonths} mois facturés par an)` : "";
  return `${from}${amount} ${per}${months}`;
}

export function buildKnowledgeBase(): string {
  const web = WEB_OFFERS.map((o) => `- ${o.name} : ${priceLine(o)}${o.footnote ? ` — ${o.footnote}` : ""}`).join("\n");
  const software = SOFTWARE_OFFERS.map((o) => `- ${o.name} : ${priceLine(o)}${o.footnote ? ` — ${o.footnote}` : ""}`).join("\n");
  const saas = SAAS_PRODUCTS.map((p) => {
    const lines = p.offers.map((o) => `${o.name} : ${priceLine(o)}`).join(" | ");
    return `- ${p.name} : ${lines}`;
  }).join("\n");

  return `BASE DE CONNAISSANCES — ${BRAND} (agence digitale guinéenne)

ENTREPRISE
- Agence digitale guinéenne avec 7 ans d'expérience, équipe d'environ 10 personnes.
- Pôles : sites web, logiciels sur mesure et applications mobiles, SaaS de gestion, community management, acquisition client, formations. Stratégie d'entreprise : offre à venir.
- Secteurs servis : tous secteurs (BTP, mines, santé, éducation, immobilier, banque et microfinance, commerce, hôtellerie, transport, agriculture, ONG, télécoms, médias, recrutement…).

SITES WEB (tarifs exacts)
${web}
- Renouvellement annuel : ${priceLine(WEB_RENEWAL)} (nom de domaine et hébergement).
- Inclus dans chaque site : nom de domaine, hébergement, deux adresses e-mail professionnelles (selon forfait), tableau de bord (sauf si refusé), correction des bugs, mode clair/sombre, traduction en plusieurs langues, chatbot écrit, formulaires de capture de contacts.
- Tableau de bord client : un seul administrateur ; le client gère environ 70 % de son site ; pas de création de pages supplémentaires ; multi-utilisateurs ou multi-administrateurs sur devis.
- Sur devis : chatbot WhatsApp connecté au site, système d'e-mailing, multi-utilisateurs, multi-administrateurs, toute fonctionnalité avancée.

LOGICIELS SUR MESURE
${software}
- Les bugs des logiciels sont corrigés sans frais pendant toute la durée de la collaboration.

SAAS (tarifs exacts, en GNF)
${saas}

POLITIQUE BUGS (argument clé n°1)
- « Bugs, failles, erreurs : nous nous en chargeons, sans frais supplémentaires. »
- Engagement valable pendant toute la collaboration ; les NOUVELLES fonctionnalités sont facturées à part.

ARGUMENT CLÉ n°2
- Des services plus complets que la moyenne : site, tableau de bord, chatbot et capture de contacts dès l'offre de base ; un seul partenaire pour le site, le logiciel, les réseaux sociaux et l'acquisition de clients.
- Ne jamais prétendre être le moins cher ; ne jamais attaquer la concurrence.

ESSAIS ET DÉMOS
- Essai gratuit de 7 jours sur chaque SaaS, une fois par personne et par logiciel ; formulaire court (prénom, nom, téléphone) ; l'équipe active l'accès et rappelle le visiteur.
- Démo personnalisée avec un conseiller : réservation via le formulaire de contact ou l'assistant ; réponse sous 24 heures ouvrées.

TÉMOIGNAGES / RÉALISATIONS / PARTENAIRES
- Aucun élément publié pour le moment : ne jamais citer de client, de projet ou de partenaire nommé.

CONTACT
- Formulaire de contact sur le site (réponse sous 24 h ouvrées) ; WhatsApp en cours d'activation ; adresse en Guinée (détails à confirmer).

FAQ
- Combien coûte un site ? Trois offres : vitrine 1 500 000 GNF, avec tableau de bord 2 500 000 GNF, boutique en ligne 3 500 000 GNF ; renouvellement annuel 500 000 GNF.
- Les bugs sont-ils payants ? Non, gratuits pendant toute la collaboration ; nouvelles fonctionnalités facturées.
- Puis-je gérer mon site ? Oui avec le tableau de bord (environ 70 % du site), un seul administrateur.
- Moyens de paiement ? Définis avec l'équipe au devis ; Mobile Money couramment utilisé en Guinée.
- Formations ? Catalogue en cours de finalisation, sur devis.
- Community management ? Avec ou sans création de contenu, équipe terrain dédiée, sur devis.
- Acquisition client ? Stratégies de génération de leads, sur devis.`;
}

export const KNOWLEDGE = buildKnowledgeBase();
