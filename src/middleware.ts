import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const alwaysPublicRoutes = ['/', '/api/auth/callback', '/pinakes', '/cyril', '/collection', '/whoami'];

  const isAlwaysPublic = alwaysPublicRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );

  // Static assets are excluded by the matcher below — no dot-based bypass here.
  // `pathname.includes('.')` would let any gated route containing a dot
  // (/vault/report.pdf, /admin/v1.2/) skip auth entirely.
  if (isAlwaysPublic || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const callbackUrl = new URL('/api/auth/callback', request.nextUrl.origin);
    callbackUrl.searchParams.set('next', pathname);
    const loginUrl = new URL(
      process.env.KHAOS_ID_LOGIN_URL ?? 'https://khaos-id.vercel.app/login'
    );
    loginUrl.searchParams.set('redirect_to', callbackUrl.toString());
    return NextResponse.redirect(loginUrl.toString());
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
