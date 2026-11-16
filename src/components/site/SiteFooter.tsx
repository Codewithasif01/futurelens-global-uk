import type { NavItem, SiteSettings } from "@/lib/content-types";
import { openConsentSettings } from "@/lib/consent";
import { getSpelling } from "@/lib/i18n";
import { useIsProductionHost, useSite, useSiteKey } from "@/hooks/use-site";
import { LensMark } from "./Logo";
import { editionHref } from "@/lib/edition-links";
import { SITES, otherSite } from "@/lib/sites";

function Detail({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  return <li>{value}</li>;
}

export function SiteFooter({ footer, legal, settings }: { footer: NavItem[]; legal: NavItem[]; settings: SiteSettings | null }) {
  const site = useSite();
  const siteKey = useSiteKey();
  const production = useIsProductionHost();
  const target = otherSite(siteKey);
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="edition-bar h-1" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="flex items-center gap-2 font-display text-2xl font-semibold">
            <LensMark className="h-6 w-6" /> {site.name}
          </p>
          <p className="mt-3 max-w-md text-sm text-paper/75">{settings?.footer_note ?? site.description}</p>
          <p className="mt-4 text-sm">
            <a className="underline underline-offset-4" href={editionHref(target, "/", production)} hrefLang={SITES[target].hreflang}>
              Visit {SITES[target].name} ({SITES[target].editionLabel})
            </a>
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="kicker !text-edition-2">FutureLens</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {footer.map((i) => <li key={i.href}><a href={i.href} className="hover:underline">{i.label}</a></li>)}
          </ul>
        </nav>
        <nav aria-label="Legal">
          <h2 className="kicker !text-edition-2">{capital(getSpelling("privacyCenter", siteKey))}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {legal.map((i) => <li key={i.href}><a href={i.href} className="hover:underline">{i.label}</a></li>)}
            <li>
              <button type="button" onClick={openConsentSettings} className="text-left hover:underline">
                {getSpelling("cookieSettings", siteKey)}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-paper/15">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.7rem] text-paper/70">
            <li>© {new Date().getFullYear()} {settings?.legal_entity_name ?? site.name}</li>
            <Detail value={settings?.company_number} />
            <Detail value={settings?.registered_address} />
            <Detail value={settings?.vat_number} />
            <Detail value={settings?.ico_registration} />
            <Detail value={settings?.contact_email} />
          </ul>
        </div>
      </div>
    </footer>
  );
}

function capital(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
