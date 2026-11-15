import { createServerOnlyFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { SiteKey } from "@/lib/sites";

/** Header the database uses (via request_site()) to scope every public read. */
export const SITE_DB_HEADER = "x-fl-site";

/**
 * Public, read-mostly database client pinned to ONE edition. Row security only
 * returns rows for the edition named in the x-fl-site header, so a query that
 * forgets its own site filter still cannot read the other edition.
 */
export const siteDb = createServerOnlyFn((site: SiteKey) => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY");
  const shim: typeof fetch = (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    headers.set(SITE_DB_HEADER, site);
    return fetch(input, { ...init, headers });
  };
  return createClient<Database>(url, key, {
    global: { fetch: shim, headers: { [SITE_DB_HEADER]: site } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
});
