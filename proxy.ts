import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Define paths that do not require authentication
  // Note: /api/auth/refresh is included here to prevent recursive loops if the refresh logic was internal,
  // but since we handle refresh here in the proxy, it shouldn't be strictly necessary to exclude it from *checking*, 
  // but we can exclude it from the *mandatory login redirect* logic.
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/api/auth/check'];

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // Public paths - allow access but redirect if already logged in
  if (publicPaths.some(path => pathname.startsWith(path))) {
    // If user is already logged in and tries to access login/register, redirect to landing page
    if (accessToken && (pathname === '/login' || pathname === '/register')) {
      try {
        await jwtVerify(accessToken, ACCESS_SECRET);
        // Redirect to landing page
        return NextResponse.redirect(new URL('/', req.url));
      } catch {
        // Token invalid, let them stay on login page
      }
    }
    return NextResponse.next();
  }

  // Check for Access Token
  if (!accessToken) {
    // If no access token, but we have a refresh token, try to refresh
    if (refreshToken) {
        return await tryRefresh(req, refreshToken, pathname);
    }
    // Redirect to login
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, req.url));
  }

  try {
    const { payload } = await jwtVerify(accessToken, ACCESS_SECRET);

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
    // Try to refresh using Refresh Token
    if (refreshToken) {
        return await tryRefresh(req, refreshToken, pathname);
    }
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, req.url));
  }
}

async function tryRefresh(request: NextRequest, refreshToken: string, pathname: string) {
    try {
      const { payload } = await jwtVerify(refreshToken, REFRESH_SECRET);
      
      const newPayload = {
        userId: payload.userId,
        role: payload.role,
      };
  
      const newAccessToken = await new SignJWT(newPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m')
        .sign(ACCESS_SECRET);
  
      const newRefreshToken = await new SignJWT(newPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(REFRESH_SECRET);
  
      // Update cookies for Server Components (Request Headers)
      const newCookies = new Map();
      request.cookies.getAll().forEach(c => newCookies.set(c.name, c.value));
      newCookies.set('accessToken', newAccessToken);
      newCookies.set('refreshToken', newRefreshToken);
      
      const cookieString = Array.from(newCookies.entries())
          .map(([key, val]) => `${key}=${val}`)
          .join('; ');
  
      const newHeaders = new Headers(request.headers);
      newHeaders.set('cookie', cookieString);
      // We also set the user headers here so the *current* request proceeds with identity
      newHeaders.set('X-User-Id', payload.userId as string);
      newHeaders.set('X-User-Role', payload.role as string);
  
      const nextResponse = NextResponse.next({
          request: {
              headers: newHeaders,
          }
      });
  
      // Update cookies for Browser (Response Headers)
      nextResponse.cookies.set({
        name: 'accessToken',
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60,
        path: '/',
      });
  
      nextResponse.cookies.set({
          name: 'refreshToken',
          value: newRefreshToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
  
      return nextResponse;
  
    } catch {
      // Refresh token invalid? Redirect to login
      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url));
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
