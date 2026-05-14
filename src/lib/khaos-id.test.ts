import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockGetAll = vi.fn();
const mockGetSession = vi.fn();
const mockJwtVerify = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({ getAll: mockGetAll, set: vi.fn() }),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getSession: mockGetSession },
  }),
}));

vi.mock("jose", async () => {
  const actual = await vi.importActual<typeof import("jose")>("jose");
  return {
    ...actual,
    createRemoteJWKSet: () => "jwks-stub",
    jwtVerify: mockJwtVerify,
  };
});

describe("getVerifiedClaims", () => {
  beforeEach(() => {
    vi.resetModules();
    mockGetAll.mockReturnValue([]);
    mockGetSession.mockReset();
    mockJwtVerify.mockReset();
    process.env.SUPABASE_JWKS_URL =
      "https://uwgykeijsejiitwmvzrl.supabase.co/auth/v1/.well-known/jwks.json";
    process.env.NEXT_PUBLIC_SUPABASE_URL =
      "https://uwgykeijsejiitwmvzrl.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when there is no Supabase session", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { getVerifiedClaims } = await import("./khaos-id");
    const claims = await getVerifiedClaims();
    expect(claims).toBeNull();
    expect(mockJwtVerify).not.toHaveBeenCalled();
  });

  it("returns the verified JWT payload when a session exists", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: "eyJ.fake-access-token.fake-sig",
        },
      },
    });
    const payload = {
      sub: "00000000-0000-0000-0000-000000000001",
      email: "kurt@cotoaga.de",
      aud: "authenticated",
      iss: "https://uwgykeijsejiitwmvzrl.supabase.co/auth/v1",
      exp: 9999999999,
      iat: 1700000000,
      role: "authenticated",
    };
    mockJwtVerify.mockResolvedValue({
      payload,
      protectedHeader: { alg: "ES256", kid: "abc" },
    });
    const { getVerifiedClaims } = await import("./khaos-id");
    const claims = await getVerifiedClaims();
    expect(claims).toEqual(payload);
    expect(mockJwtVerify).toHaveBeenCalledWith(
      "eyJ.fake-access-token.fake-sig",
      "jwks-stub",
      { audience: "authenticated" },
    );
  });

  it("propagates verification errors so callers can detect tampered tokens", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: "tampered.token.value" } },
    });
    mockJwtVerify.mockRejectedValue(new Error("signature mismatch"));
    const { getVerifiedClaims } = await import("./khaos-id");
    await expect(getVerifiedClaims()).rejects.toThrow("signature mismatch");
  });
});
