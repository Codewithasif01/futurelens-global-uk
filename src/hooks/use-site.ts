import { useRouteContext } from "@tanstack/react-router";
import { getSite, type SiteConfig, type SiteKey } from "@/lib/sites";

export function useSiteKey(): SiteKey {
  return useRouteContext({ from: "__root__", select: (c) => c.siteKey });
}

export function useSite(): SiteConfig {
  return getSite(useSiteKey());
}

export function useIsProductionHost(): boolean {
  return useRouteContext({ from: "__root__", select: (c) => c.production });
}
