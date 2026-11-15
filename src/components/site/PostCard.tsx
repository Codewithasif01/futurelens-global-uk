import { Link } from "@tanstack/react-router";
import type { PostCard as PostCardData } from "@/lib/content-types";
import { formatDate } from "@/lib/i18n";
import { useSiteKey } from "@/hooks/use-site";

type Variant = "lead" | "standard" | "compact" | "rail";

export function PostCard({ post, variant = "standard", priority = false }: { post: PostCardData; variant?: Variant; priority?: boolean }) {
  const site = useSiteKey();
  const date = post.published_at ? formatDate(post.published_at, site) : null;

  if (variant === "lead") {
    return (
      <article className="group relative overflow-hidden rounded-sm bg-ink">
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.image_alt ?? ""}
            width={1280}
            height={720}
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            className="aspect-[16/10] w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.02] md:aspect-[16/9]"
          />
        )}
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          {post.category_name && <p className="kicker !text-edition-2">{post.category_name}</p>}
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold leading-[1.05] text-paper md:text-5xl">
            <Link to="/news/$slug" params={{ slug: post.slug! }} className="after:absolute after:inset-0">
              <span className="link-underline">{post.title}</span>
            </Link>
          </h2>
          <p className="mt-3 hidden max-w-2xl text-base text-paper/85 md:block">{post.excerpt}</p>
          <p className="meta mt-3 !text-paper/75">
            {post.author_name}{date && <> · <time dateTime={post.published_at!}>{date}</time></>}
          </p>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group relative border-t border-border py-4 first:border-t-0">
        {post.category_name && <p className="kicker">{post.category_name}</p>}
        <h3 className="mt-1 text-lg font-semibold leading-snug">
          <Link to="/news/$slug" params={{ slug: post.slug! }} className="after:absolute after:inset-0">
            <span className="link-underline">{post.title}</span>
          </Link>
        </h3>
        {date && <p className="meta mt-1"><time dateTime={post.published_at!}>{date}</time></p>}
      </article>
    );
  }

  return (
    <article className={`group relative flex flex-col ${variant === "rail" ? "" : "animate-rise"}`}>
      {post.featured_image && (
        <div className="overflow-hidden rounded-sm bg-muted">
          <img
            src={post.featured_image}
            alt={post.image_alt ?? ""}
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {post.category_name && <p className="kicker">{post.category_name}</p>}
      </div>
      <h3 className={`mt-1 font-semibold leading-tight ${variant === "rail" ? "text-lg" : "text-xl md:text-2xl"}`}>
        <Link to="/news/$slug" params={{ slug: post.slug! }} className="after:absolute after:inset-0">
          <span className="link-underline">{post.title}</span>
        </Link>
      </h3>
      {variant !== "rail" && <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">{post.excerpt}</p>}
      <p className="meta mt-2">
        {post.author_name}{date && <> · <time dateTime={post.published_at!}>{date}</time></>}
      </p>
    </article>
  );
}

export function PostGrid({ posts }: { posts: PostCardData[] }) {
  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
