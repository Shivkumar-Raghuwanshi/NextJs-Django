import authService from './lib/authService';
import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose'
export default async function middleware(req: NextRequest) {
  const isAuthenticated = authService.isAuthenticated(req);
  const protectedRoute = '/dashboard';
  const requestedPath = req.nextUrl.pathname;
  // console.log('Requested Path:', requestedPath);
  // console.log('Is Authenticated:', isAuthenticated);

  // If the user is authenticated and not on the /dashboard route, redirect to /dashboard
  if (isAuthenticated && requestedPath !== protectedRoute) {
    // console.log('Redirecting to /dashboard');
    const url = req.nextUrl.clone();
    url.pathname = protectedRoute;
    return NextResponse.redirect(url);
  }

  // If the user is not authenticated and trying to access the /dashboard route, redirect to the login page
  if (requestedPath === protectedRoute && !isAuthenticated) {
    // console.log('Redirecting to login page');
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // If the user is authenticated and trying to access the /dashboard route, verify and decode the token
  if (requestedPath === protectedRoute && isAuthenticated) {
    const token = authService.getAccessToken(req);
    if (!token) {
      // console.log('No access token found, redirecting to login page');
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    try {
      const secretKey = process.env.JWT_SECRET; // replace this with your actual secret key
      const uint8ArrayKey = new TextEncoder().encode(secretKey);
      const { payload, protectedHeader } = await jwtVerify(token, uint8ArrayKey)
      const request = new NextRequest(req.clone(), {
        headers: {
          'x-decoded-token': JSON.stringify(payload),
        },
      });
      req = request;
    } catch (error) {
      console.error('Error verifying token:', error);
      // console.log('Redirecting to login page due to token verification failure');
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // If the user is authenticated or the request is not for the /dashboard route, allow the request to proceed
  // console.log('Allowing the request to proceed');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard:path*'],
};
