import type { ReactNode } from "react";
import type { PostCard as PostCardData } from "@/lib/content-types";
import { PostGrid } from "./PostCard";

export function ListingPage({ kicker, title, intro, posts, empty, children }: {
  kicker: string;
  title: string;
  intro?: string | null;
  posts: PostCardData[];
  empty?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
      <header className="border-b-2 border-ink pb-6">
        <p className="kicker">{kicker}</p>
        <h1 className="mt-2 text-4xl font-semibold md:text-6xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
        {children}
      </header>
      <div className="mt-10">
        {posts.length ? <PostGrid posts={posts} /> : <p className="text-muted-foreground">{empty ?? "No stories yet."}</p>}
      </div>
    </div>
  );
}
