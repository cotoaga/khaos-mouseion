import { createRemoteJWKSet, jwtVerify, errors as joseErrors, type JWTPayload } from "jose";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJWKS() {
  if (!jwks) jwks = createRemoteJWKSet(new URL(process.env.SUPABASE_JWKS_URL!));
  return jwks;
}

// Supabase mints tokens with iss = https://<project>.supabase.co/auth/v1 —
// derive it from the JWKS URL so siblings repoint one env var, not two.
function getExpectedIssuer(): string {
  return process.env.SUPABASE_JWKS_URL!.replace(/\/\.well-known\/jwks\.json$/, "");
}

export async function getVerifiedClaims(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session.access_token, getJWKS(), {
      audience: "authenticated",
      issuer: getExpectedIssuer(),
    });
    return payload;
  } catch (err) {
    // Contract (khaos-id seam — siblings copy this):
    // • Expired token → routine, quiet null; caller redirects to login.
    // • Any other failure (signature, issuer, audience, JWKS) → attack
    //   indicator or misconfig: log loudly, still return null. Users never
    //   500; the log drain carries the alarm.
    if (!(err instanceof joseErrors.JWTExpired)) {
      console.error(
        "[khaos-id] JWT verification failed — possible tampered token:",
        err instanceof Error ? `${err.name}: ${err.message}` : err,
      );
    }
    return null;
  }
}
