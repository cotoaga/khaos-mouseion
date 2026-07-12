import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildLoginRedirect } from "./login-redirect";

describe("buildLoginRedirect — single source for the khaos-id login hop", () => {
  beforeEach(() => {
    vi.stubEnv("KHAOS_ID_LOGIN_URL", "https://khaos-id.vercel.app/login");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds redirect_to from the caller-supplied origin", () => {
    const url = new URL(
      buildLoginRedirect("/whoami", "https://khaos-mouseion.cotoaga.ai")
    );
    expect(url.origin + url.pathname).toBe("https://khaos-id.vercel.app/login");
    expect(url.searchParams.get("redirect_to")).toBe(
      "https://khaos-mouseion.cotoaga.ai/api/auth/callback?next=%2Fwhoami"
    );
  });

  it("preserves preview origins — never rewrites to production", () => {
    const preview = "https://khaos-mouseion-git-cot52.vercel.app";
    const url = new URL(buildLoginRedirect("/whoami", preview));
    const redirectTo = new URL(url.searchParams.get("redirect_to")!);
    expect(redirectTo.origin).toBe(preview);
  });

  it("falls back to the canonical khaos-id login when env is unset", () => {
    vi.stubEnv("KHAOS_ID_LOGIN_URL", "");
    // empty string is falsy for ?? only when undefined — stub deletes semantics:
    vi.unstubAllEnvs();
    delete process.env.KHAOS_ID_LOGIN_URL;
    const url = new URL(buildLoginRedirect("/x", "https://example.com"));
    expect(url.hostname).toBe("khaos-id.vercel.app");
  });
});
