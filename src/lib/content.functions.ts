import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { getCurrentSiteKey } from "./site-context";
import { siteDb } from "./server/site-db";
import { otherSite, postPath, type SiteKey } from "./sites";
import type { NavItem, OtherEdition, PostCard, SitePost } from "./content-types";

const CARD_FIELDS =
  "id,slug,title,excerpt,featured_image,image_alt,published_at,region,category_slug,category_name,author_name,author_slug,is_shared";

const slugSchema = z.object({ slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/) });

function site(): SiteKey {
  return getCurrentSiteKey();
}

function cards(rows: unknown): PostCard[] {
  return (rows as PostCard[] | null) ?? [];
}

/** Header, footer, legal menus and settings for the current edition. */
export const getSiteChrome = createServerFn({ method: "GET" }).handler(async () => {
  const s = site();
  const db = siteDb(s);
  const [nav, settings] = await Promise.all([
    db.from("navigation").select("menu,label,href,position").eq("site", s).order("position"),
    db.from("site_settings").select("*").eq("site", s).maybeSingle(),
  ]);
  if (nav.error) throw new Error(nav.error.message);
  if (settings.error) throw new Error(settings.error.message);
  const pick = (menu: string): NavItem[] =>
    (nav.data ?? []).filter((n) => n.menu === menu).map((n) => ({ label: n.label, href: n.href }));
  return {
    site: s,
    header: pick("header"),
    footer: pick("footer"),
    legal: pick("legal"),
    settings: settings.data,
  };
});

export const getHomepage = createServerFn({ method: "GET" }).handler(async () => {
  const s = site();
  const db = siteDb(s);
  const { getSite } = await import("./sites");
  const regions = getSite(s).homepage.regionalRail.regions;
  const [picks, latest, rail] = await Promise.all([
    db.from("homepage_picks").select("slot,post_id,position").eq("site", s).order("position"),
    db.from("site_posts").select(CARD_FIELDS).eq("site", s).order("published_at", { ascending: false }).limit(24),
    db.from("site_posts").select(CARD_FIELDS).eq("site", s).in("region", regions).order("published_at", { ascending: false }).limit(4),
  ]);
  for (const r of [picks, latest, rail]) if (r.error) throw new Error(r.error.message);
  const all = cards(latest.data);
  const byId = new Map(all.map((p) => [p.id, p]));
  const slot = (name: string) =>
    (picks.data ?? []).filter((p) => p.slot === name).map((p) => byId.get(p.post_id)).filter(Boolean) as PostCard[];
  const hero = slot("hero")[0] ?? all[0] ?? null;
  const featured = slot("featured");
  const used = new Set([hero?.id, ...featured.map((f) => f.id)]);
  return {
    site: s,
    hero,
    featured: featured.length ? featured : all.filter((p) => p.id !== hero?.id).slice(0, 3),
    latest: all.filter((p) => !used.has(p.id)).slice(0, 9),
    rail: cards(rail.data),
  };
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }) => {
    const s = site();
    const db = siteDb(s);
    const { data: post, error } = await db
      .from("site_posts")
      .select("*")
      .eq("site", s)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) {
      // Only reveals that the other edition has a story at this address; never redirects.
      const other = otherSite(s);
      const { data: elsewhere } = await siteDb(other)
        .from("site_posts")
        .select("slug")
        .eq("site", other)
        .eq("slug", data.slug)
        .maybeSingle();
      const otherEdition: OtherEdition = elsewhere ? { site: other, path: postPath(elsewhere.slug!) } : null;
      return { site: s, post: null, tags: [], related: [], otherEdition };
    }
    const p = post as SitePost;
    const [tags, related] = await Promise.all([
      db.from("post_tags").select("tags!inner(slug,name,site)").eq("post_id", p.id!).eq("tags.site", s),
      db.from("site_posts").select(CARD_FIELDS).eq("site", s).neq("id", p.id!)
        .eq("category_slug", p.category_slug ?? "").order("published_at", { ascending: false }).limit(3),
    ]);
    return {
      site: s,
      post: p,
      tags: ((tags.data ?? []) as unknown as Array<{ tags: { slug: string; name: string } }>).map((t) => t.tags),
      related: cards(related.data),
      otherEdition: null as OtherEdition,
    };
  });

export const getCategory = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }) => {
    const s = site();
    const db = siteDb(s);
    const { data: category } = await db.from("categories").select("slug,name,description").eq("site", s).eq("slug", data.slug).maybeSingle();
    if (!category) return { site: s, category: null, posts: [] as PostCard[] };
    const { data: posts } = await db.from("site_posts").select(CARD_FIELDS).eq("site", s).eq("category_slug", data.slug).order("published_at", { ascending: false }).limit(30);
    return { site: s, category, posts: cards(posts) };
  });

export const getTag = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }) => {
    const s = site();
    const db = siteDb(s);
    const { data: tag } = await db.from("tags").select("id,slug,name").eq("site", s).eq("slug", data.slug).maybeSingle();
    if (!tag) return { site: s, tag: null, posts: [] as PostCard[] };
    const { data: links } = await db.from("post_tags").select("post_id").eq("tag_id", tag.id);
    const ids = (links ?? []).map((l) => l.post_id);
    const { data: posts } = ids.length
      ? await db.from("site_posts").select(CARD_FIELDS).eq("site", s).in("id", ids).order("published_at", { ascending: false })
      : { data: [] };
    return { site: s, tag: { slug: tag.slug, name: tag.name }, posts: cards(posts) };
  });

export const getAuthor = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }) => {
    const s = site();
    const db = siteDb(s);
    const { data: author } = await db.from("authors").select("slug,name,role_title,bio,x_handle").eq("slug", data.slug).maybeSingle();
    if (!author) return { site: s, author: null, posts: [] as PostCard[] };
    // Authors are shared; their stories are still only this edition's.
    const { data: posts } = await db.from("site_posts").select(CARD_FIELDS).eq("site", s).eq("author_slug", data.slug).order("published_at", { ascending: false }).limit(30);
    return { site: s, author, posts: cards(posts) };
  });

const regionSchema = z.object({ region: z.enum(["global", "us", "uk", "europe"]) });
export const getRegion = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => regionSchema.parse(input))
  .handler(async ({ data }) => {
    const s = site();
    const regions = data.region === "uk" || data.region === "europe" ? ["uk", "europe"] : [data.region];
    const { data: posts } = await siteDb(s).from("site_posts").select(CARD_FIELDS).eq("site", s)
      .in("region", regions as Array<"uk" | "europe" | "us" | "global">).order("published_at", { ascending: false }).limit(30);
    return { site: s, region: data.region, posts: cards(posts) };
  });

const searchSchema = z.object({ q: z.string().max(100) });
export const searchPosts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => searchSchema.parse(input))
  .handler(async ({ data }) => {
    const s = site();
    const q = data.q.replace(/[^\p{L}\p{N}\s-]/gu, " ").trim().replace(/\s+/g, " ");
    if (q.length < 2) return { site: s, q, posts: [] as PostCard[] };
    const { data: posts } = await siteDb(s).from("site_posts").select(CARD_FIELDS).eq("site", s)
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`).order("published_at", { ascending: false }).limit(30);
    return { site: s, q, posts: cards(posts) };
  });

export const getPage = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => slugSchema.parse(input))
  .handler(async ({ data }) => {
    const s = site();
    const { data: page } = await siteDb(s).from("pages").select("slug,title,kind,body,seo_title,seo_description,updated_at")
      .eq("site", s).eq("slug", data.slug).eq("status", "published").maybeSingle();
    return { site: s, page };
  });

const subscribeSchema = z.object({ email: z.string().trim().email().max(320) });
export const subscribe = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => subscribeSchema.parse(input))
  .handler(async ({ data }) => {
    const s = site();
    const { error } = await siteDb(s).from("subscribers").insert({
      site: s,
      email: data.email.toLowerCase(),
      consent_text: "Newsletter sign-up form",
    });
    if (error && error.code !== "23505") throw new Error("Could not subscribe right now.");
    return { ok: true, site: s };
  });

/** Visitor country from the edge, used only to decide whether the .com banner is needed. */
export const getVisitorCountry = createServerFn({ method: "GET" }).handler(async () => {
  const c = getRequestHeader("cf-ipcountry") ?? getRequestHeader("x-vercel-ip-country") ?? null;
  return { country: c && /^[A-Z]{2}$/.test(c) && c !== "XX" ? c : null };
});
