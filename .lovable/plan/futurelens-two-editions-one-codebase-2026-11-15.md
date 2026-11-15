# FutureLens: two editions, one codebase

## Read this first: stack changes

This project runs on a fixed stack, so a few parts of your brief map to equivalents. Every feature in the brief stays; only the tooling changes.

| Your brief | What gets built here | Why |
|---|---|---|
| Next.js App Router | TanStack Start (React 19, SSR, file routes, server functions) | This platform's only framework |
| `middleware.ts` | Request middleware in `src/start.ts` that reads `Host` and resolves the site key | Same job, runs on every request |
| Payload CMS + `/admin` | Admin built into the app at `/admin` (posts, categories, tags, pages, navigation, homepage, site settings, authors, subscribers), with sign-in and roles | Payload can't run here |
| PostgreSQL | Lovable Cloud (managed Postgres, auth, file storage) | Built in, no external account |
| Vercel Blob | Lovable Cloud file storage | Built in |
| Vercel, one project, two domains | Lovable hosting: connect both domains to this one project and turn off "primary domain" so neither redirects to the other. `www` redirects to the bare domain | Confirmed in Lovable's domain docs |
| ISR + `revalidateTag` | Pages render on each request, with CDN cache headers, `Vary: Host`, and query cache keys that always include the site key. Publishing a post refreshes only its sites' keys | There's no ISR here. Per-site keys give the same isolation |

**Multi-tenant plugin:** not used, because Payload isn't available. Even with Payload, I'd skip `@payloadcms/plugin-multi-tenant`: it assumes each record belongs to one tenant, and your shared posts (with `sites[]`, `primarySite` and per-site overrides) don't fit that. The plan uses manual `site` / `sites` fields, and database row security makes every query filter by site.

## Phases and files

### 1. Site config and resolution
- `src/lib/sites.ts`: `SITES.com` / `SITES.uk` hold key, domain, name, locale, currency, timezone, date format, default OG image, social handles, analytics IDs (from env), ad settings, accent tokens and homepage layout options
- `src/lib/site-resolver.ts`: host to site key. `futurelens.com` and `www.` map to `com`. `futurelens.co.uk` and `www.` map to `uk`. `uk.futurelens.local` maps to `uk`. Localhost, previews and `futurelens.local` default to `com`, overridable with `?site=uk` or the `x-site` header (non-production hosts only)
- `src/start.ts`: request middleware that redirects `www` to the bare domain (301), redirects `/admin` on `.co.uk` to `futurelens.com/admin`, and stores the site key in the request context
- `getCurrentSite` server function and a `useSite()` hook. The site key goes into the router context
- Unit tests for the resolver

### 2. Data model and access (Lovable Cloud)
- Tables: `posts` (`sites[]`, `primary_site`, `region`, `localized_notes` per site, `status`, `published_at`), `post_overrides` (site, title, excerpt, slug, image, SEO), `categories`, `tags` and `pages` (each with a `site` field), `navigation`, `homepage`, `site_settings` (one row per site, holding legal entity, consent text, ads, default SEO), `authors` (shared), `subscribers` (with a `site` field), and `user_roles` (admin, editor)
- Database rules: the public can read only published rows for the requested site. Editors and admins can edit. Roles live in their own table
- Admin list views get a site filter (All / com / uk / shared) and coloured site badges. The post editor warns when a post targets both sites but has no overrides

### 3. Site-aware data access
- `src/lib/queries/*`: every query takes `siteKey` as a required argument. No query works without it
- Query keys look like `['posts', siteKey, ...]`. Publishing invalidates only the post's sites
- A post that isn't on the current site returns a real 404. That 404 page can link to the other edition, but never redirects
- Category, tag, author and search routes all follow the same rule

### 4. Layout, theme and helpers
- One set of components. `data-site` on `<html>` switches CSS variables (accent gradient, edition badge colour)
- Header shows the edition tag ("FutureLens UK") and a "Switch edition" link that goes to the matching page if one exists, otherwise to the other homepage
- Homepage blocks are driven by config: a "Europe Watch" rail on .com, a "UK & Europe" hero rail on .co.uk
- `src/lib/i18n.ts`: `formatDate`, `formatTime` (24-hour on UK), `formatCurrency` and `getSpelling(key)` for UI strings (color/colour, center/centre, program/programme). These are the only places locale is read. Tests cover both sites

### 5. SEO
- Each route's `head()` sets the canonical (primary-site URL for shared posts), `og:url`, `og:locale`, `og:site_name` and the Twitter tags
- hreflang (`en-US`, `en-GB`, `x-default`) appears only when a real counterpart exists on the other site
- Server routes `/sitemap.xml`, `/news-sitemap.xml` (last 48h), `/rss.xml` and `/robots.txt` are all built per host
- JSON-LD for Organization, WebSite (with SearchAction) and NewsArticle, using each site's own domain, name, locale and publisher
- `manifest.webmanifest`, icons and default OG/Twitter images per site, each showing its own name and domain
- Tests check the canonical and hreflang rules

### 6. Compliance
- One consent banner, with its text and links coming from each site's settings
- UK: UK GDPR/PECR rules, reject as easy as accept, granular choices, link to the ICO-aware policy
- .com: GDPR banner for EU/UK visitors, plus a "Do Not Sell or Share" (CCPA/CPRA) link and placeholder page
- Analytics and ad scripts load only after consent. The consent cookie is first-party, so it's stored per domain
- Analytics IDs per site come from environment variables

### 7. Seed data
- A seed migration adds 8 com-only posts, 8 uk-only posts and 4 shared posts (2 with overrides), plus authors, categories, tags, navigation, homepage picks, footers, and placeholder legal pages per site (UK Privacy and Cookies; US/EU Privacy, Cookies and Do Not Sell)

### 8. README and acceptance
- `README.md` covers: architecture, testing both editions locally (`?site=uk`, `x-site`, hosts-file entries for `futurelens.local` and `uk.futurelens.local`), deploying two domains (Lovable domain settings, DNS A/TXT records, SSL, turning off the primary domain, `www`), Search Console (one property per domain, separate sitemaps, `.co.uk` geo-targeted by its country code), and the acceptance checklist with results
- `.env.example` lists every variable, grouped
- Verification: browser checks on both editions (404s, canonical, hreflang, sitemaps, RSS, robots, JSON-LD, OG tags, spelling, GBP, dates), unit tests, and a Lighthouse run on both homepages with scores reported

## Decisions where I'll use a default unless you say otherwise
1. **Admin:** works on `.com` only. `.co.uk/admin` redirects to `futurelens.com/admin`
2. **Analytics:** Plausible, one site ID per domain. GA4 can be switched on per site through environment variables
3. **Share images:** a fixed share image per site, generated once with its domain on it, plus the post's featured image on articles. Drawing a custom image for every article on the server is heavy on this hosting, so I'd leave it out unless you want it
4. **Legal entity details, registered address, ICO number and social handles:** placeholders that you fill in from the admin
5. **Admin accounts:** sign-in with email and password. The first account you create becomes admin

## Order of work
Phase 1, then turn on Lovable Cloud, then phases 2 to 8 in order. The build is checked after each phase and errors are fixed before moving on.
