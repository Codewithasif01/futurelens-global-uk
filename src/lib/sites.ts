/**
 * Central per-edition configuration. Every locale, currency, timezone, domain and
 * theme decision for an edition lives here. Nothing else may hard-code a locale.
 */
export const SITE_KEYS = ["com", "uk"] as const;
export type SiteKey = (typeof SITE_KEYS)[number];

export type HomepageLayout = {
  /** Region rail shown under the hero. */
  regionalRail: { title: string; regions: Array<"global" | "us" | "uk" | "europe"> };
  /** Which rail leads the page: the hero story or the regional rail. */
  heroEmphasis: "story" | "regional";
};

export type SiteConfig = {
  key: SiteKey;
  domain: string;
  url: string;
  name: string;
  editionLabel: string;
  shortEdition: string;
  /** Small tag next to the logo, null when the edition shows the bare logo. */
  logoTag: string | null;
  locale: "en-US" | "en-GB";
  ogLocale: "en_US" | "en_GB";
  hreflang: "en-US" | "en-GB";
  currency: "USD" | "GBP";
  timeZone: string;
  hour12: boolean;
  dateFormat: { short: string; long: string };
  tagline: string;
  description: string;
  defaultOgImage: string;
  social: { x: string; linkedin: string };
  analytics: { plausibleDomain: string | null; ga4Id: string | null };
  ads: { enabled: boolean; market: "US" | "UK"; networkLabel: string };
  /** Consent model used by the banner. */
  consent: { model: "uk-gdpr-pecr" | "gdpr-eu-plus-us-optout"; showDoNotSell: boolean };
  homepage: HomepageLayout;
};

const env = (typeof import.meta !== "undefined" ? import.meta.env : {}) as Record<
  string,
  string | undefined
>;

const COM_URL = (env.VITE_COM_URL || "https://futurelens.com").replace(/\/+$/, "");
const UK_URL = (env.VITE_UK_URL || "https://futurelens.co.uk").replace(/\/+$/, "");

export const SITES: Record<SiteKey, SiteConfig> = {
  com: {
    key: "com",
    domain: new URL(COM_URL).host,
    url: COM_URL,
    name: "FutureLens",
    editionLabel: "Global edition",
    shortEdition: "Global",
    logoTag: null,
    locale: "en-US",
    ogLocale: "en_US",
    hreflang: "en-US",
    currency: "USD",
    timeZone: "America/New_York",
    hour12: true,
    dateFormat: { short: "MM/DD/YYYY", long: "MMM D, YYYY" },
    tagline: "Technology and science, seen clearly.",
    description:
      "FutureLens covers the technology, science and policy shaping what comes next, from Silicon Valley to the rest of the world.",
    defaultOgImage: "/og/com.jpg",
    social: { x: "@futurelens", linkedin: "https://www.linkedin.com/company/futurelens" },
    analytics: {
      plausibleDomain: env.VITE_PLAUSIBLE_DOMAIN_COM || null,
      ga4Id: env.VITE_GA4_ID_COM || null,
    },
    ads: { enabled: true, market: "US", networkLabel: "US sponsor network" },
    consent: { model: "gdpr-eu-plus-us-optout", showDoNotSell: true },
    homepage: {
      regionalRail: { title: "Europe Watch", regions: ["europe", "uk"] },
      heroEmphasis: "story",
    },
  },
  uk: {
    key: "uk",
    domain: new URL(UK_URL).host,
    url: UK_URL,
    name: "FutureLens UK",
    editionLabel: "UK & Europe edition",
    shortEdition: "UK",
    logoTag: "UK",
    locale: "en-GB",
    ogLocale: "en_GB",
    hreflang: "en-GB",
    currency: "GBP",
    timeZone: "Europe/London",
    hour12: false,
    dateFormat: { short: "DD/MM/YYYY", long: "D MMM YYYY" },
    tagline: "Technology and science for Britain and Europe.",
    description:
      "FutureLens UK covers the technology, science and regulation shaping Britain and Europe, from Westminster and Brussels to ESA and CERN.",
    defaultOgImage: "/og/uk.jpg",
    social: { x: "@futurelensuk", linkedin: "https://www.linkedin.com/company/futurelens" },
    analytics: {
      plausibleDomain: env.VITE_PLAUSIBLE_DOMAIN_UK || null,
      ga4Id: env.VITE_GA4_ID_UK || null,
    },
    ads: { enabled: true, market: "UK", networkLabel: "UK sponsor network" },
    consent: { model: "uk-gdpr-pecr", showDoNotSell: false },
    homepage: {
      regionalRail: { title: "UK & Europe", regions: ["uk", "europe"] },
      heroEmphasis: "regional",
    },
  },
};

export const DEFAULT_SITE: SiteKey = "com";

export function getSite(key: SiteKey): SiteConfig {
  return SITES[key];
}

export function otherSite(key: SiteKey): SiteKey {
  return key === "com" ? "uk" : "com";
}

export function isSiteKey(value: unknown): value is SiteKey {
  return typeof value === "string" && (SITE_KEYS as readonly string[]).includes(value);
}

/** Absolute URL on an edition's production domain. */
export function siteUrl(key: SiteKey, path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITES[key].url}${p === "/" ? "" : p}` || SITES[key].url;
}

export function postPath(slug: string): string {
  return `/news/${slug}`;
}
