import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, getLocaleFromAcceptLanguage, isValidLocale } from '@/lib/i18n';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/snack/') && pathname.includes('.')) {
    return NextResponse.next();
  }

  if (pathname === '/snack' || pathname.startsWith('/snack/')) {
    const targetPath = pathname.replace(/^\/snack/, '/myspace');
    const target = new URL(`${targetPath}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(target, 308);
  }

  // Skip API routes, _next, static assets, and hidden pages
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') || // static files
    pathname === '/myspace' ||
    pathname.startsWith('/myspace/') // hidden pages — not a locale
  ) {
    return NextResponse.next();
  }

  // Request to root: detect locale and redirect to /{locale}
  // Priority: cookie (user choice) > Accept-Language (browser) > default (en)
  if (pathname === '/') {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value ?? '';
    const locale = isValidLocale(cookieLocale)
      ? cookieLocale
      : getLocaleFromAcceptLanguage(request.headers.get('accept-language')); // unsupported → en
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
