import { createFileRoute } from "@tanstack/react-router";
import { getCurrentSiteKey } from "@/lib/site-context";
import { siteUrl } from "@/lib/sites";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const site = getCurrentSiteKey();
        const body = [
          "User-agent: *",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /auth",
          "Disallow: /search",
          "",
          `Sitemap: ${siteUrl(site, "/sitemap.xml")}`,
          `Sitemap: ${siteUrl(site, "/news-sitemap.xml")}`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600", Vary: "Host" },
        });
      },
    },
  },
});
