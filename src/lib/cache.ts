import type { QueryClient } from "@tanstack/react-query";
import { SITE_KEYS, isSiteKey, type SiteKey } from "./sites";

/**
 * Every public query key starts with ["site", <siteKey>]. Invalidating one edition's
 * prefix can never touch the other edition's cache entries.
 */
export function siteKeyPrefix(site: SiteKey) {
  return ["site", site] as const;
}

/** Cache tags for a post on each of its editions, e.g. "site:uk:post:<id>". */
export function postCacheTags(postId: string, sites: readonly SiteKey[]): string[] {
  return sites.flatMap((s) => [`site:${s}`, `site:${s}:post:${postId}`]);
}

/**
 * Editions to refresh after a save: the post's editions before and after the edit
 * (so removing a post from an edition also refreshes that edition), nothing else.
 */
export function sitesToRevalidate(
  before: readonly string[] | null | undefined,
  after: readonly string[] | null | undefined,
): SiteKey[] {
  const set = new Set<SiteKey>();
  for (const s of [...(before ?? []), ...(after ?? [])]) if (isSiteKey(s)) set.add(s);
  return SITE_KEYS.filter((s) => set.has(s));
}

export async function revalidateSites(queryClient: QueryClient, sites: readonly SiteKey[]) {
  await Promise.all(
    sites.map((s) => queryClient.invalidateQueries({ queryKey: siteKeyPrefix(s) })),
  );
}
