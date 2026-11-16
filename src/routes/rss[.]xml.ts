import { createFileRoute } from "@tanstack/react-router";
import { getCurrentSiteKey } from "@/lib/site-context";
import { listSitePosts } from "@/lib/server/feeds";
import { getSite, postPath, siteUrl } from "@/lib/sites";
import { absoluteImage, xmlEscape } from "@/lib/seo";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const site = getCurrentSiteKey();
        const s = getSite(site);
        try {
          const posts = await listSitePosts(site, { limit: 30 });
          const items = posts
            .map((p) => {
              const link = siteUrl(site, postPath(p.slug));
              return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid isPermaLink="true">${xmlEscape(link)}</guid>
      <description>${xmlEscape(p.excerpt)}</description>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>${p.author_name ? `\n      <dc:creator>${xmlEscape(p.author_name)}</dc:creator>` : ""}${p.category_name ? `\n      <category>${xmlEscape(p.category_name)}</category>` : ""}
      <enclosure url="${xmlEscape(absoluteImage(site, p.featured_image))}" type="image/jpeg" length="0"/>
    </item>`;
            })
            .join("\n");
          const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlEscape(s.name)}</title>
    <link>${xmlEscape(s.url)}/</link>
    <description>${xmlEscape(s.description)}</description>
    <language>${s.locale.toLowerCase()}</language>
    <atom:link href="${xmlEscape(siteUrl(site, "/rss.xml"))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
          return new Response(xml, {
            headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=600", Vary: "Host" },
          });
        } catch (e) {
          console.error(e);
          return new Response("Feed temporarily unavailable", { status: 503 });
        }
      },
    },
  },
});
