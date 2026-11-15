import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie, getRequestHeader, getRequestUrl } from "@tanstack/react-start/server";
import {
  SITE_OVERRIDE_COOKIE,
  SITE_OVERRIDE_HEADER,
  isProductionHost,
  requestHost,
  resolveSiteKey,
} from "./site-resolver";
import type { SiteKey } from "./sites";

export type SiteContext = { siteKey: SiteKey; production: boolean };

function readBrowserCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * The current edition. On the server it reads Host, ?site=, x-site and the override
 * cookie. In the browser it reads the same inputs from location and document.cookie,
 * so SSR and hydration agree.
 */
export const getSiteContext = createIsomorphicFn()
  .server((): SiteContext => {
    const url = getRequestUrl();
    const host = requestHost(url, getRequestHeader("x-forwarded-host"));
    return {
      siteKey: resolveSiteKey({
        host,
        query: url.searchParams.get("site"),
        header: getRequestHeader(SITE_OVERRIDE_HEADER),
        cookie: getCookie(SITE_OVERRIDE_COOKIE),
      }),
      production: isProductionHost(host),
    };
  })
  .client((): SiteContext => {
    const url = new URL(window.location.href);
    return {
      siteKey: resolveSiteKey({
        host: url.host,
        query: url.searchParams.get("site"),
        cookie: readBrowserCookie(SITE_OVERRIDE_COOKIE),
      }),
      production: isProductionHost(url.host),
    };
  });

export function getCurrentSiteKey(): SiteKey {
  return getSiteContext().siteKey;
}
