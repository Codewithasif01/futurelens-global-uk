import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { pageQuery } from "@/lib/queries";
import { buildHead } from "@/lib/seo";
import { SITES } from "@/lib/sites";
import { Markdown } from "@/components/site/Markdown";
import { formatDate } from "@/lib/i18n";
import { useSiteKey } from "@/hooks/use-site";

export const Route = createFileRoute("/pages/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(pageQuery(context.siteKey, params.slug));
    if (!data.page) throw notFound();
    return {
      siteKey: context.siteKey,
      title: data.page.seo_title || data.page.title,
      description: data.page.seo_description || `${data.page.title} — ${SITES[context.siteKey].name}`,
    };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? buildHead({
          site: loaderData.siteKey,
          title: `${loaderData.title} | ${SITES[loaderData.siteKey].name}`,
          description: loaderData.description,
          path: `/pages/${params.slug}`,
        })
      : { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] },
  component: StaticPage,
});

function StaticPage() {
  const { slug } = Route.useParams();
  const site = useSiteKey();
  const { data } = useSuspenseQuery(pageQuery(site, slug));
  const page = data.page!;
  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 md:px-0">
      <p className="kicker">{page.kind === "legal" ? "Legal" : SITES[site].name}</p>
      <h1 className="mt-2 border-b-2 border-ink pb-4 text-4xl font-semibold md:text-5xl">{page.title}</h1>
      <p className="meta mt-3">Last updated {formatDate(page.updated_at, site)}</p>
      <div className="mt-8"><Markdown source={page.body} /></div>
    </article>
  );
}
