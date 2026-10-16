import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* Aperçu : la prévisualisation charge le site depuis la passerelle
     (sous-domaine space-z.ai) — autorise ses requêtes croisées vers les
     assets de dev /_next/* (sinon bloquées/warn en Next 16). */
  allowedDevOrigins: ["*.space-z.ai", "preview-chat-*.space-z.ai"],
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
