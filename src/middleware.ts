import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { ADMIN_PREFIX, PROTECTED_PREFIXES } from '@/constants/routes';

const PUBLIC_FILE = /\.(.*)$/;

function detectLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const header = request.headers.get('accept-language') ?? '';
  const preferred = header
    .split(',')
    .map((part) => part.split(';')[0]?.trim().slice(0, 2).toLowerCase())
    .find((code) => isLocale(code));

  return preferred ?? defaultLocale;
}

async function readSession(request: NextRequest) {
  const cookieName = process.env.AUTH_COOKIE_NAME ?? 'fa_session';
  const token = request.cookies.get(cookieName)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: 'francais-academy',
    });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // 1. Prefixe de langue obligatoire.
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  if (!isLocale(maybeLocale)) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 31_536_000 });
    return response;
  }

  // 2. Garde d'authentification et de role.
  const withoutLocale = `/${segments.slice(2).join('/')}`;
  const needsAuth = PROTECTED_PREFIXES.some((prefix) => withoutLocale.startsWith(prefix));

  if (needsAuth) {
    const session = await readSession(request);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${maybeLocale}/login`;
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
    if (withoutLocale.startsWith(ADMIN_PREFIX) && session.role !== 'ADMIN') {
      const url = request.nextUrl.clone();
      url.pathname = `/${maybeLocale}/dashboard`;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', maybeLocale, { path: '/', maxAge: 31_536_000 });
  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
