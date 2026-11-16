import { useEffect } from "react";
import { useSite } from "@/hooks/use-site";
import { useConsent } from "./ConsentBanner";

/** Loads Plausible / GA4 for this edition only after analytics consent. */
export function Analytics() {
  const site = useSite();
  const consent = useConsent();
  const allowed = Boolean(consent?.analytics);

  useEffect(() => {
    if (!allowed) return;
    const added: HTMLScriptElement[] = [];
    if (site.analytics.plausibleDomain) {
      const s = document.createElement("script");
      s.defer = true;
      s.src = "https://plausible.io/js/script.js";
      s.dataset.domain = site.analytics.plausibleDomain;
      document.head.appendChild(s);
      added.push(s);
    }
    if (site.analytics.ga4Id) {
      const id = site.analytics.ga4Id;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(s);
      added.push(s);
      const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", id, { anonymize_ip: true });
    }
    return () => added.forEach((s) => s.remove());
  }, [allowed, site.analytics.plausibleDomain, site.analytics.ga4Id]);

  return null;
}
