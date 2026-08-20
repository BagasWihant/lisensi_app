import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/admin/dashboard');
  
  if (isProtectedRoute) {
    const cookie = req.cookies.get('session')?.value;
    try {
      if (cookie) {
        const payload = await decrypt(cookie);
        if (payload?.user) {
          return NextResponse.next();
        }
      }
    } catch (error) {
      // Invalid token
    }
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }
  
  // Protect admin login route if already authenticated
  if (path === '/admin/login') {
    const cookie = req.cookies.get('session')?.value;
    try {
      if (cookie) {
        const payload = await decrypt(cookie);
        if (payload?.user) {
           return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
        }
      }
    } catch (error) {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
