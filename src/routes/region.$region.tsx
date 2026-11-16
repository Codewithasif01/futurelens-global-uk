import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { regionQuery } from "@/lib/queries";
import { buildHead } from "@/lib/seo";
import { SITES, type SiteKey } from "@/lib/sites";
import { ListingPage } from "@/components/site/ListingPage";
import { useSiteKey } from "@/hooks/use-site";

const REGIONS = ["global", "us", "uk", "europe"] as const;
type Region = (typeof REGIONS)[number];

function regionTitle(site: SiteKey, region: Region): string {
  if (region === "europe" && site === "com") return "Europe Watch";
  if (region === "uk" || region === "europe") return "UK & Europe";
  if (region === "us") return "United States";
  return "Global";
}

export const Route = createFileRoute("/region/$region")({
  loader: async ({ context, params }) => {
    if (!(REGIONS as readonly string[]).includes(params.region)) throw notFound();
    const region = params.region as Region;
    await context.queryClient.ensureQueryData(regionQuery(context.siteKey, region));
    return { siteKey: context.siteKey, title: regionTitle(context.siteKey, region) };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? buildHead({
          site: loaderData.siteKey,
          title: `${loaderData.title} | ${SITES[loaderData.siteKey].name}`,
          description: `${loaderData.title}: technology, science and policy coverage from ${SITES[loaderData.siteKey].name}.`,
          path: `/region/${params.region}`,
        })
      : { meta: [{ title: "Region not found" }, { name: "robots", content: "noindex" }] },
  component: RegionPage,
});

function RegionPage() {
  const { region } = Route.useParams();
  const site = useSiteKey();
  const { data } = useSuspenseQuery(regionQuery(site, region as Region));
  return <ListingPage kicker="Region" title={regionTitle(site, region as Region)} posts={data.posts} />;
}
