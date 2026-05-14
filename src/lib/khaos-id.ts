import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const JWKS = createRemoteJWKSet(new URL(process.env.SUPABASE_JWKS_URL!));

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
  const { payload } = await jwtVerify(session.access_token, JWKS, {
    audience: "authenticated",
  });
  return payload;
}
