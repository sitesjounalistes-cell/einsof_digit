import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Déploiement standard (Vercel ou `next start`) — plus de sortie
     standalone bash-only : les scripts npm sont portables (audit F-14). */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
