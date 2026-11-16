import { createFileRoute } from "@tanstack/react-router";
import { getCurrentSiteKey } from "@/lib/site-context";
import { getSite } from "@/lib/sites";

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: async () => {
        const key = getCurrentSiteKey();
        const s = getSite(key);
        const body = {
          name: s.name,
          short_name: s.name,
          description: s.description,
          lang: s.locale,
          start_url: "/",
          display: "standalone",
          background_color: "#faf6ee",
          theme_color: "#141a33",
          icons: [
            { src: `/icons/icon-192-${key}.png`, sizes: "192x192", type: "image/png" },
            { src: `/icons/logo-${key}.png`, sizes: "512x512", type: "image/png" },
            { src: `/icons/icon-${key}.svg`, sizes: "any", type: "image/svg+xml" },
          ],
        };
        return new Response(JSON.stringify(body), {
          headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=3600", Vary: "Host" },
        });
      },
    },
  },
});
