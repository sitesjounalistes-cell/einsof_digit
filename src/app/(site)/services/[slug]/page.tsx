import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/pages/ServiceDetailPage";
import { JsonLd } from "@/components/site/JsonLd";
import {
  SERVICE_DETAILS,
  SERVICE_SLUGS,
  type ServiceSlug,
} from "@/lib/pages-content/service-details";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";
import { BRAND } from "@/lib/brand";

/** Pages statiques : un paramètre par pôle de service. */
export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

/* Metadata ciblée par pôle : chaque page attaque SA longue traîne
   (« création de site web en Guinée », « création de logiciels en
   Guinée », « community management Guinée », « génération de leads »,
   « formation informatique Guinée »…). */
const SEO_BY_SLUG: Record<
  ServiceSlug,
  { title: string; description: string; keywords: string[] }
> = {
  web: {
    title: `Création de site web en Guinée — Vitrine dès 1 500 000 GNF`,
    description:
      "Création de site web professionnel en Guinée : site vitrine 1 500 000 GNF, site avec tableau de bord 3 500 000 GNF, site customisé sur devis. Domaine, hébergement, e-mails professionnels, chatbot IA, SEO et indexation Google inclus. Paiement unique, prix annoncés d'avance.",
    keywords: [
      "création de site web en Guinée",
      "création de site web professionnel en Guinée",
      "agence de création de site web en Guinée",
      "site web vitrine Guinée prix",
      "site web avec tableau de bord Guinée",
      "création site internet Conakry",
      "boutique en ligne Guinée",
      "référencement site web Guinée",
      "chatbot site web Guinée",
    ],
  },
  software: {
    title: `Création de logiciel sur mesure en Guinée — Dès 20 000 000 GNF`,
    description:
      "Création de logiciels en Guinée : logiciel interne dès 20 000 000 GNF, logiciel SaaS à commercialiser dès 50 000 000 GNF, application mobile dès 20 000 000 GNF. Étude personnalisée, développement itératif, formation des équipes et suivi.",
    keywords: [
      "création de logiciel en Guinée",
      "création de logiciels en Guinée",
      "développement logiciel sur mesure Guinée",
      "création application en Guinée",
      "création application mobile Guinée",
      "développeur logiciel Conakry",
      "logiciel SaaS Guinée",
      "entreprise développement informatique Guinée",
    ],
  },
  saas: {
    title: "Logiciels SaaS de gestion en Guinée — 7 outils, essai 7 jours",
    description:
      "Sept logiciels SaaS de gestion prêts à l'emploi pour les entreprises de Guinée : facturation (Factura Pro 100 000 GNF/mois), comptabilité, gestion hospitalière (1–5 M GNF/mois), école, immobilière, pharmacie, formation. Essai gratuit 7 jours + workflows sur mesure.",
    keywords: [
      "logiciel SaaS Guinée",
      "logiciel de gestion Guinée",
      "logiciel de facturation Guinée",
      "logiciel de gestion hospitalière Guinée",
      "logiciel de gestion d'école Guinée",
      "logiciel de gestion immobilière Guinée",
      "logiciel de gestion de pharmacie Guinée",
      "essai gratuit logiciel gestion",
      "Factura Pro",
    ],
  },
  community: {
    title: "Community management en Guinée — Gestion des réseaux sociaux",
    description:
      "Gestion professionnelle de vos réseaux sociaux en Guinée : Forfait Essentiel 1 500 000 GNF/mois, Professionnel 3 000 000 GNF/mois (publicité 50 $ incluse), Premium 5 000 000 GNF/mois avec équipe de terrain et 5 montages vidéo. Contenus, publicité et reporting.",
    keywords: [
      "community management Guinée",
      "gestion des réseaux sociaux Guinée",
      "community manager Conakry",
      "community manager Guinée tarif",
      "réseaux sociaux entreprise Guinée",
      "publicité Facebook Instagram Guinée",
      "création de contenu Guinée",
    ],
  },
  acquisition: {
    title: "Génération de leads et prospects B2B en Guinée",
    description:
      "Génération de leads et de prospects en Guinée : listes B2B qualifiées dès 2 000 000 GNF/mois, prospection téléphonique déléguée dès 4 500 000 GNF/mois, landing page de conversion dès 1 000 000 GNF, campagnes publicitaires sur mesure dès 1 000 000 GNF/mois.",
    keywords: [
      "génération de leads Guinée",
      "génération de prospects Guinée",
      "prospection B2B Guinée",
      "prospection téléphonique Guinée",
      "landing page conversion Guinée",
      "campagne publicitaire Guinée",
      "acquisition client Guinée",
      "trouver des clients Guinée",
    ],
  },
  training: {
    title: "Formation digitale et informatique en entreprise — Guinée",
    description:
      "Formations professionnelles en Guinée pour équipes en entreprise dès 20 000 000 GNF : outils numériques, logiciels de gestion, marketing digital, réseaux sociaux. Programme sur mesure après analyse de vos besoins.",
    keywords: [
      "formation informatique Guinée",
      "formation digitale Guinée",
      "formation entreprise Conakry",
      "formation marketing digital Guinée",
      "formation logiciels de gestion Guinée",
      "formation réseaux sociaux Guinée",
      "formation professionnelle Guinée",
    ],
  },
  strategy: {
    title: `Stratégie digitale et transformation numérique — Guinée`,
    description:
      "Conseil en stratégie digitale en Guinée : audit, feuille de route, choix des outils, transformation numérique des entreprises. Un plan d'action réaliste, adapté au terrain guinéen et à votre budget.",
    keywords: [
      "stratégie digitale Guinée",
      "transformation numérique Guinée",
      "conseil digital Conakry",
      "audit digital Guinée",
      "consultant informatique Guinée",
      "plan digital entreprise Guinée",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = SERVICE_DETAILS.fr[slug as ServiceSlug];
  if (!detail) return { title: `Service — ${BRAND}` };
  const seo = SEO_BY_SLUG[slug as ServiceSlug];
  return buildMetadata({
    path: `/services/${slug}`,
    title: seo.title,
    description: seo.description,
    keywords: [...seo.keywords, ...(detail.hero.chips ?? [])],
  });
}

export default async function ServiceDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SERVICE_SLUGS.includes(slug as ServiceSlug)) notFound();
  const detail = SERVICE_DETAILS.fr[slug as ServiceSlug];

  /* Offres officielles du pôle (montants GNF exacts) pour le JSON-LD. */
  const offersFor = (id: ServiceSlug) => {
    switch (id) {
      case "web":
        return [
          { name: "Site web vitrine", amount: 1_500_000, period: "one_time" },
          { name: "Site web avec tableau de bord", amount: 3_500_000, period: "one_time" },
          { name: "Site web customisé", amount: null, period: "one_time", isQuoteOnly: true },
        ];
      case "software":
        return [
          { name: "Logiciel sur mesure — usage interne", amount: 20_000_000, period: "one_time", isFrom: true },
          { name: "Logiciel SaaS à commercialiser", amount: 50_000_000, period: "one_time", isFrom: true },
          { name: "Application mobile", amount: 20_000_000, period: "one_time", isFrom: true },
        ];
      case "community":
        return [
          { name: "Forfait Essentiel", amount: 1_500_000, period: "month" },
          { name: "Forfait Professionnel", amount: 3_000_000, period: "month" },
          { name: "Forfait Premium", amount: 5_000_000, period: "month" },
        ];
      case "acquisition":
        return [
          { name: "Génération de leads B2B", amount: 2_000_000, period: "month", isFrom: true },
          { name: "Prospection téléphonique déléguée", amount: 4_500_000, period: "month", isFrom: true },
          { name: "Landing page de conversion", amount: 1_000_000, period: "one_time", isFrom: true },
          { name: "Campagne publicitaire sur mesure", amount: 1_000_000, period: "month", isFrom: true },
        ];
      case "training":
        return [
          { name: "Formation d'équipe en entreprise", amount: 20_000_000, period: "one_time", isFrom: true },
        ];
      default:
        return undefined;
    }
  };

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            path: `/services/${slug}`,
            name: detail.name,
            description: detail.hero.sub,
            offers: offersFor(slug as ServiceSlug),
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Services", path: "/services" },
            { name: detail.name, path: `/services/${slug}` },
          ]),
        ]}
      />
      <ServiceDetailPage slug={slug as ServiceSlug} />
    </>
  );
}
