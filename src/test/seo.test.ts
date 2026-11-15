import { describe, expect, it } from "vitest";
import { buildHead, postLinks } from "@/lib/seo";
import { postCacheTags, sitesToRevalidate } from "@/lib/cache";

const shared = {
  slug: "eu-sovereign-cloud",
  primary_site: "uk" as const,
  primary_slug: "eu-sovereign-cloud",
  counterpart_site: "com" as const,
  counterpart_slug: "europe-sovereign-cloud-us-providers",
};

describe("canonical and hreflang", () => {
  it("points the non-primary edition's canonical at the primary edition", () => {
    const onCom = postLinks(
      { ...shared, slug: "europe-sovereign-cloud-us-providers", counterpart_site: "uk", counterpart_slug: "eu-sovereign-cloud" },
      "com",
    );
    expect(onCom.canonical).toBe("https://futurelens.co.uk/news/eu-sovereign-cloud");
    expect(onCom.selfUrl).toBe("https://futurelens.com/news/europe-sovereign-cloud-us-providers");
  });
  it("keeps the primary edition self-canonical", () => {
    expect(postLinks(shared, "uk").canonical).toBe("https://futurelens.co.uk/news/eu-sovereign-cloud");
  });
  it("adds en-US, en-GB and x-default for shared stories, using each edition's slug", () => {
    const alt = postLinks(shared, "uk").alternates;
    expect(alt).toEqual([
      { hreflang: "en-US", href: "https://futurelens.com/news/europe-sovereign-cloud-us-providers" },
      { hreflang: "en-GB", href: "https://futurelens.co.uk/news/eu-sovereign-cloud" },
      { hreflang: "x-default", href: "https://futurelens.com/news/europe-sovereign-cloud-us-providers" },
    ]);
  });
  it("adds no hreflang for single-edition stories", () => {
    const only = postLinks(
      { slug: "nhs-ai-triage-trial", primary_site: "uk", primary_slug: "nhs-ai-triage-trial", counterpart_site: null, counterpart_slug: null },
      "uk",
    );
    expect(only.alternates).toEqual([]);
  });
  it("uses the edition's own domain, locale and site name in OG tags", () => {
    const head = buildHead({ site: "uk", title: "t", description: "d", path: "/news/x" });
    const get = (p: string) => head.meta.find((m) => m.property === p)?.content;
    expect(get("og:url")).toBe("https://futurelens.co.uk/news/x");
    expect(get("og:locale")).toBe("en_GB");
    expect(get("og:site_name")).toBe("FutureLens UK");
    expect(get("og:image")).toBe("https://futurelens.co.uk/og/uk.jpg");
  });
});

describe("per-edition revalidation", () => {
  it("revalidates only the editions a post is on", () => {
    expect(sitesToRevalidate(null, ["uk"])).toEqual(["uk"]);
    expect(sitesToRevalidate(["com"], ["com"])).toEqual(["com"]);
  });
  it("revalidates an edition the post was removed from", () => {
    expect(sitesToRevalidate(["com", "uk"], ["uk"])).toEqual(["com", "uk"]);
  });
  it("tags cache entries with the site key", () => {
    expect(postCacheTags("p1", ["uk"])).toEqual(["site:uk", "site:uk:post:p1"]);
  });
});
