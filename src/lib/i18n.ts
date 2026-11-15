import { getSite, type SiteKey } from "./sites";

/**
 * Locale helpers. These are the only functions that read an edition's locale,
 * currency or timezone. Components call these instead of Intl directly.
 */
export function formatDate(
  value: string | Date,
  site: SiteKey,
  style: "long" | "short" = "long",
): string {
  const s = getSite(site);
  const d = typeof value === "string" ? new Date(value) : value;
  if (style === "short") {
    return new Intl.DateTimeFormat(s.locale, {
      timeZone: s.timeZone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  }
  return new Intl.DateTimeFormat(s.locale, {
    timeZone: s.timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatTime(value: string | Date, site: SiteKey): string {
  const s = getSite(site);
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(s.locale, {
    timeZone: s.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: s.hour12,
    timeZoneName: "short",
  }).format(d);
}

export function formatCurrency(amount: number, site: SiteKey): string {
  const s = getSite(site);
  return new Intl.NumberFormat(s.locale, {
    style: "currency",
    currency: s.currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** UI strings that differ in spelling or wording between editions. */
const STRINGS = {
  color: { com: "color", uk: "colour" },
  center: { com: "center", uk: "centre" },
  program: { com: "program", uk: "programme" },
  favorite: { com: "favorite", uk: "favourite" },
  organization: { com: "organization", uk: "organisation" },
  analyze: { com: "analyze", uk: "analyse" },
  latest: { com: "Latest stories", uk: "Latest stories" },
  privacyCenter: { com: "Privacy center", uk: "Privacy centre" },
  newsletterTitle: { com: "The FutureLens Brief", uk: "The FutureLens UK Brief" },
  newsletterBody: {
    com: "One email each weekday with the stories that matter, analyzed by our editors.",
    uk: "One email each weekday with the stories that matter, analysed by our editors.",
  },
  subscribe: { com: "Subscribe", uk: "Subscribe" },
  membership: {
    com: "Support independent journalism",
    uk: "Support independent journalism",
  },
  readMore: { com: "Read the story", uk: "Read the story" },
  switchEdition: { com: "Switch edition", uk: "Switch edition" },
  searchPlaceholder: { com: "Search stories", uk: "Search stories" },
  noResults: {
    com: "No stories matched. Try a different search or browse our favorite topics.",
    uk: "No stories matched. Try a different search or browse our favourite topics.",
  },
  cookieSettings: { com: "Cookie settings", uk: "Cookie settings" },
  personalize: { com: "personalize", uk: "personalise" },
  inYourInbox: { com: "In your inbox", uk: "In your inbox" },
  sponsored: { com: "Sponsored", uk: "Sponsored" },
  updated: { com: "Updated", uk: "Updated" },
} as const;

export type StringKey = keyof typeof STRINGS;

export function getSpelling(key: StringKey, site: SiteKey): string {
  return STRINGS[key][site];
}

export function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
