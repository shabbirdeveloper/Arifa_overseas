import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from '@/lib/supabase/env';

/**
 * Refreshes the Supabase session cookie on every /admin request and bounces
 * signed-out visitors to the login page.
 *
 * This is a convenience, NOT the security boundary: middleware can be bypassed
 * in some deployment topologies, so the admin layout re-checks the session
 * server-side and the database enforces admin-only writes through RLS.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === '/admin/login';

  if (!isSupabaseConfigured) {
    // Nothing to protect against — send admins to a page that explains it.
    return isLoginRoute ? response : redirectTo(request, '/admin/login');
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // getUser() revalidates the token with Supabase; getSession() would trust
  // whatever the cookie claims.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginRoute) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Deliberately NOT redirecting a signed-in user away from /admin/login.
  //
  // Middleware cannot cheaply tell whether that user is an *admin*, so sending
  // them to /admin risks being sent straight back here — an infinite loop for
  // anyone signed in but not yet listed in admin_users. The login page detects
  // an existing session itself and offers a link instead of a redirect.
  return response;
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export const config = {
  // Only the admin area. The public site stays completely static.
  matcher: ['/admin/:path*'],
};
