import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatTime, getSpelling } from "@/lib/i18n";

const noonUtc = "2026-11-15T12:00:00Z";

describe("edition locale helpers", () => {
  it("formats US dates as Nov 15, 2026 and MM/DD/YYYY", () => {
    expect(formatDate(noonUtc, "com")).toBe("Nov 15, 2026");
    expect(formatDate(noonUtc, "com", "short")).toBe("11/15/2026");
  });
  it("formats UK dates as 15 Nov 2026 and DD/MM/YYYY", () => {
    expect(formatDate(noonUtc, "uk")).toBe("15 Nov 2026");
    expect(formatDate(noonUtc, "uk", "short")).toBe("15/11/2026");
  });
  it("uses 24-hour Europe/London time on UK", () => {
    expect(formatTime("2026-11-15T15:30:00Z", "uk")).toMatch(/^15:30 GMT$/);
    expect(formatTime("2026-07-15T15:30:00Z", "uk")).toMatch(/^16:30 BST$/);
  });
  it("uses 12-hour time on com", () => {
    expect(formatTime("2026-11-15T15:30:00Z", "com")).toMatch(/10:30\s?AM/);
  });
  it("formats USD on com and GBP on uk", () => {
    expect(formatCurrency(12, "com")).toBe("$12");
    expect(formatCurrency(12, "uk")).toBe("£12");
    expect(formatCurrency(4.5, "uk")).toBe("£4.50");
  });
  it("spells UI strings per edition", () => {
    expect(getSpelling("color", "com")).toBe("color");
    expect(getSpelling("color", "uk")).toBe("colour");
    expect(getSpelling("center", "uk")).toBe("centre");
    expect(getSpelling("program", "uk")).toBe("programme");
    expect(getSpelling("program", "com")).toBe("program");
  });
});
