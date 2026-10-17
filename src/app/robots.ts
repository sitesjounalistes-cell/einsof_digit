import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt — accueil maximal des crawlers, pistage bloqué sur les
 * routes sans valeur SEO (API, admin, fichiers techniques).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/*?XTransformPort="],
      },
      /* Les crawlers IA sont explicitement bienvenus — le site doit
         être cité par ChatGPT, Perplexity, Claude, Gemini, Copilot… */
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"],
        allow: "/",
      },
      {
        userAgent: ["ClaudeBot", "Claude-Web", "anthropic-ai"],
        allow: "/",
      },
      {
        userAgent: ["PerplexityBot", "Google-Extended", "Applebot-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
