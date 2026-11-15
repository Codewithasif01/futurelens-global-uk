import { DEFAULT_SITE, SITES, isSiteKey, type SiteKey } from "./sites";

export const SITE_OVERRIDE_COOKIE = "fl_site";
export const SITE_OVERRIDE_HEADER = "x-site";

/** Hosts that always map to one edition. Overrides are ignored on these. */
const PRODUCTION_HOSTS: Record<string, SiteKey> = {
  "futurelens.com": "com",
  "www.futurelens.com": "com",
  "futurelens.co.uk": "uk",
  "www.futurelens.co.uk": "uk",
};

/** Local development hosts (add them to /etc/hosts, see README). */
const LOCAL_HOSTS: Record<string, SiteKey> = {
  "futurelens.local": "com",
  "www.futurelens.local": "com",
  "uk.futurelens.local": "uk",
};

export function normaliseHost(host: string | null | undefined): string {
  return (host ?? "").trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

function productionHostMap(): Record<string, SiteKey> {
  const map: Record<string, SiteKey> = { ...PRODUCTION_HOSTS };
  for (const site of Object.values(SITES)) {
    const h = normaliseHost(site.domain);
    map[h] = site.key;
    map[`www.${h}`] = site.key;
  }
  return map;
}

export function isProductionHost(host: string | null | undefined): boolean {
  return normaliseHost(host) in productionHostMap();
}

export type ResolveInput = {
  host: string | null | undefined;
  /** `?site=` query value. */
  query?: string | null;
  /** `x-site` request header. */
  header?: string | null;
  /** Override cookie set by a previous `?site=` visit. */
  cookie?: string | null;
};

/**
 * Host -> edition. Production domains are fixed. Everything else (localhost,
 * previews) defaults to com and accepts ?site=, x-site, or the override cookie.
 */
export function resolveSiteKey({ host, query, header, cookie }: ResolveInput): SiteKey {
  const h = normaliseHost(host);
  const prod = productionHostMap()[h];
  if (prod) return prod;
  for (const candidate of [query, header, cookie]) {
    if (isSiteKey(candidate)) return candidate;
  }
  const local = LOCAL_HOSTS[h];
  if (local) return local;
  return DEFAULT_SITE;
}

/** `www.` host -> bare host, or null when no redirect is needed. */
export function wwwRedirectHost(host: string | null | undefined): string | null {
  const h = normaliseHost(host);
  if (!h.startsWith("www.")) return null;
  return h.slice(4);
}

/**
 * The host the visitor typed. x-forwarded-host is only trusted behind the local
 * dev proxy (request URL on localhost); elsewhere it is client-controlled.
 */
export function requestHost(requestUrl: URL, forwardedHost: string | null | undefined): string {
  if (requestUrl.hostname === "localhost" && forwardedHost) return forwardedHost;
  return requestUrl.host;
}
