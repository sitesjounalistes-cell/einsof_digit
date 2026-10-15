import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

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

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "EINSOF";

export const metadata: Metadata = {
  title: `${BRAND} — Agence digitale premium en Guinée`,
  description:
    "Sites web, logiciels sur mesure, SaaS de gestion, community management et acquisition client. Sept ans d'expérience au service des entreprises de Guinée et d'Afrique francophone.",
  keywords: [
    "agence digitale Guinée",
    "création site web Conakry",
    "logiciel sur mesure",
    "SaaS gestion",
    "Factura Pro",
    "community management",
  ],
  applicationName: BRAND,
  authors: [{ name: BRAND }],
  openGraph: {
    title: `${BRAND} — Votre présence digitale, notre métier`,
    description:
      "Agence digitale guinéenne : sites web, logiciels, SaaS de gestion, réseaux sociaux et acquisition client.",
    siteName: BRAND,
    type: "website",
    locale: "fr_GN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} — Agence digitale premium`,
    description: "Sites web, logiciels sur mesure et SaaS de gestion pour l'Afrique francophone.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
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
        <Providers>{children}</Providers>
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
