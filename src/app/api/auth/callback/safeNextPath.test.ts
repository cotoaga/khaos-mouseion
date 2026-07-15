import { describe, it, expect } from "vitest";
import { safeNextPath } from "./route";

const ORIGIN = "https://khaos-mouseion.cotoaga.ai";

describe("safeNextPath — open-redirect guard on /api/auth/callback", () => {
  it("passes through clean same-origin paths", () => {
    expect(safeNextPath("/pinakes", ORIGIN)).toBe("/pinakes");
    expect(safeNextPath("/collection/42?tab=notes#top", ORIGIN)).toBe(
      "/collection/42?tab=notes#top"
    );
  });

  it("defaults to / when next is missing or empty", () => {
    expect(safeNextPath(null, ORIGIN)).toBe("/");
    expect(safeNextPath("", ORIGIN)).toBe("/");
  });

  it("rejects protocol-relative redirects (//evil.com)", () => {
    expect(safeNextPath("//evil.com", ORIGIN)).toBe("/");
    expect(safeNextPath("//evil.com/phish", ORIGIN)).toBe("/");
  });

  it("rejects userinfo tricks (@evil.com)", () => {
    // Raw concat would have produced https://site.com@evil.com —
    // browser treats the real host as userinfo and ships the user to evil.com.
    expect(safeNextPath("@evil.com", ORIGIN)).not.toContain("evil.com@");
    expect(new URL(safeNextPath("@evil.com", ORIGIN), ORIGIN).origin).toBe(ORIGIN);
  });

  it("rejects backslash normalization vectors (/\\evil.com)", () => {
    // WHATWG URL turns backslash into slash in special schemes,
    // so /\evil.com resolves as //evil.com — must fail origin check.
    expect(safeNextPath("/\\evil.com", ORIGIN)).toBe("/");
    expect(safeNextPath("\\\\evil.com", ORIGIN)).toBe("/");
  });

  it("rejects absolute cross-origin URLs", () => {
    expect(safeNextPath("https://evil.com/phish", ORIGIN)).toBe("/");
    expect(safeNextPath("http://khaos-mouseion.cotoaga.ai/", ORIGIN)).toBe("/"); // scheme downgrade
  });

  it("keeps same-origin absolute URLs (path extracted)", () => {
    expect(safeNextPath(`${ORIGIN}/whoami`, ORIGIN)).toBe("/whoami");
  });

  it("never returns a value that escapes the origin (property sweep)", () => {
    const hostileInputs = [
      "//evil.com",
      "///evil.com",
      "////evil.com",
      "@evil.com",
      "/@evil.com/..",
      "\\/evil.com",
      "/\\/evil.com",
      "https:evil.com",
      "javascript:alert(1)",
      "  //evil.com",
      "%2F%2Fevil.com",
    ];
    for (const input of hostileInputs) {
      const result = safeNextPath(input, ORIGIN);
      const resolved = new URL(result, ORIGIN);
      expect(resolved.origin, `input: ${JSON.stringify(input)}`).toBe(ORIGIN);
      expect(resolved.protocol).toBe("https:");
    }
  });
});
