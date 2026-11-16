import { useMatches } from "@tanstack/react-router";
import { ArrowLeftRight } from "lucide-react";
import { useIsProductionHost, useSite, useSiteKey } from "@/hooks/use-site";
import { editionHref } from "@/lib/edition-links";
import { getSpelling } from "@/lib/i18n";
import { SITES, otherSite } from "@/lib/sites";

/**
 * Edition indicator + switch. Goes to the same story on the other edition when it
 * exists there (routes expose it as loaderData.alternatePath), else its homepage.
 */
export function EditionSwitch() {
  const site = useSite();
  const siteKey = useSiteKey();
  const production = useIsProductionHost();
  const target = otherSite(siteKey);
  const alternatePath = useMatches({
    select: (ms) =>
      ms
        .map((m) => (m.loaderData as { alternatePath?: string | null } | undefined)?.alternatePath)
        .filter((p): p is string => typeof p === "string")
        .at(-1) ?? "/",
  });
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-widest">
        <span aria-hidden className="h-2 w-2 rounded-full bg-edition" />
        {site.editionLabel}
      </span>
      <a
        href={editionHref(target, alternatePath, production)}
        hrefLang={SITES[target].hreflang}
        className="inline-flex items-center gap-1 font-mono text-[0.68rem] uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
      >
        <ArrowLeftRight className="h-3 w-3" aria-hidden />
        {getSpelling("switchEdition", siteKey)}: {SITES[target].shortEdition}
      </a>
    </div>
  );
}
