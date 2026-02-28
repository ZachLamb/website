import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, getLocaleFromAcceptLanguage, isValidLocale } from '@/lib/i18n';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, _next, and static assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Request to root: detect locale and redirect to /{locale}
  if (pathname === '/') {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value ?? '';
    const locale = isValidLocale(cookieLocale)
      ? cookieLocale
      : getLocaleFromAcceptLanguage(request.headers.get('accept-language'));
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Request to /{locale}/...: validate first segment and pass locale to layout
  const segment = pathname.slice(1).split('/')[0];
  if (isValidLocale(segment)) {
    const res = NextResponse.next();
    res.headers.set('x-next-locale', segment);
    return res;
  }

  // Invalid locale: redirect to default
  return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.).*)'],
};
