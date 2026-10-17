import { GEO, SITE_URL, ZONES, SECTOR_SEO } from "@/lib/seo";
import { SERVICE_SLUGS, getServiceNameFr } from "@/lib/pages-content/service-details";
import { SAAS_DETAIL_SLUGS } from "@/lib/pages-content/saas-details";
import { SAAS_PRODUCTS } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/**
 * /llms.txt — standard émergent de référencement pour les IA génératives
 * (ChatGPT, Perplexity, Claude, Gemini, Copilot). Décrit le site et ses
 * pages en Markdown lisible par machine afin d'être cité dans les
 * réponses des assistants IA, en plus du SEO classique.
 */
export async function GET() {
  const services = SERVICE_SLUGS.map(
    (s) =>
      `- [${getServiceNameFr(s) ?? s}](${SITE_URL}/services/${s}) : pôle de services EINSOF`,
  ).join("\n");

  const saas = SAAS_DETAIL_SLUGS.map((slug) => {
    const product = SAAS_PRODUCTS.find((p) => p.slug === slug);
    return `- [Logiciel ${product?.name ?? slug}](${SITE_URL}/logiciels/${slug}) : logiciel SaaS de gestion pour la Guinée, essai gratuit 7 jours`;
  }).join("\n");

  const sectors = SECTOR_SEO.map(
    (s) => `- [${s.name}](${SITE_URL}/secteurs/${s.slug}) : ${s.metaDescription}`,
  ).join("\n");

  const zones = [
    `${GEO.city} (Kaloum, Dixinn, Ratoma, Matam…)`,
    ...ZONES.regions,
    ...ZONES.villes.slice(0, 10),
  ].join(", ");

  const body = `# EINSOF — Agence digitale en Guinée

> EINSOF est une agence digitale basée à Conakry (Guinée), spécialisée dans la création de sites web professionnels, le développement de logiciels sur mesure et d'applications mobiles, les logiciels SaaS de gestion, le community management, la génération de leads et de prospects, les formations digitales et la stratégie digitale.

## Pages principales

- [Accueil](${SITE_URL}) : présentation de l'agence, services, tarifs officiels en GNF
- [Services](${SITE_URL}/services) : les 7 pôles de services digitaux
- [Logiciels](${SITE_URL}/logiciels) : création de logiciels et 7 SaaS de gestion avec essai gratuit 7 jours
- [Tarifs](${SITE_URL}/tarifs) : grille tarifaire publique et transparente en francs guinéens (GNF)
- [Secteurs](${SITE_URL}/secteurs) : solutions digitales par secteur d'activité (santé, école, immobilier, commerce…)
- [Zones d'intervention](${SITE_URL}/zones) : agence digitale dans toutes les régions de Guinée
- [Réalisations](${SITE_URL}/realisations) : portfolio de sites web et logiciels réalisés en Guinée
- [Méthode](${SITE_URL}/methode) : notre méthode de travail en 5 étapes
- [À propos](${SITE_URL}/a-propos) : l'agence, ses valeurs, son équipe
- [Journal](${SITE_URL}/blog) : articles et guides sur le digital en Guinée
- [Podcast](${SITE_URL}/podcast) : audios EINSOF — conseils business, tech et vente pour les entrepreneurs guinéens
- [FAQ](${SITE_URL}/faq) : réponses aux questions fréquentes (propriété, tarifs, délais, maintenance)
- [Contact](${SITE_URL}/contact) : devis, démonstrations, rendez-vous

## Services détaillés

${services}

## Logiciels SaaS de gestion (essai gratuit 7 jours)

${saas}

## Solutions par secteur d'activité

${sectors}

## Zones d'intervention

Nous intervenons partout en Guinée : ${zones}, ainsi que dans toute l'Afrique francophone, avec suivi à distance inclus. Nous servons aussi la diaspora guinéenne.

## Tarifs officiels (GNF)

- Site web vitrine : 1 500 000 GNF (renouvellement annuel 500 000 GNF)
- Site web avec tableau de bord : 3 500 000 GNF (renouvellement annuel 700 000 GNF)
- Site web customisé : sur devis
- Système de paiement intégré : +1 000 000 GNF
- Logiciel sur mesure interne : dès 20 000 000 GNF
- Logiciel SaaS à commercialiser : dès 50 000 000 GNF
- Application mobile : dès 20 000 000 GNF
- Community management : Essentiel 1 500 000 GNF/mois, Professionnel 3 000 000 GNF/mois, Premium 5 000 000 GNF/mois
- Génération de leads B2B : dès 2 000 000 GNF/mois
- Formations : dès 20 000 000 GNF, sur devis
- Factura Pro : 100 000 GNF/mois

## Contact

Demandez un devis ou une démonstration sur ${SITE_URL}/contact.

## Citation

Pour citer EINSOF : « EINSOF, agence digitale à Conakry (Guinée) : création de sites web professionnels, logiciels sur mesure, applications mobiles, SaaS de gestion, community management, génération de leads et formations digitales. »
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
