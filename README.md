# FutureLens Global & UK

You are a senior full-stack engineer. The FutureLens project (Next.js App Router + TypeScript + Tailwind + Payload CMS + PostgreSQL + Vercel) already exists or is being built. Extend it so that ONE codebase and ONE Payload admin panel serve TWO public websites:

futurelens.com: the Global / US edition (US English, USD, US-first audience, with Europe as a second audience)
futurelens.co.uk: the UK & Europe edition (British English, GBP, UK/Europe-first stories)

Both are owned by me. They share the same brand, design system and code, but each must feel native to its audience and must NOT be a duplicate of the other.

ARCHITECTURE (mandatory)
Single repository, single Next.js app, single Vercel project with both domains attached. Also support www. variants, redirecting to the non-www version.
Single Payload CMS with one admin at /admin, available on both domains but protected (you may restrict it to the .com domain only and redirect the other).
Site resolution by hostname: use Next.js middleware to read the Host header and map it to a site key:
futurelens.com and www.futurelens.com -> com
futurelens.co.uk and www.futurelens.co.uk -> uk
localhost, *.vercel.app previews -> com by default, with an override via a ?site=uk query parameter or an x-site header for local testing. Also add local dev hosts such as futurelens.local and uk.futurelens.local in the README.
Keep one central config file, lib/sites.ts, that defines per-site settings:
key, domain, name, locale (en-US / en-GB), currency, default timezone, date format, default OG image, social handles, analytics IDs, ad settings, accent color tweak, and homepage layout options.
Every data query must be filtered by the current site. There must be no way for content for one site to leak to the other unless it is explicitly shared.
CMS DATA MODEL CHANGES (Payload)

Add these to the existing collections:

Posts

sites: multi-select (com, uk), required. Controls where the post appears.
primarySite: select (com | uk), required. The "home" edition of the article. It is used for canonical URLs.
siteOverrides (optional group per site): custom title, excerpt, slug, featured image and SEO fields, so a shared story can be adapted for each edition.
region: select (global | us | uk | europe), used for filtering and the homepage "Regional" rail.
localizedNotes: optional editor note shown only on one edition.

Categories, Tags, Pages, Navigation, Homepage global, SiteSettings

Add a site field (or sites multi-select) so each site has its own navigation, footer, homepage picks, legal pages, ad settings and default SEO.
Legal pages must be site-specific: the UK site needs a UK GDPR / PECR / ICO-aware Privacy Policy and Cookie Policy, with its own registered business details. The .com site needs a US/EU-aware version. Use editable placeholder text that I fill in.

Authors: shared across both sites (one author profile can write for both).

Subscribers: add a site field so newsletter signups are tracked separately.

Access control: admins can see and edit everything. Add a clear site filter and badge in the admin list views so editors can instantly see which site a post belongs to. If feasible, evaluate @payloadcms/plugin-multi-tenant. Use it only if it fits cleanly with the above; otherwise implement the site / sites fields manually. Tell me which one you chose and why.

DUPLICATE-CONTENT AND SEO RULES (critical)

Google penalizes sites that publish the same content on two domains without clear signals. Implement these rules strictly:

Canonical URLs: if a post appears on both sites, the page on the non-primary site must use a <link rel="canonical"> pointing to the primarySite URL.
Edition-specific content first: the system and the editor UI should encourage unique stories per site. Add a warning in the admin when a post is set to both sites and no siteOverrides are filled in.
hreflang: add hreflang alternates (en-US, en-GB, x-default) only on pages that have a real counterpart on the other site. Never add hreflang to pages that exist on one site only.
Separate sitemaps per site: /sitemap.xml and /news-sitemap.xml must return only the current site's URLs, with the correct domain. Separate robots.txt per site, each pointing to its own sitemap.
Separate structured data: Organization, WebSite and NewsArticle JSON-LD must use the correct domain, name, locale and publisher for the current site.
Separate RSS feeds per site.
Open Graph: use the correct og:url, og:locale (en_US / en_GB) and og:site_name per site. Generated OG images must show the correct domain.
Search Console readiness: document in the README that each domain must be added as its own property, with the sitemap submitted separately. Set UK as the geo-target for .co.uk (a country-code domain is already geo-targeted).
Redirect safety: never redirect one domain's pages to the other automatically, except for www to non-www and the optional fallback described below.
EDITION DIFFERENCES (what makes each site unique)

futurelens.com (Global / US edition)

US English spelling (color, center, program), USD, US date format (MM/DD/YYYY or "Nov 15, 2026").
Focus on US and global tech and science, with a "Europe Watch" section.
Default sponsor/ad configuration for the US market.

futurelens.co.uk (UK & Europe edition)

British English spelling (colour, centre, programme), GBP, UK date format (DD/MM/YYYY or "15 Nov 2026"), 24-hour time, Europe/London timezone.
Homepage includes a "UK & Europe" hero rail (UK tech policy, EU regulation, ESA, CERN, UK science news).
Footer shows UK-specific legal entity details (editable) and UK compliance links.
A small header indicator shows the edition, with a "Switch edition" link (UK / Global) that takes the reader to the equivalent page if it exists, or to the other homepage if not.

Build a formatDate, formatCurrency and getSpelling helper that read the locale from the current site config. Do not hard-code locale anywhere else.

ROUTING AND FALLBACK BEHAVIOUR
A post that is not assigned to the current site must return a proper 404 on that site.
If a post exists on the other site only, the 404 page for the current site may show a gentle "This story is available on our UK/Global edition" link. It must not be auto-redirected.
Category, tag, author, search and RSS routes must all be site-aware.
Cache keys, ISR tags and revalidateTag calls must include the site key so publishing on one site does not purge or mix up the other. When a post is published or updated in Payload, revalidate only the sites it belongs to.
BRANDING AND DESIGN
Both sites share the same design system and components from the base project, so there is no duplicated UI code.
Allow small per-site theme differences driven by lib/sites.ts (for example a slightly different accent gradient, a different hero layout emphasis, or edition badge colour), via CSS variables.
The logo stays the same, with an optional small edition tag (for example "FutureLens UK") shown in the header on the .co.uk site.
Favicons, manifest.ts, apple-icon, opengraph-image and twitter-image must read the site config so each domain shows its own name and domain in generated images.
COMPLIANCE (per site)
UK site: UK GDPR and PECR-compliant cookie consent. Analytics and ad scripts load only after consent. Link to an ICO-aware Privacy Policy.
Global site: GDPR/ePrivacy-compliant banner for EU/UK visitors, and a placeholder for US state privacy notices (e.g. CCPA/CPRA "Do Not Sell or Share" link).
Consent choices are stored per domain (cookies are naturally per domain). The banner text and policy links come from each site's own settings.
Analytics: separate property or site ID per domain (Plausible or GA4), configured through environment variables.
ENVIRONMENT AND DEPLOYMENT
One .env.example with all variables, clearly grouped: DATABASE_URL, PAYLOAD_SECRET, BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_COM_URL=https://futurelens.com, NEXT_PUBLIC_UK_URL=https://futurelens.co.uk, analytics IDs per site, email provider keys.
README section "Deploying two domains on Vercel": add both domains (and www variants) to the same Vercel project, DNS records to set at the registrar, SSL, how to set the primary domain, and how to test each domain on preview deployments.
Include a "Testing both editions locally" section.
TESTING AND ACCEPTANCE CHECKLIST

Before you finish, verify and report on each item:

Visiting localhost:3000 shows the .com edition, and ?site=uk shows the UK edition.
A post tagged com only is 404 on the UK site, and vice versa.
A shared post shows a correct canonical pointing to its primary site and correct hreflang on both.
/sitemap.xml, /news-sitemap.xml, /rss.xml and /robots.txt differ correctly per site.
UK site shows British spelling in UI strings, GBP, UK date format and the Europe/London timezone.
JSON-LD and OG tags contain the correct domain and locale for each site.
Publishing a post in Payload revalidates only the sites it is assigned to.
Each site has its own navigation, footer, homepage picks and legal pages.
Lighthouse 95+ on both sites for Performance, Accessibility, Best Practices and SEO.
No content, cache or settings leak between the two sites.
SEED DATA

Extend the seed script to add:

8 posts for com only, 8 posts for uk only, and 4 shared posts (with overrides on two of them).
Separate navigation, homepage picks, footer and legal page placeholders for each site.
WORKING INSTRUCTIONS
First, show a short plan: files you will change or add, and the order of work.
Build in phases: (1) lib/sites.ts and middleware, (2) CMS fields and access control, (3) site-aware queries and caching, (4) per-site layout, theme and helpers, (5) SEO (canonical, hreflang, sitemaps, RSS, JSON-LD, OG), (6) compliance and consent, (7) seed data, (8) README and the acceptance checklist.
After each phase, run the build and fix all errors before moving on.
Do not copy or duplicate components for the second site. Reuse and parametrize.
At the end, give me: what changed, how to run both editions locally, the DNS and Vercel steps, and any decision that needs my input.

Start now with the plan.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9407fc9c-f58d-58e8-9f9a-d8659b89a44e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
