import { describe, expect, it } from "vitest";
import {
  isProductionHost,
  requestHost,
  resolveSiteKey,
  wwwRedirectHost,
} from "@/lib/site-resolver";

describe("resolveSiteKey", () => {
  it("maps futurelens.com and www to com", () => {
    expect(resolveSiteKey({ host: "futurelens.com" })).toBe("com");
    expect(resolveSiteKey({ host: "www.futurelens.com" })).toBe("com");
  });
  it("maps futurelens.co.uk and www to uk", () => {
    expect(resolveSiteKey({ host: "futurelens.co.uk" })).toBe("uk");
    expect(resolveSiteKey({ host: "WWW.FutureLens.co.uk:443" })).toBe("uk");
  });
  it("defaults localhost and previews to com", () => {
    expect(resolveSiteKey({ host: "localhost:3000" })).toBe("com");
    expect(resolveSiteKey({ host: "futurelens-git-main.vercel.app" })).toBe("com");
  });
  it("accepts ?site=uk, x-site and the cookie on non-production hosts", () => {
    expect(resolveSiteKey({ host: "localhost:3000", query: "uk" })).toBe("uk");
    expect(resolveSiteKey({ host: "localhost:3000", header: "uk" })).toBe("uk");
    expect(resolveSiteKey({ host: "localhost:3000", cookie: "uk" })).toBe("uk");
  });
  it("ignores overrides on production domains", () => {
    expect(resolveSiteKey({ host: "futurelens.com", query: "uk", header: "uk" })).toBe("com");
    expect(resolveSiteKey({ host: "futurelens.co.uk", query: "com", cookie: "com" })).toBe("uk");
  });
  it("maps local dev hosts", () => {
    expect(resolveSiteKey({ host: "futurelens.local:8080" })).toBe("com");
    expect(resolveSiteKey({ host: "uk.futurelens.local:8080" })).toBe("uk");
  });
  it("ignores unknown override values", () => {
    expect(resolveSiteKey({ host: "localhost", query: "fr" })).toBe("com");
  });
});

describe("host helpers", () => {
  it("redirects www to bare host only", () => {
    expect(wwwRedirectHost("www.futurelens.co.uk")).toBe("futurelens.co.uk");
    expect(wwwRedirectHost("futurelens.co.uk")).toBeNull();
  });
  it("knows production hosts", () => {
    expect(isProductionHost("futurelens.co.uk")).toBe(true);
    expect(isProductionHost("localhost")).toBe(false);
  });
  it("trusts x-forwarded-host only behind localhost", () => {
    expect(requestHost(new URL("http://localhost:8080/"), "evil.com")).toBe("evil.com");
    expect(requestHost(new URL("https://futurelens.com/"), "futurelens.co.uk")).toBe("futurelens.com");
  });
});
