# FutureLens two-edition roadmap

- [ ] 1. Site config (`src/lib/sites.ts`), host resolver, request middleware (www, /admin on UK, override cookie)
- [ ] 2. Database: tables, roles, site-header row security, per-site view, admin UI with site badges/filter + shared-post warning
- [ ] 3. Site-aware server reads, per-site query keys, per-site invalidation, 404 + other-edition hint
- [ ] 4. Layout, theme per site, header edition tag + switch, homepage rails, i18n helpers
- [ ] 5. SEO: canonical, hreflang, sitemap, news sitemap, RSS, robots, JSON-LD, OG, manifest/icons
- [ ] 6. Consent banner (UK GDPR/PECR, EU on .com, Do Not Sell), consent-gated analytics/ads
- [ ] 7. Seed data (8 com, 8 uk, 4 shared / 2 with overrides, nav, homepage, footer, legal)
- [ ] 8. README, .env.example, acceptance checks (browser + tests + Lighthouse)
