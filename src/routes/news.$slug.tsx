import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQuery } from "@/lib/queries";
import { breadcrumbLd, buildHead, newsArticleLd, postLinks } from "@/lib/seo";
import { postPath, SITES, type SiteKey } from "@/lib/sites";
import { formatDate, formatTime } from "@/lib/i18n";
import { Markdown } from "@/components/site/Markdown";
import { PostCard } from "@/components/site/PostCard";
import { StoryNotFound } from "@/components/site/OtherEditionNotice";
import { Newsletter } from "@/components/site/Newsletter";
import { useIsProductionHost, useSiteKey } from "@/hooks/use-site";
import { editionHref } from "@/lib/edition-links";
import type { OtherEdition } from "@/lib/content-types";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(postQuery(context.siteKey, params.slug));
    if (!data.post) throw notFound({ data: { otherEdition: data.otherEdition } });
    const p = data.post;
    const links = postLinks(
      {
        slug: p.slug!,
        primary_site: p.primary_site as SiteKey,
        primary_slug: p.primary_slug!,
        counterpart_site: (p.counterpart_site as SiteKey | null) ?? null,
        counterpart_slug: p.counterpart_slug ?? null,
      },
      context.siteKey,
    );
    return {
      siteKey: context.siteKey,
      links,
      alternatePath: p.counterpart_slug ? postPath(p.counterpart_slug) : null,
      seo: {
        title: p.seo_title || p.title!,
        description: p.seo_description || p.excerpt!,
        image: p.featured_image,
        imageAlt: p.image_alt,
        published: p.published_at,
        modified: p.updated_at,
        ld: newsArticleLd(context.siteKey, {
          title: p.title!,
          excerpt: p.excerpt!,
          image: p.featured_image,
          published_at: p.published_at,
          updated_at: p.updated_at,
          author_name: p.author_name,
          author_slug: p.author_slug,
          category_name: p.category_name,
        }, links.canonical, links.selfUrl),
        crumbs: breadcrumbLd(context.siteKey, [
          { name: SITES[context.siteKey].name, path: "/" },
          ...(p.category_slug ? [{ name: p.category_name!, path: `/category/${p.category_slug}` }] : []),
          { name: p.title!, path: postPath(p.slug!) },
        ]),
      },
    };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Story not found" }, { name: "robots", content: "noindex" }] };
    }
    const { seo, links, siteKey } = loaderData;
    return buildHead({
      site: siteKey,
      title: `${seo.title} | ${SITES[siteKey].name}`,
      description: seo.description,
      path: postPath(params.slug),
      canonical: links.canonical,
      alternates: links.alternates,
      image: seo.image,
      imageAlt: seo.imageAlt,
      type: "article",
      publishedTime: seo.published,
      modifiedTime: seo.modified,
      jsonLd: [seo.ld, seo.crumbs],
    });
  },
  notFoundComponent: ({ data }) => (
    <StoryNotFound otherEdition={(data as { otherEdition?: OtherEdition } | undefined)?.otherEdition ?? null} />
  ),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const siteKey = useSiteKey();
  const production = useIsProductionHost();
  const { data } = useSuspenseQuery(postQuery(siteKey, slug));
  const post = data.post!;
  const published = post.published_at!;
  const counterpart = post.counterpart_site as SiteKey | null;

  return (
    <article className="pt-10">
      <header className="mx-auto max-w-3xl px-4 md:px-0">
        <nav aria-label="Breadcrumb" className="meta">
          <Link to="/" className="hover:underline">Home</Link>
          {post.category_slug && (
            <> / <Link to="/category/$slug" params={{ slug: post.category_slug }} className="hover:underline">{post.category_name}</Link></>
          )}
        </nav>
        {post.category_name && <p className="kicker mt-6">{post.category_name}</p>}
        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] md:text-6xl">{post.title}</h1>
        <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-border py-3">
          {post.author_slug && (
            <Link to="/author/$slug" params={{ slug: post.author_slug }} className="font-semibold hover:underline">
              {post.author_name}
            </Link>
          )}
          <span className="meta">
            <time dateTime={published}>{formatDate(published, siteKey)} · {formatTime(published, siteKey)}</time>
          </span>
        </div>
        {post.editor_note && (
          <p className="mt-5 border-l-4 border-edition bg-muted px-4 py-3 text-sm">
            <span className="kicker mr-2">Editor's note</span>{post.editor_note}
          </p>
        )}
      </header>

      {post.featured_image && (
        <figure className="mx-auto mt-8 max-w-5xl px-4 md:px-8">
          <img
            src={post.featured_image}
            alt={post.image_alt ?? ""}
            width={1280}
            height={720}
            fetchPriority="high"
            decoding="sync"
            className="aspect-video w-full rounded-sm object-cover"
          />
          {post.image_alt && <figcaption className="meta mt-2">{post.image_alt}</figcaption>}
        </figure>
      )}

      <div className="mx-auto mt-10 max-w-3xl px-4 md:px-0">
        <Markdown source={post.body ?? ""} />

        {data.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
            {data.tags.map((t) => (
              <li key={t.slug}>
                <Link to="/tag/$slug" params={{ slug: t.slug }} className="inline-block border border-ink px-3 py-1 font-mono text-xs uppercase tracking-wider hover:bg-ink hover:text-paper">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {counterpart && post.counterpart_slug && (
          <p className="meta mt-8">
            Also published on{" "}
            <a className="underline" hrefLang={SITES[counterpart].hreflang} href={editionHref(counterpart, postPath(post.counterpart_slug), production)}>
              {SITES[counterpart].name}
            </a>
          </p>
        )}
      </div>

      {data.related.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4 md:px-8" aria-label="Related">
          <h2 className="border-b-2 border-ink pb-2 text-2xl font-semibold">More in {post.category_name}</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {data.related.map((p) => <PostCard key={p.id} post={p} variant="rail" />)}
          </div>
        </section>
      )}

      <div className="mx-auto mt-16 max-w-7xl px-4 md:px-8"><Newsletter /></div>
    </article>
  );
}
