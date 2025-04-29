import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create an unmodified Supabase client for server-side operations
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request headers.
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Set the cookie on the response
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request headers.
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Set the cookie on the response to remove it
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - important for Server Components
  // await supabase.auth.getUser(); // Deprecated: Use getSession instead
  const { data: { session } } = await supabase.auth.getSession();

  // Define protected routes
  const protectedPaths = ["/dashboard", "/api/contacts", "/api/channels"];
  const isProtectedRoute = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Define auth routes (login, register)
  const authPaths = ["/login", "/register"];
  const isAuthRoute = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // If accessing a protected route and no session exists, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If accessing an auth route and a session exists, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing root path and session exists, redirect to dashboard
  if (request.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing root path and no session exists, allow access (shows landing page)
  if (request.nextUrl.pathname === '/' && !session) {
    return response;
  }

  // Allow the request to proceed for all other cases (e.g., public API routes, static assets)
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // Explicitly include API routes and dashboard if needed, though the above should cover them
    // "/dashboard/:path*",
    // "/api/:path*",
  ],
};

