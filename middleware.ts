import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userSession = request.cookies.get('user_session');
  const { pathname } = request.nextUrl;

  // 1. Jika mencoba akses area /admin tapi BELUM login -> Tendang ke /login
  if (pathname.startsWith('/admin') && !userSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Jika mencoba akses /login tapi SUDAH login -> Dilempar langsung ke /admin
  if (pathname === '/login' && userSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Proteksi jalur URL ini
export const config = {
  matcher: ['/admin/:path*', '/login'],
};