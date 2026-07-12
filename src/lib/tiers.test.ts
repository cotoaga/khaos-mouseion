import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTier, parseAllowlist } from "./tiers";
import type { JWTPayload } from "jose";

function claims(email?: unknown): JWTPayload {
  return { sub: "user-1", aud: "authenticated", ...(email !== undefined ? { email } : {}) } as JWTPayload;
}

describe("parseAllowlist", () => {
  it("splits, trims, lowercases, drops empties", () => {
    expect(parseAllowlist("  Kurt@Cotoaga.de , guest@x.io ,,")).toEqual([
      "kurt@cotoaga.de",
      "guest@x.io",
    ]);
  });
  it("handles undefined and empty", () => {
    expect(parseAllowlist(undefined)).toEqual([]);
    expect(parseAllowlist("")).toEqual([]);
  });
});

describe("getTier — authenticated is not invited", () => {
  beforeEach(() => {
    vi.stubEnv("KHAOS_OWNER_EMAILS", "kurt@cotoaga.de");
    vi.stubEnv("KHAOS_GUEST_EMAILS", "ford@betelgeuse.io, trillian@heartofgold.ship");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("null claims → visitor (anonymous)", () => {
    expect(getTier(null)).toBe("visitor");
  });

  it("owner email → owner, case-insensitively", () => {
    expect(getTier(claims("Kurt@Cotoaga.DE"))).toBe("owner");
  });

  it("guest email → guest", () => {
    expect(getTier(claims("trillian@heartofgold.ship"))).toBe("guest");
  });

  it("valid identity, no invitation → visitor (the core rule)", () => {
    expect(getTier(claims("zaphod@president.gov"))).toBe("visitor");
  });

  it("claims without a usable email → visitor", () => {
    expect(getTier(claims())).toBe("visitor");
    expect(getTier(claims(42))).toBe("visitor");
    expect(getTier(claims(""))).toBe("visitor");
  });

  it("owner beats guest when listed in both", () => {
    vi.stubEnv("KHAOS_GUEST_EMAILS", "kurt@cotoaga.de");
    expect(getTier(claims("kurt@cotoaga.de"))).toBe("owner");
  });

  it("empty env config → everyone authenticated is still a visitor", () => {
    vi.stubEnv("KHAOS_OWNER_EMAILS", "");
    vi.stubEnv("KHAOS_GUEST_EMAILS", "");
    expect(getTier(claims("kurt@cotoaga.de"))).toBe("visitor");
  });
});
