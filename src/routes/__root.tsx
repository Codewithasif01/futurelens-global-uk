import { QueryClient, QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getSiteContext } from "@/lib/site-context";
import { getSite } from "@/lib/sites";
import { chromeQuery } from "@/lib/queries";
import { organizationLd, websiteLd } from "@/lib/seo";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ConsentBanner } from "@/components/site/ConsentBanner";
import { Analytics } from "@/components/site/Analytics";
import { Toaster } from "@/components/ui/sonner";
import { useSiteKey } from "@/hooks/use-site";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..700&family=Instrument+Sans:wght@400..600&family=JetBrains+Mono:wght@500;600&display=swap";

function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="kicker">Error 404</p>
      <h1 className="mt-3 text-5xl font-semibold">We couldn't find that page</h1>
      <p className="mt-4 text-muted-foreground">It may have moved, or it may never have existed on this edition.</p>
      <Link to="/" className="mt-8 inline-block border border-ink px-5 py-2 font-medium hover:bg-ink hover:text-paper">
        Back to the front page
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-sm border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: () => getSiteContext(),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(chromeQuery(context.siteKey));
    return { siteKey: context.siteKey };
  },
  head: ({ loaderData }) => {
    const key = loaderData?.siteKey ?? "com";
    const site = getSite(key);
    // Sitewide defaults only. Every content route sets its own title, description,
    // canonical and share image. Never put og:image or canonical here.
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: site.name },
        { name: "description", content: site.description },
        { name: "theme-color", content: key === "uk" ? "#1a1f36" : "#141a33" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: site.name },
        { property: "og:locale", content: site.ogLocale },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: site.social.x },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "stylesheet", href: FONTS },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/svg+xml", href: `/icons/icon-${key}.svg` },
        { rel: "icon", type: "image/png", sizes: "32x32", href: `/icons/favicon-${key}.png` },
        { rel: "apple-touch-icon", href: `/icons/apple-${key}.png` },
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "alternate", type: "application/rss+xml", title: `${site.name} RSS`, href: "/rss.xml" },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(organizationLd(key)) },
        { type: "application/ld+json", children: JSON.stringify(websiteLd(key)) },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { siteKey } = Route.useRouteContext();
  const site = getSite(siteKey ?? "com");
  return (
    <html lang={site.locale} data-site={site.key}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PublicChrome({ children }: { children: ReactNode }) {
  const siteKey = useSiteKey();
  const { data } = useSuspenseQuery(chromeQuery(siteKey));
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <SiteHeader nav={data.header} />
      <main id="main">{children}</main>
      <SiteFooter footer={data.footer} legal={data.legal} settings={data.settings} />
      <ConsentBanner settings={data.settings} />
      <Analytics />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        <Outlet />
      ) : (
        <PublicChrome>
          <Outlet />
        </PublicChrome>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
