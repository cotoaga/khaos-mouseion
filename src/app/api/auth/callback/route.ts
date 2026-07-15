import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Resolve `next` against our own origin and reject anything that escapes it.
 * Covers `//evil.com` (protocol-relative), `@` userinfo tricks, and `\`
 * (WHATWG URL normalizes backslash to slash in special schemes, so
 * `/\evil.com` becomes `//evil.com` and fails the origin check).
 * Exported for tests — this is the reference guard siblings copy.
 */
export function safeNextPath(raw: string | null, origin: string): string {
  if (!raw) return '/';
  try {
    const resolved = new URL(raw, origin);
    if (resolved.origin !== origin) return '/';
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return '/';
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'), origin);
  const errorParam = searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(errorParam)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=missing_code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
