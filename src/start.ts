import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { setCookie, setResponseHeader } from "@tanstack/react-start/server";
import {
  SITE_OVERRIDE_COOKIE,
  isProductionHost,
  requestHost,
  resolveSiteKey,
  wwwRedirectHost,
} from "./lib/site-resolver";
import { SITES, isSiteKey } from "./lib/sites";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

/**
 * Edition routing. Runs on every request:
 * - www.<domain> -> <domain> (301), the only cross-host redirect besides /admin below.
 * - /admin on the UK production domain -> the .com admin (the CMS lives on one host).
 * - ?site=com|uk on non-production hosts stores an override cookie for local testing.
 * Pages are never redirected between editions.
 */
const siteMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  const host = requestHost(url, request.headers.get("x-forwarded-host"));

  const bare = wwwRedirectHost(host);
  if (bare) {
    const proto = url.hostname === "localhost" ? "https:" : url.protocol;
    return new Response(null, {
      status: 301,
      headers: { Location: `${proto}//${bare}${url.pathname}${url.search}` },
    });
  }

  const production = isProductionHost(host);
  if (production && url.pathname.startsWith("/admin") && resolveSiteKey({ host }) === "uk") {
    return new Response(null, {
      status: 302,
      headers: { Location: `${SITES.com.url}${url.pathname}${url.search}` },
    });
  }

  if (!production) {
    const override = url.searchParams.get("site");
    if (isSiteKey(override)) {
      const secure = url.protocol === "https:" || url.hostname === "localhost";
      setCookie(SITE_OVERRIDE_COOKIE, override, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: secure ? "none" : "lax",
        secure,
      });
    }
  }
  // Responses differ per edition: never let a shared cache mix them.
  setResponseHeader("Vary", production ? "Host" : "Host, Cookie, X-Site");
  return next();
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// requestMiddleware runs on every request; functionMiddleware only on server functions, where
// client sendContext is unvalidated input. Append to these arrays, never replace them.
// Enabling Lovable Cloud adds functionMiddleware: [attachSupabaseAuth], the bearer token that
// requireSupabaseAuth server functions need. Add it by hand only if Lovable Cloud or a
// user-managed Supabase project is connected, no middleware here sets Authorization, and the
// project did not intentionally replace it.
export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, siteMiddleware, csrfMiddleware],
}));
