import { createFileRoute } from "@tanstack/react-router";
import { getCurrentSiteKey } from "@/lib/site-context";
import { listSitePosts, listSiteTaxonomy } from "@/lib/server/feeds";
import { postPath, siteUrl } from "@/lib/sites";
import { xmlEscape } from "@/lib/seo";

/**
 * This edition's sitemap, on its own domain. Shared stories are listed only on
 * their primary edition (the other edition canonicalises to it).
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const site = getCurrentSiteKey();
        try {
          const [posts, tax] = await Promise.all([
            listSitePosts(site, { primaryOnly: true }),
            listSiteTaxonomy(site),
          ]);
          const urls: Array<{ loc: string; lastmod?: string }> = [
            { loc: siteUrl(site, "/") },
            ...posts.map((p) => ({ loc: siteUrl(site, postPath(p.slug)), lastmod: p.updated_at })),
            ...tax.categories.map((c) => ({ loc: siteUrl(site, `/category/${c}`) })),
            ...tax.authors.map((a) => ({ loc: siteUrl(site, `/author/${a}`) })),
            ...tax.pages.map((p) => ({ loc: siteUrl(site, `/pages/${p.slug}`), lastmod: p.updated_at })),
          ];
          const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
            .map((u) => `  <url><loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ""}</url>`)
            .join("\n")}\n</urlset>\n`;
          return new Response(xml, {
            headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=900", Vary: "Host" },
          });
        } catch (e) {
          console.error(e);
          return new Response("Sitemap temporarily unavailable", { status: 503 });
        }
      },
    },
  },
});
