import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define paths that do not require authentication
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/api/auth/logout', '/api/auth/check'];

  // Handle root path - redirect based on authentication
  if (pathname === '/') {
    const token = req.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const { payload } = await jwtVerify(token, ACCESS_SECRET);
      // Redirect based on role
      if (payload.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/my-library', req.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Public paths - allow access but redirect if already logged in
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // If user is already logged in and tries to access login/register, verify and redirect
    const token = req.cookies.get('accessToken')?.value;
    if (token && (pathname === '/login' || pathname === '/register')) {
      try {
        const { payload } = await jwtVerify(token, ACCESS_SECRET);
        // Redirect based on role
        if (payload.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        } else {
          return NextResponse.redirect(new URL('/my-library', req.url));
        }
      } catch {
        // Token invalid, let them stay on login page
      }
    }
    return NextResponse.next();
  }

  // Check for Access Token
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    // If we have a refresh token, we technically could refresh, but client-side logic is preferred for that.
    // For middleware protection, if no access token, we assume unauthenticated for the requested resource.
    // Redirect to login.
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, req.url));
  }

  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);

    // Admin Route Protection
    if (pathname.startsWith('/admin')) {
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/my-library', req.url));
      }
    }

    // Attach user info to headers for easier access in generic server components if needed (optional)
    const response = NextResponse.next();
    response.headers.set('X-User-Id', payload.userId as string);
    response.headers.set('X-User-Role', payload.role as string);
    return response;

  } catch {
    // Access token expired or invalid
    // Ideally we would check for refresh token here, but verifying refresh token might require DB check which is not allowed in Edge middleware easily,
    // or requires a separate secret. Assuming strictly stateless middleware for now, redirection is safer.
    // The client app should handle token refresh proactively.
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder content
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)).*)',
  ],
};
