import { getSite, type SiteKey } from "./sites";

export const CONSENT_COOKIE = "fl_consent";
export const OPEN_CONSENT_EVENT = "fl:open-consent";
export const CONSENT_CHANGED_EVENT = "fl:consent-changed";
const VERSION = 1;

export type Consent = { v: number; analytics: boolean; ads: boolean; ts: number; source: "banner" | "default" | "gpc" };

/** EEA + UK + Switzerland: opt-in consent required before non-essential cookies. */
const OPT_IN_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO",
  "GB", "CH",
]);

/**
 * Whether the visitor must opt in before analytics/ads load.
 * - UK edition: always (UK GDPR + PECR).
 * - Global edition: visitors in the EEA/UK/CH, and anyone whose country is unknown.
 *   Others (e.g. US) get opt-out controls ("Do Not Sell or Share") instead.
 */
export function requiresOptIn(site: SiteKey, country: string | null): boolean {
  if (getSite(site).consent.model === "uk-gdpr-pecr") return true;
  if (!country) return true;
  return OPT_IN_COUNTRIES.has(country.toUpperCase());
}

/** Choices that apply before the visitor has said anything. */
export function defaultConsent(site: SiteKey, country: string | null, gpc: boolean): Consent | null {
  if (requiresOptIn(site, country)) return null; // nothing optional until they choose
  return { v: VERSION, analytics: true, ads: !gpc, ts: 0, source: gpc ? "gpc" : "default" };
}

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  if (!m) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(m[1])) as Consent;
    return parsed.v === VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; ads: boolean }) {
  const value: Consent = { v: VERSION, ...choice, ts: Date.now(), source: "banner" };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  // First-party cookie on this domain only, so each edition keeps its own choice.
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: value }));
  return value;
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
