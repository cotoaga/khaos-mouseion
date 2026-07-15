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
      {
        audience: "authenticated",
        issuer: "https://uwgykeijsejiitwmvzrl.supabase.co/auth/v1",
      },
    );
  });

  it("returns null quietly for an expired token (routine, not an incident)", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: "expired.token.value" } },
    });
    const { errors } = await vi.importActual<typeof import("jose")>("jose");
    mockJwtVerify.mockRejectedValue(
      new errors.JWTExpired("token expired", { exp: 1 } as never),
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getVerifiedClaims } = await import("./khaos-id");
    await expect(getVerifiedClaims()).resolves.toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("returns null but logs loudly on tampered tokens (signature mismatch)", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: "tampered.token.value" } },
    });
    mockJwtVerify.mockRejectedValue(new Error("signature mismatch"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getVerifiedClaims } = await import("./khaos-id");
    // Contract: callers must never 500 off the auth seam — tamper is an
    // ops signal (log drain), not a user-facing exception.
    await expect(getVerifiedClaims()).resolves.toBeNull();
    expect(consoleError).toHaveBeenCalledOnce();
    expect(consoleError.mock.calls[0][0]).toContain("[khaos-id]");
  });
});
