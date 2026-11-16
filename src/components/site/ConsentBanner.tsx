import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CONSENT_CHANGED_EVENT,
  OPEN_CONSENT_EVENT,
  defaultConsent,
  readConsent,
  requiresOptIn,
  writeConsent,
  type Consent,
} from "@/lib/consent";
import { getVisitorCountry } from "@/lib/content.functions";
import type { SiteSettings } from "@/lib/content-types";
import { useSiteKey } from "@/hooks/use-site";

/** Effective consent for this visitor: stored choice, else the edition's default. */
export function useConsent(): Consent | null {
  const site = useSiteKey();
  const [consent, setConsent] = useState<Consent | null>(null);
  useEffect(() => {
    let alive = true;
    const stored = readConsent();
    if (stored) setConsent(stored);
    else
      getVisitorCountry().then(({ country }) => {
        const gpc = Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
        if (alive) setConsent(defaultConsent(site, country, gpc));
      }).catch(() => {});
    const onChange = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => {
      alive = false;
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    };
  }, [site]);
  return consent;
}

export function ConsentBanner({ settings }: { settings: SiteSettings | null }) {
  const site = useSiteKey();
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setAnalytics(stored.analytics);
      setAds(stored.ads);
    } else {
      getVisitorCountry()
        .then(({ country }) => setOpen(requiresOptIn(site, country)))
        .catch(() => setOpen(true));
    }
    const reopen = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setAds(c?.ads ?? false);
      setManage(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, [site]);

  if (!open) return null;
  const save = (choice: { analytics: boolean; ads: boolean }) => {
    writeConsent(choice);
    setOpen(false);
    setManage(false);
  };
  const privacy = settings?.privacy_page_slug ?? "privacy-policy";
  const cookies = settings?.cookie_page_slug ?? "cookie-policy";

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-0 bottom-0 z-50 p-3 md:p-5">
      <div className="mx-auto max-w-4xl rounded-sm border border-ink bg-card p-5 shadow-card md:p-6">
        <div className="edition-bar -mx-5 -mt-5 mb-4 h-1 md:-mx-6 md:-mt-6" />
        <h2 id="consent-title" className="text-xl font-semibold">{settings?.consent_title ?? "Your privacy choices"}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {settings?.consent_body}{" "}
          Read our <Link to="/pages/$slug" params={{ slug: cookies }} className="underline">Cookie Policy</Link> and{" "}
          <Link to="/pages/$slug" params={{ slug: privacy }} className="underline">Privacy Policy</Link>.
        </p>
        {manage && (
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
            <div className="flex items-center justify-between gap-3 sm:block">
              <Label className="font-semibold">Strictly necessary</Label>
              <p className="meta sm:mt-1">Always on</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="c-analytics" className="font-semibold">Analytics</Label>
              <Switch id="c-analytics" checked={analytics} onCheckedChange={setAnalytics} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="c-ads" className="font-semibold">Advertising</Label>
              <Switch id="c-ads" checked={ads} onCheckedChange={setAds} />
            </div>
          </div>
        )}
        {/* Accept and reject carry equal weight, as the ICO expects. */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="ink" onClick={() => save({ analytics: true, ads: true })}>Accept all</Button>
          <Button variant="ink" onClick={() => save({ analytics: false, ads: false })}>Reject all</Button>
          {manage ? (
            <Button variant="rule" onClick={() => save({ analytics, ads })}>Save choices</Button>
          ) : (
            <Button variant="rule" onClick={() => setManage(true)}>Manage choices</Button>
          )}
        </div>
      </div>
    </div>
  );
}
