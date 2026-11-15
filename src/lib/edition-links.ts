import { siteUrl, type SiteKey } from "./sites";

/**
 * Link to `path` on another edition. On the real domains this is the other domain;
 * on localhost and previews it stays on the same host with ?site= so both editions
 * can be tested from one URL.
 */
export function editionHref(target: SiteKey, path: string, production: boolean): string {
  if (production) return siteUrl(target, path);
  return `${path}${path.includes("?") ? "&" : "?"}site=${target}`;
}
