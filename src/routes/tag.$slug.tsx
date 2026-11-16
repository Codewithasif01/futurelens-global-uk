import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { tagQuery } from "@/lib/queries";
import { buildHead } from "@/lib/seo";
import { SITES } from "@/lib/sites";
import { ListingPage } from "@/components/site/ListingPage";
import { useSiteKey } from "@/hooks/use-site";

export const Route = createFileRoute("/tag/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(tagQuery(context.siteKey, params.slug));
    if (!data.tag) throw notFound();
    return { siteKey: context.siteKey, name: data.tag.name };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? buildHead({
          site: loaderData.siteKey,
          title: `${loaderData.name} | ${SITES[loaderData.siteKey].name}`,
          description: `Stories tagged ${loaderData.name} on ${SITES[loaderData.siteKey].name}.`,
          path: `/tag/${params.slug}`,
        })
      : { meta: [{ title: "Tag not found" }, { name: "robots", content: "noindex" }] },
  component: TagPage,
});

function TagPage() {
  const { slug } = Route.useParams();
  const site = useSiteKey();
  const { data } = useSuspenseQuery(tagQuery(site, slug));
  return <ListingPage kicker="Topic" title={data.tag!.name} posts={data.posts} />;
}
