import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { searchQuery } from "@/lib/queries";
import { buildHead } from "@/lib/seo";
import { SITES } from "@/lib/sites";
import { ListingPage } from "@/components/site/ListingPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSpelling } from "@/lib/i18n";
import { useSiteKey } from "@/hooks/use-site";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q.slice(0, 100) : "" }),
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(searchQuery(context.siteKey, deps.q));
    return { siteKey: context.siteKey };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          ...buildHead({
            site: loaderData.siteKey,
            title: `Search | ${SITES[loaderData.siteKey].name}`,
            description: `Search stories on ${SITES[loaderData.siteKey].name}.`,
            path: "/search",
            noindex: true,
          }),
        }
      : {},
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const site = useSiteKey();
  const navigate = useNavigate();
  const [value, setValue] = useState(q);
  const { data } = useSuspenseQuery(searchQuery(site, q));
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: value.trim() } });
  };
  return (
    <ListingPage
      kicker="Search"
      title={q ? `Results for “${q}”` : "Search"}
      posts={data.posts}
      empty={q ? getSpelling("noResults", site) : "Type at least two characters."}
    >
      <form onSubmit={onSubmit} role="search" className="mt-6 flex max-w-xl gap-2">
        <label htmlFor="q" className="sr-only">{getSpelling("searchPlaceholder", site)}</label>
        <Input id="q" value={value} onChange={(e) => setValue(e.target.value)} placeholder={getSpelling("searchPlaceholder", site)} className="h-11" />
        <Button type="submit" variant="ink" className="h-11 px-6">Search</Button>
      </form>
    </ListingPage>
  );
}
