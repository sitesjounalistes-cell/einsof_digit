import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/site/JsonLd";
import { BRAND } from "@/lib/brand";
import {
  BASE_KEYWORDS,
  GEO,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* Mots-clés globaux : toute requête liée à la thématique doit mener
   au site — sites web, logiciels, applications, SaaS, formations,
   génération de leads (SEO profond demandé par le client). */
const GLOBAL_KEYWORDS = [...BASE_KEYWORDS];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} — Création de sites web, logiciels & applications en ${GEO.country}`,
    template: `%s — ${BRAND}`,
  },
  description:
    `Agence de création de sites web professionnels en ${GEO.country} : site vitrine dès 1 500 000 GNF, logiciels sur mesure et applications mobiles dès 20 000 000 GNF, SaaS de gestion avec essai gratuit, community management, génération de leads et formations digitales. ${GEO.city} et toute l'Afrique francophone.`,
  keywords: GLOBAL_KEYWORDS,
  applicationName: BRAND,
  authors: [{ name: BRAND }],
  creator: BRAND,
  publisher: BRAND,
  category: "technology",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${BRAND} — Création de sites web & logiciels en ${GEO.country}`,
    description:
      `Sites web dès 1 500 000 GNF, logiciels sur mesure dès 20 000 000 GNF, 7 SaaS de gestion, community management et acquisition client. Agence digitale à ${GEO.city}, ${GEO.country}.`,
    siteName: BRAND,
    type: "website",
    locale: "fr_GN",
    url: SITE_URL,
    images: [
      {
        url: "/images/hero-obsidienne.png",
        width: 1200,
        height: 630,
        alt: `${BRAND} — agence digitale en ${GEO.country}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} — Création de sites web & logiciels en ${GEO.country}`,
    description:
      "Sites web, logiciels sur mesure, applications mobiles, SaaS de gestion et marketing digital pour les entreprises de Guinée et d'Afrique francophone.",
    images: ["/images/hero-obsidienne.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: { index: true, follow: true },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1ebdd" },
    { media: "(prefers-color-scheme: dark)", color: "#151517" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`dark ${cormorant.variable} ${inter.variable}`}
    >
      <body className="antialiased">
        {/* Données structurées globales : Organization + LocalBusiness
            (avec catalogue de prix officiels GNF) et WebSite. */}
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>{children}</Providers>
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
