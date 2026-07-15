/**
 * Single source of truth for the khaos-id login redirect.
 *
 * Both gates use this — middleware (edge) and page-level guards (node).
 * Keep this module pure: no next/headers, no next/server, so it bundles
 * anywhere and unit-tests without mocks.
 *
 * `origin` must come from the live request (request.nextUrl.origin in
 * middleware, forwarded headers in server components) — NEVER from a
 * static env var, or preview deploys round-trip users to production.
 */
export function buildLoginRedirect(nextPath: string, origin: string): string {
  const callbackUrl = new URL('/api/auth/callback', origin);
  callbackUrl.searchParams.set('next', nextPath);

  const loginUrl = new URL(
    process.env.KHAOS_ID_LOGIN_URL ?? 'https://khaos-id.vercel.app/login'
  );
  loginUrl.searchParams.set('redirect_to', callbackUrl.toString());
  return loginUrl.toString();
}
