import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { authorQuery } from "@/lib/queries";
import { buildHead } from "@/lib/seo";
import { SITES } from "@/lib/sites";
import { ListingPage } from "@/components/site/ListingPage";
import { useSiteKey } from "@/hooks/use-site";

export const Route = createFileRoute("/author/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(authorQuery(context.siteKey, params.slug));
    if (!data.author) throw notFound();
    return { siteKey: context.siteKey, name: data.author.name, bio: data.author.bio };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? buildHead({
          site: loaderData.siteKey,
          title: `${loaderData.name} | ${SITES[loaderData.siteKey].name}`,
          description: loaderData.bio ?? `Stories by ${loaderData.name} on ${SITES[loaderData.siteKey].name}.`,
          path: `/author/${params.slug}`,
          jsonLd: [{ "@context": "https://schema.org", "@type": "Person", name: loaderData.name, description: loaderData.bio }],
        })
      : { meta: [{ title: "Author not found" }, { name: "robots", content: "noindex" }] },
  component: AuthorPage,
});

function AuthorPage() {
  const { slug } = Route.useParams();
  const site = useSiteKey();
  const { data } = useSuspenseQuery(authorQuery(site, slug));
  const a = data.author!;
  return <ListingPage kicker={a.role_title ?? "Author"} title={a.name} intro={a.bio} posts={data.posts} empty="No stories by this author on this edition yet." />;
}
