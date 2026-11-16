import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { chromeQuery, homeQuery } from "@/lib/queries";
import { buildHead, homeAlternates } from "@/lib/seo";
import { getSite } from "@/lib/sites";
import { PostCard, PostGrid } from "@/components/site/PostCard";
import { Newsletter } from "@/components/site/Newsletter";
import { AdSlot } from "@/components/site/AdSlot";
import { useSite, useSiteKey } from "@/hooks/use-site";
import { formatDate, getSpelling } from "@/lib/i18n";
import type { PostCard as PostCardData } from "@/lib/content-types";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const [chrome] = await Promise.all([
      context.queryClient.ensureQueryData(chromeQuery(context.siteKey)),
      context.queryClient.ensureQueryData(homeQuery(context.siteKey)),
    ]);
    return {
      siteKey: context.siteKey,
      title: chrome.settings?.default_seo_title ?? getSite(context.siteKey).name,
      description: chrome.settings?.default_seo_description ?? getSite(context.siteKey).description,
      alternatePath: "/",
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildHead({
          site: loaderData.siteKey,
          title: loaderData.title,
          description: loaderData.description,
          path: "/",
          alternates: homeAlternates(),
        })
      : {},
  component: Home,
});

function RailHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 border-b-2 border-ink pb-2">
      <h2 className="text-2xl font-semibold md:text-3xl">
        <span className="edition-text">{title}</span>
      </h2>
      {subtitle && <p className="meta hidden sm:block">{subtitle}</p>}
    </div>
  );
}

function SideList({ title, posts }: { title: string; posts: PostCardData[] }) {
  return (
    <aside aria-labelledby="side-title">
      <h2 id="side-title" className="kicker border-b-2 border-ink pb-2 !text-ink">{title}</h2>
      <div>{posts.map((p) => <PostCard key={p.id} post={p} variant="compact" />)}</div>
    </aside>
  );
}

function Home() {
  const siteKey = useSiteKey();
  const site = useSite();
  const { data } = useSuspenseQuery(homeQuery(siteKey));
  const { data: chrome } = useSuspenseQuery(chromeQuery(siteKey));
  const regionalFirst = site.homepage.heroEmphasis === "regional";
  const today = formatDate(new Date(), siteKey);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
      <h1 className="sr-only">{site.name}: {site.tagline}</h1>
      <p className="meta mb-4">{today} · {site.editionLabel}</p>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {data.hero && <PostCard post={data.hero} variant="lead" priority />}
        </div>
        <div className="lg:col-span-4">
          {regionalFirst ? (
            <SideList title={site.homepage.regionalRail.title} posts={data.rail} />
          ) : (
            <SideList title="Top stories" posts={data.featured} />
          )}
        </div>
      </section>

      {regionalFirst && data.featured.length > 0 && (
        <section className="mt-14" aria-label="Featured">
          <RailHeading title="Editors' picks" />
          <div className="grid gap-8 md:grid-cols-3">
            {data.featured.map((p) => <PostCard key={p.id} post={p} variant="rail" />)}
          </div>
        </section>
      )}

      <div className="mt-14">
        <AdSlot adsEnabled={chrome.settings?.ads_enabled ?? false} label="Homepage" />
      </div>

      {!regionalFirst && data.rail.length > 0 && (
        <section className="mt-14 rounded-sm bg-muted p-6 md:p-8" aria-label={site.homepage.regionalRail.title}>
          <RailHeading title={site.homepage.regionalRail.title} subtitle="Policy, research and markets across the Atlantic" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {data.rail.map((p) => <PostCard key={p.id} post={p} variant="rail" />)}
          </div>
        </section>
      )}

      <section className="mt-14" aria-label="Latest">
        <RailHeading title={getSpelling("latest", siteKey)} />
        <PostGrid posts={data.latest} />
      </section>

      <div className="mt-16">
        <Newsletter />
      </div>
    </div>
  );
}
