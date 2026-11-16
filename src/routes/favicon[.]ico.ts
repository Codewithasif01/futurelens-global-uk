import { createFileRoute } from "@tanstack/react-router";
import { getCurrentSiteKey } from "@/lib/site-context";

/** Browsers that ignore <link rel="icon"> still get this edition's icon. */
export const Route = createFileRoute("/favicon.ico")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 302,
          headers: { Location: `/icons/favicon-${getCurrentSiteKey()}.png`, Vary: "Host" },
        }),
    },
  },
});
