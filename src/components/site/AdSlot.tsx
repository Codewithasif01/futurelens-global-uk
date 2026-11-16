import { useSite, useSiteKey } from "@/hooks/use-site";
import { getSpelling } from "@/lib/i18n";
import { useConsent } from "./ConsentBanner";

/**
 * Sponsor slot. Renders only when the edition has ads on and the visitor allowed
 * advertising. Fixed height so the page doesn't jump when it appears.
 */
export function AdSlot({ adsEnabled, label }: { adsEnabled: boolean; label: string }) {
  const site = useSite();
  const siteKey = useSiteKey();
  const consent = useConsent();
  const show = adsEnabled && site.ads.enabled && Boolean(consent?.ads);
  return (
    <aside aria-label={getSpelling("sponsored", siteKey)} className="flex h-28 items-center justify-center rounded-sm border border-dashed border-border bg-muted/50">
      {show ? (
        <p className="meta text-center">
          {getSpelling("sponsored", siteKey)} · {site.ads.networkLabel} · {label}
        </p>
      ) : (
        <span className="sr-only">No sponsor content</span>
      )}
    </aside>
  );
}
