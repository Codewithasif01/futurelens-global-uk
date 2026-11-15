import { SITES, getSite, otherSite, postPath, siteUrl, type SiteKey } from "./sites";

export type Alternate = { hreflang: string; href: string };

/** Absolute URL for an image path, on the edition's own domain. */
export function absoluteImage(site: SiteKey, src: string | null | undefined): string {
  if (!src) return siteUrl(site, getSite(site).defaultOgImage);
  if (/^https?:\/\//.test(src)) return src;
  return siteUrl(site, src);
}

type PostLinkInput = {
  slug: string;
  primary_site: SiteKey;
  primary_slug: string;
  counterpart_site: SiteKey | null;
  counterpart_slug: string | null;
};

/**
 * Canonical and hreflang for a story on `site`.
 * - Canonical always points at the story's primary edition.
 * - hreflang is emitted only when the story really exists on the other edition.
 */
export function postLinks(post: PostLinkInput, site: SiteKey) {
  const selfUrl = siteUrl(site, postPath(post.slug));
  const canonical = siteUrl(post.primary_site, postPath(post.primary_slug));
  const alternates: Alternate[] = [];
  if (post.counterpart_site && post.counterpart_slug) {
    const urls: Record<SiteKey, string> = {
      [site]: selfUrl,
      [post.counterpart_site]: siteUrl(post.counterpart_site, postPath(post.counterpart_slug)),
    } as Record<SiteKey, string>;
    alternates.push(
      { hreflang: SITES.com.hreflang, href: urls.com },
      { hreflang: SITES.uk.hreflang, href: urls.uk },
      { hreflang: "x-default", href: urls.com },
    );
  }
  return { selfUrl, canonical, alternates };
}

/** Both homepages always exist, so they are real counterparts. */
export function homeAlternates(): Alternate[] {
  return [
    { hreflang: SITES.com.hreflang, href: SITES.com.url + "/" },
    { hreflang: SITES.uk.hreflang, href: SITES.uk.url + "/" },
    { hreflang: "x-default", href: SITES.com.url + "/" },
  ];
}

export type HeadInput = {
  site: SiteKey;
  title: string;
  description: string;
  path: string;
  canonical?: string;
  image?: string | null;
  imageAlt?: string | null;
  type?: "website" | "article";
  alternates?: Alternate[];
  jsonLd?: object[];
  noindex?: boolean;
  publishedTime?: string | null;
  modifiedTime?: string | null;
};

/** Per-route head tags: title, description, canonical, OG, Twitter, hreflang, JSON-LD. */
export function buildHead(input: HeadInput) {
  const s = getSite(input.site);
  const url = siteUrl(input.site, input.path);
  const canonical = input.canonical ?? url;
  const image = absoluteImage(input.site, input.image);
  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: s.name },
    { property: "og:locale", content: s.ogLocale },
    { property: "og:locale:alternate", content: SITES[otherSite(input.site)].ogLocale },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: input.imageAlt ?? s.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: s.social.x },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
  ];
  if (input.publishedTime) meta.push({ property: "article:published_time", content: input.publishedTime });
  if (input.modifiedTime) meta.push({ property: "article:modified_time", content: input.modifiedTime });
  if (input.noindex) meta.push({ name: "robots", content: "noindex, follow" });
  const links: Array<Record<string, string>> = input.noindex ? [] : [{ rel: "canonical", href: canonical }];
  for (const a of input.alternates ?? []) links.push({ rel: "alternate", hrefLang: a.hreflang, href: a.href });
  const scripts = (input.jsonLd ?? []).map((ld) => ({
    type: "application/ld+json",
    children: JSON.stringify(ld),
  }));
  return { meta, links, scripts };
}

export function organizationLd(site: SiteKey, legalName?: string | null) {
  const s = getSite(site);
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${s.url}/#organization`,
    name: s.name,
    ...(legalName && !legalName.startsWith("[") ? { legalName } : {}),
    url: s.url + "/",
    logo: { "@type": "ImageObject", url: `${s.url}/icons/logo-${site}.png`, width: 512, height: 512 },
    sameAs: [s.social.linkedin, `https://x.com/${s.social.x.replace("@", "")}`],
    areaServed: site === "uk" ? ["GB", "EU"] : ["US", "Worldwide"],
  };
}

export function websiteLd(site: SiteKey) {
  const s = getSite(site);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${s.url}/#website`,
    name: s.name,
    url: s.url + "/",
    inLanguage: s.locale,
    publisher: { "@id": `${s.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${s.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function newsArticleLd(
  site: SiteKey,
  post: {
    title: string;
    excerpt: string;
    image: string | null;
    published_at: string | null;
    updated_at: string | null;
    author_name: string | null;
    author_slug: string | null;
    category_name: string | null;
  },
  canonical: string,
  selfUrl: string,
) {
  const s = getSite(site);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title.slice(0, 110),
    description: post.excerpt,
    image: [absoluteImage(site, post.image)],
    datePublished: post.published_at,
    dateModified: post.updated_at ?? post.published_at,
    inLanguage: s.locale,
    url: selfUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    articleSection: post.category_name ?? undefined,
    author: post.author_name
      ? [{ "@type": "Person", name: post.author_name, url: siteUrl(site, `/author/${post.author_slug}`) }]
      : undefined,
    publisher: {
      "@type": "NewsMediaOrganization",
      "@id": `${s.url}/#organization`,
      name: s.name,
      logo: { "@type": "ImageObject", url: `${s.url}/icons/logo-${site}.png` },
    },
  };
}

export function breadcrumbLd(site: SiteKey, items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: siteUrl(site, it.path),
    })),
  };
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
