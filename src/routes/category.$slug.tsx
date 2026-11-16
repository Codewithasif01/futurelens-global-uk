import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoryQuery } from "@/lib/queries";
import { buildHead } from "@/lib/seo";
import { SITES } from "@/lib/sites";
import { ListingPage } from "@/components/site/ListingPage";
import { useSiteKey } from "@/hooks/use-site";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(categoryQuery(context.siteKey, params.slug));
    if (!data.category) throw notFound();
    return { siteKey: context.siteKey, name: data.category.name, description: data.category.description };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? buildHead({
          site: loaderData.siteKey,
          title: `${loaderData.name} | ${SITES[loaderData.siteKey].name}`,
          description: loaderData.description ?? `${loaderData.name} coverage from ${SITES[loaderData.siteKey].name}.`,
          path: `/category/${params.slug}`,
        })
      : { meta: [{ title: "Section not found" }, { name: "robots", content: "noindex" }] },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const site = useSiteKey();
  const { data } = useSuspenseQuery(categoryQuery(site, slug));
  return <ListingPage kicker="Section" title={data.category!.name} intro={data.category!.description} posts={data.posts} />;
}
