import { createFileRoute } from "@tanstack/react-router";
import { getCurrentSiteKey } from "@/lib/site-context";
import { listSitePosts } from "@/lib/server/feeds";
import { getSite, postPath, siteUrl } from "@/lib/sites";
import { xmlEscape } from "@/lib/seo";

/** Google News sitemap: this edition's primary stories from the last 48 hours. */
export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const site = getCurrentSiteKey();
        const s = getSite(site);
        try {
          const posts = await listSitePosts(site, {
            primaryOnly: true,
            since: new Date(Date.now() - 48 * 3600 * 1000),
            limit: 1000,
          });
          const items = posts
            .map(
              (p) => `  <url>
    <loc>${xmlEscape(siteUrl(site, postPath(p.slug)))}</loc>
    <news:news>
      <news:publication><news:name>${xmlEscape(s.name)}</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${new Date(p.published_at).toISOString()}</news:publication_date>
      <news:title>${xmlEscape(p.title)}</news:title>
    </news:news>
  </url>`,
            )
            .join("\n");
          const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${items}\n</urlset>\n`;
          return new Response(xml, {
            headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300", Vary: "Host" },
          });
        } catch (e) {
          console.error(e);
          return new Response("News sitemap temporarily unavailable", { status: 503 });
        }
      },
    },
  },
});
