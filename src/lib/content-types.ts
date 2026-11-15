import type { Database } from "@/integrations/supabase/types";
import type { SiteKey } from "./sites";

export type SitePost = Database["public"]["Views"]["site_posts"]["Row"];
export type PostCard = Pick<
  SitePost,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "featured_image"
  | "image_alt"
  | "published_at"
  | "region"
  | "category_slug"
  | "category_name"
  | "author_name"
  | "author_slug"
  | "is_shared"
>;
export type NavItem = { label: string; href: string };
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type OtherEdition = { site: SiteKey; path: string } | null;
