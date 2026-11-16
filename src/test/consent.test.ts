import { describe, expect, it } from "vitest";
import { defaultConsent, requiresOptIn } from "@/lib/consent";

describe("consent rules", () => {
  it("always requires opt-in on the UK edition, even for US visitors", () => {
    expect(requiresOptIn("uk", "US")).toBe(true);
    expect(requiresOptIn("uk", "GB")).toBe(true);
  });
  it("requires opt-in on .com for EU/UK visitors and unknown countries", () => {
    expect(requiresOptIn("com", "DE")).toBe(true);
    expect(requiresOptIn("com", "GB")).toBe(true);
    expect(requiresOptIn("com", null)).toBe(true);
  });
  it("uses opt-out for US visitors on .com", () => {
    expect(requiresOptIn("com", "US")).toBe(false);
    expect(defaultConsent("com", "US", false)).toMatchObject({ analytics: true, ads: true });
  });
  it("honours Global Privacy Control by switching ads off", () => {
    expect(defaultConsent("com", "US", true)).toMatchObject({ ads: false });
  });
  it("sets nothing optional before opt-in", () => {
    expect(defaultConsent("uk", "GB", false)).toBeNull();
  });
});
