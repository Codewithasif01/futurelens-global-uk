import { queryOptions } from "@tanstack/react-query";
import {
  getAuthor,
  getCategory,
  getHomepage,
  getPage,
  getPost,
  getRegion,
  getSiteChrome,
  getTag,
  searchPosts,
} from "./content.functions";
import { siteKeyPrefix } from "./cache";
import type { SiteKey } from "./sites";

const key = (site: SiteKey, ...rest: unknown[]) => [...siteKeyPrefix(site), ...rest] as const;
const STALE = 60_000;

export const chromeQuery = (site: SiteKey) =>
  queryOptions({ queryKey: key(site, "chrome"), queryFn: () => getSiteChrome(), staleTime: STALE });
export const homeQuery = (site: SiteKey) =>
  queryOptions({ queryKey: key(site, "home"), queryFn: () => getHomepage(), staleTime: STALE });
export const postQuery = (site: SiteKey, slug: string) =>
  queryOptions({ queryKey: key(site, "post", slug), queryFn: () => getPost({ data: { slug } }), staleTime: STALE });
export const categoryQuery = (site: SiteKey, slug: string) =>
  queryOptions({ queryKey: key(site, "category", slug), queryFn: () => getCategory({ data: { slug } }), staleTime: STALE });
export const tagQuery = (site: SiteKey, slug: string) =>
  queryOptions({ queryKey: key(site, "tag", slug), queryFn: () => getTag({ data: { slug } }), staleTime: STALE });
export const authorQuery = (site: SiteKey, slug: string) =>
  queryOptions({ queryKey: key(site, "author", slug), queryFn: () => getAuthor({ data: { slug } }), staleTime: STALE });
export const regionQuery = (site: SiteKey, region: "global" | "us" | "uk" | "europe") =>
  queryOptions({ queryKey: key(site, "region", region), queryFn: () => getRegion({ data: { region } }), staleTime: STALE });
export const searchQuery = (site: SiteKey, q: string) =>
  queryOptions({ queryKey: key(site, "search", q), queryFn: () => searchPosts({ data: { q } }), staleTime: STALE });
export const pageQuery = (site: SiteKey, slug: string) =>
  queryOptions({ queryKey: key(site, "page", slug), queryFn: () => getPage({ data: { slug } }), staleTime: STALE });
