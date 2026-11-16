import { createServerOnlyFn } from "@tanstack/react-start";
import { siteDb } from "./site-db";
import type { SiteKey } from "@/lib/sites";

export type FeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  updated_at: string;
  primary_site: SiteKey;
  author_name: string | null;
  category_name: string | null;
};

const FIELDS = "slug,title,excerpt,featured_image,published_at,updated_at,primary_site,author_name,category_name";

/** All published stories on one edition, paginated past the 1000-row API limit. */
export const listSitePosts = createServerOnlyFn(
  async (site: SiteKey, opts: { since?: Date; limit?: number; primaryOnly?: boolean } = {}) => {
    const db = siteDb(site);
    const out: FeedPost[] = [];
    const page = 1000;
    for (let from = 0; ; from += page) {
      let q = db.from("site_posts").select(FIELDS).eq("site", site);
      if (opts.primaryOnly) q = q.eq("primary_site", site);
      if (opts.since) q = q.gte("published_at", opts.since.toISOString());
      const { data, error } = await q.order("published_at", { ascending: false }).range(from, from + page - 1);
      if (error) throw new Error(error.message);
      out.push(...((data ?? []) as FeedPost[]));
      if (!data || data.length < page || (opts.limit && out.length >= opts.limit)) break;
    }
    return opts.limit ? out.slice(0, opts.limit) : out;
  },
);

export const listSiteTaxonomy = createServerOnlyFn(async (site: SiteKey) => {
  const db = siteDb(site);
  const [cats, pages, authors] = await Promise.all([
    db.from("categories").select("slug").eq("site", site),
    db.from("pages").select("slug,updated_at").eq("site", site).eq("status", "published"),
    db.from("site_posts").select("author_slug").eq("site", site),
  ]);
  for (const r of [cats, pages, authors]) if (r.error) throw new Error(r.error.message);
  return {
    categories: (cats.data ?? []).map((c) => c.slug),
    pages: pages.data ?? [],
    authors: [...new Set((authors.data ?? []).map((a) => a.author_slug).filter(Boolean))] as string[],
  };
});
