import type { Metadata } from "next";
import { MethodPage } from "@/components/pages/MethodPage";
import { JsonLd } from "@/components/site/JsonLd";
import {
import { BRAND } from "@/lib/brand";
  GEO,
  PAGE_KEYWORDS,
  buildMetadata,
  howToJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/methode",
  title: `Notre méthode de création de sites web et logiciels en Guinée`,
  description:
    `Cinq étapes, zéro surprise : écoute, conception, développement, livraison et suivi. La méthode éprouvée de l'agence pour créer sites web, logiciels et applications en ${GEO.country} — du premier échange au suivi quotidien.`,
  keywords: PAGE_KEYWORDS.methode,
});

/* HowTo : la méthode en 5 étapes — éligible aux résultats enrichis
   « étapes » de Google (processus création site web / logiciel). */
const HOWTO_STEPS = [
  {
    name: "Écoute",
    text: "Entretien approfondi de votre activité, de vos contraintes et de vos objectifs, analyse de l'existant. Vous recevez un compte rendu de cadrage écrit, des premières recommandations et une estimation d'enveloppe budgétaire.",
  },
  {
    name: "Conception",
    text: "Maquettes, parcours utilisateurs et choix techniques validés point par point avec vous. Vous recevez les maquettes validées, un devis détaillé et figé, et le planning de réalisation.",
  },
  {
    name: "Développement",
    text: "Construction soignée de votre solution avec points d'avancement hebdomadaires et démonstrations à chaque étape clé. Vous consultez des versions de préproduction et recevez des comptes rendus écrits.",
  },
  {
    name: "Livraison",
    text: "Recette complète, formation de vos équipes et mise en ligne accompagnée. Vous recevez le site ou logiciel en production, la documentation complète, une session de formation et tous les accès.",
  },
  {
    name: "Suivi",
    text: "Correction gratuite des bugs, support réactif et propositions d'évolution régulières : l'outil grandit avec votre activité, après la mise en ligne.",
  },
];

export default function MethodeRoute() {
  return (
    <>
      <JsonLd
        data={[
          howToJsonLd({
            path: "/methode",
            name: `Comment ${BRAND} crée un site web ou un logiciel en Guinée — 5 étapes`,
            description:
              `La méthode ${BRAND} en cinq étapes pour créer un site web, un logiciel ou une application en Guinée : écoute, conception, développement, livraison et suivi.`,
            steps: HOWTO_STEPS,
          }),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Méthode", path: "/methode" },
          ]),
        ]}
      />
      <MethodPage />
    </>
  );
}
