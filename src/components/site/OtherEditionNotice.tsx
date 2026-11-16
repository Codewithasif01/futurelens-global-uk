import { Link } from "@tanstack/react-router";
import { useIsProductionHost } from "@/hooks/use-site";
import { editionHref } from "@/lib/edition-links";
import { SITES } from "@/lib/sites";
import type { OtherEdition } from "@/lib/content-types";

/** 404 body. Offers (never forces) the other edition when it has the story. */
export function StoryNotFound({ otherEdition }: { otherEdition: OtherEdition }) {
  const production = useIsProductionHost();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="kicker">Error 404</p>
      <h1 className="mt-3 text-4xl font-semibold md:text-5xl">This story isn't on this edition</h1>
      {otherEdition ? (
        <p className="mt-5 text-lg text-muted-foreground">
          This story is available on our{" "}
          <a className="font-semibold text-edition-ink underline underline-offset-4" href={editionHref(otherEdition.site, otherEdition.path, production)} hrefLang={SITES[otherEdition.site].hreflang}>
            {SITES[otherEdition.site].shortEdition} edition
          </a>
          .
        </p>
      ) : (
        <p className="mt-5 text-lg text-muted-foreground">It may have been moved or removed.</p>
      )}
      <Link to="/" className="mt-8 inline-block border border-ink px-5 py-2 font-medium hover:bg-ink hover:text-paper">
        Back to the front page
      </Link>
    </div>
  );
}
