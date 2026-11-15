
create type public.site_key as enum ('com', 'uk');
create type public.post_region as enum ('global', 'us', 'uk', 'europe');
create type public.publish_status as enum ('draft', 'published');
create type public.app_role as enum ('admin', 'editor');

-- Roles -----------------------------------------------------------------
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin', 'editor'))
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- First account becomes admin
create or replace function public.grant_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_grant_admin
  after insert on auth.users for each row execute function public.grant_first_admin();

-- The edition a Data API request is made for. Set by the app as the x-fl-site header.
create or replace function public.request_site()
returns public.site_key language sql stable as $$
  select case coalesce(nullif(current_setting('request.headers', true), '')::json ->> 'x-fl-site', '')
    when 'com' then 'com'::public.site_key
    when 'uk' then 'uk'::public.site_key
    else null end
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- Authors (shared) ---------------------------------------------------------
create table public.authors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role_title text,
  bio text,
  avatar_url text,
  x_handle text,
  created_at timestamptz not null default now()
);
grant select on public.authors to anon, authenticated;
grant insert, update, delete on public.authors to authenticated;
grant all on public.authors to service_role;
alter table public.authors enable row level security;
create policy "Anyone reads authors" on public.authors for select to anon, authenticated using (true);
create policy "Staff manage authors" on public.authors for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Categories & tags (per site) ---------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  site public.site_key not null,
  slug text not null,
  name text not null,
  description text,
  position int not null default 0,
  unique (site, slug)
);
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  site public.site_key not null,
  slug text not null,
  name text not null,
  unique (site, slug)
);
grant select on public.categories, public.tags to anon, authenticated;
grant insert, update, delete on public.categories, public.tags to authenticated;
grant all on public.categories, public.tags to service_role;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
create policy "Edition reads own categories" on public.categories for select to anon, authenticated
  using (site = public.request_site() or public.is_staff(auth.uid()));
create policy "Staff manage categories" on public.categories for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Edition reads own tags" on public.tags for select to anon, authenticated
  using (site = public.request_site() or public.is_staff(auth.uid()));
create policy "Staff manage tags" on public.tags for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Posts -------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  featured_image text,
  image_alt text,
  seo_title text,
  seo_description text,
  author_id uuid references public.authors(id) on delete set null,
  sites public.site_key[] not null,
  primary_site public.site_key not null,
  region public.post_region not null default 'global',
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_sites_not_empty check (cardinality(sites) >= 1),
  constraint posts_primary_in_sites check (primary_site = any(sites))
);
create index posts_sites_idx on public.posts using gin (sites);
create index posts_published_idx on public.posts (status, published_at desc);
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

create table public.post_site_overrides (
  post_id uuid not null references public.posts(id) on delete cascade,
  site public.site_key not null,
  title text,
  excerpt text,
  slug text,
  body text,
  featured_image text,
  seo_title text,
  seo_description text,
  editor_note text,
  primary key (post_id, site)
);

create table public.post_categories (
  post_id uuid not null references public.posts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);
create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

grant select on public.posts, public.post_site_overrides, public.post_categories, public.post_tags to anon, authenticated;
grant insert, update, delete on public.posts, public.post_site_overrides, public.post_categories, public.post_tags to authenticated;
grant all on public.posts, public.post_site_overrides, public.post_categories, public.post_tags to service_role;
alter table public.posts enable row level security;
alter table public.post_site_overrides enable row level security;
alter table public.post_categories enable row level security;
alter table public.post_tags enable row level security;

create policy "Edition reads its published posts" on public.posts for select to anon, authenticated
  using (
    (status = 'published' and published_at <= now() and public.request_site() = any(sites))
    or public.is_staff(auth.uid())
  );
create policy "Staff manage posts" on public.posts for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "Edition reads overrides of its posts" on public.post_site_overrides for select to anon, authenticated
  using (
    exists (select 1 from public.posts p where p.id = post_id and p.status = 'published'
            and p.published_at <= now() and public.request_site() = any(p.sites))
    or public.is_staff(auth.uid())
  );
create policy "Staff manage overrides" on public.post_site_overrides for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "Edition reads post categories" on public.post_categories for select to anon, authenticated
  using (exists (select 1 from public.categories c where c.id = category_id and c.site = public.request_site())
         or public.is_staff(auth.uid()));
create policy "Staff manage post categories" on public.post_categories for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "Edition reads post tags" on public.post_tags for select to anon, authenticated
  using (exists (select 1 from public.tags t where t.id = tag_id and t.site = public.request_site())
         or public.is_staff(auth.uid()));
create policy "Staff manage post tags" on public.post_tags for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- A post's category or tag must belong to an edition the post is on.
create or replace function public.check_post_taxonomy_site()
returns trigger language plpgsql set search_path = public as $$
declare t_site public.site_key; p_sites public.site_key[];
begin
  select sites into p_sites from public.posts where id = new.post_id;
  if tg_table_name = 'post_categories' then
    select site into t_site from public.categories where id = new.category_id;
  else
    select site into t_site from public.tags where id = new.tag_id;
  end if;
  if not (t_site = any(p_sites)) then
    raise exception 'Taxonomy belongs to edition % but the post is not on it', t_site;
  end if;
  return new;
end $$;
create trigger post_categories_site before insert or update on public.post_categories
  for each row execute function public.check_post_taxonomy_site();
create trigger post_tags_site before insert or update on public.post_tags
  for each row execute function public.check_post_taxonomy_site();

-- Per-edition view of posts: one row per (post, edition) with overrides applied.
-- security_invoker keeps the posts policies in force; the WHERE pins it to the requested edition.
create view public.site_posts with (security_invoker = true) as
select
  p.id,
  s.site,
  coalesce(nullif(o.slug, ''), p.slug) as slug,
  coalesce(nullif(o.title, ''), p.title) as title,
  coalesce(nullif(o.excerpt, ''), p.excerpt) as excerpt,
  coalesce(nullif(o.body, ''), p.body) as body,
  coalesce(nullif(o.featured_image, ''), p.featured_image) as featured_image,
  p.image_alt,
  coalesce(nullif(o.seo_title, ''), p.seo_title) as seo_title,
  coalesce(nullif(o.seo_description, ''), p.seo_description) as seo_description,
  o.editor_note,
  p.region,
  p.published_at,
  p.updated_at,
  p.sites,
  p.primary_site,
  (cardinality(p.sites) > 1) as is_shared,
  coalesce(nullif(op.slug, ''), p.slug) as primary_slug,
  case when cardinality(p.sites) > 1 then (case when s.site = 'com' then 'uk' else 'com' end)::public.site_key end as counterpart_site,
  case when cardinality(p.sites) > 1 then coalesce(nullif(oc.slug, ''), p.slug) end as counterpart_slug,
  a.slug as author_slug,
  a.name as author_name,
  a.role_title as author_role,
  a.avatar_url as author_avatar,
  cat.slug as category_slug,
  cat.name as category_name
from public.posts p
cross join lateral unnest(p.sites) as s(site)
left join public.post_site_overrides o on o.post_id = p.id and o.site = s.site
left join public.post_site_overrides op on op.post_id = p.id and op.site = p.primary_site
left join public.post_site_overrides oc on oc.post_id = p.id and oc.site <> s.site
left join public.authors a on a.id = p.author_id
left join lateral (
  select c.slug, c.name from public.post_categories pc
  join public.categories c on c.id = pc.category_id
  where pc.post_id = p.id and c.site = s.site
  order by c.position limit 1
) cat on true
where p.status = 'published' and p.published_at <= now() and s.site = public.request_site();
grant select on public.site_posts to anon, authenticated, service_role;

-- Pages (per site) ----------------------------------------------------------
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  site public.site_key not null,
  slug text not null,
  title text not null,
  kind text not null default 'standard' check (kind in ('standard', 'legal')),
  body text not null default '',
  seo_title text,
  seo_description text,
  status public.publish_status not null default 'published',
  updated_at timestamptz not null default now(),
  unique (site, slug)
);
create trigger pages_touch before update on public.pages for each row execute function public.touch_updated_at();
grant select on public.pages to anon, authenticated;
grant insert, update, delete on public.pages to authenticated;
grant all on public.pages to service_role;
alter table public.pages enable row level security;
create policy "Edition reads its published pages" on public.pages for select to anon, authenticated
  using ((site = public.request_site() and status = 'published') or public.is_staff(auth.uid()));
create policy "Staff manage pages" on public.pages for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Navigation (per site) -----------------------------------------------------
create table public.navigation (
  id uuid primary key default gen_random_uuid(),
  site public.site_key not null,
  menu text not null check (menu in ('header', 'footer', 'legal')),
  label text not null,
  href text not null,
  position int not null default 0
);
grant select on public.navigation to anon, authenticated;
grant insert, update, delete on public.navigation to authenticated;
grant all on public.navigation to service_role;
alter table public.navigation enable row level security;
create policy "Edition reads its navigation" on public.navigation for select to anon, authenticated
  using (site = public.request_site() or public.is_staff(auth.uid()));
create policy "Staff manage navigation" on public.navigation for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Homepage picks (per site) -------------------------------------------------
create table public.homepage_picks (
  id uuid primary key default gen_random_uuid(),
  site public.site_key not null,
  slot text not null check (slot in ('hero', 'featured', 'rail')),
  post_id uuid not null references public.posts(id) on delete cascade,
  position int not null default 0,
  unique (site, slot, post_id)
);
grant select on public.homepage_picks to anon, authenticated;
grant insert, update, delete on public.homepage_picks to authenticated;
grant all on public.homepage_picks to service_role;
alter table public.homepage_picks enable row level security;
create policy "Edition reads its homepage" on public.homepage_picks for select to anon, authenticated
  using (site = public.request_site() or public.is_staff(auth.uid()));
create policy "Staff manage homepage" on public.homepage_picks for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create or replace function public.check_pick_site()
returns trigger language plpgsql set search_path = public as $$
begin
  if not exists (select 1 from public.posts where id = new.post_id and new.site = any(sites)) then
    raise exception 'Homepage pick for % must be a post on that edition', new.site;
  end if;
  return new;
end $$;
create trigger homepage_picks_site before insert or update on public.homepage_picks
  for each row execute function public.check_pick_site();

-- Site settings (one row per site) ------------------------------------------
create table public.site_settings (
  site public.site_key primary key,
  tagline text,
  default_seo_title text,
  default_seo_description text,
  legal_entity_name text,
  company_number text,
  registered_address text,
  vat_number text,
  ico_registration text,
  contact_email text,
  footer_note text,
  consent_title text not null default 'Your privacy choices',
  consent_body text not null default '',
  privacy_page_slug text not null default 'privacy-policy',
  cookie_page_slug text not null default 'cookie-policy',
  do_not_sell_page_slug text,
  ads_enabled boolean not null default true,
  ad_network_id text,
  updated_at timestamptz not null default now()
);
create trigger site_settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Edition reads its settings" on public.site_settings for select to anon, authenticated
  using (site = public.request_site() or public.is_staff(auth.uid()));
create policy "Staff manage settings" on public.site_settings for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Subscribers (per site) ----------------------------------------------------
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  site public.site_key not null,
  email text not null check (char_length(email) between 3 and 320 and email like '%_@_%'),
  consent_text text,
  created_at timestamptz not null default now(),
  unique (site, email)
);
grant insert on public.subscribers to anon, authenticated;
grant select, update, delete on public.subscribers to authenticated;
grant all on public.subscribers to service_role;
alter table public.subscribers enable row level security;
create policy "Visitors subscribe to the edition they are on" on public.subscribers for insert to anon, authenticated
  with check (site = public.request_site());
create policy "Staff read subscribers" on public.subscribers for select to authenticated
  using (public.is_staff(auth.uid()));
create policy "Staff manage subscribers" on public.subscribers for delete to authenticated
  using (public.is_staff(auth.uid()));
