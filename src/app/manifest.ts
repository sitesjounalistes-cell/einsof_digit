import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND} — Agence digitale premium`,
    short_name: BRAND,
    description:
      "Sites web, logiciels sur mesure, SaaS de gestion, community management et acquisition client en Guinée.",
    start_url: "/",
    display: "standalone",
    background_color: "#151517",
    theme_color: "#151517",
    lang: "fr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
