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

  // First segment is not a recognized locale. Two cases:
  //
  //  (a) Locale-SHAPED string we don't support (e.g. `fr`, `pt-BR`, `en-US`).
  //      Treat as a locale attempt and substitute defaultLocale, dropping the
  //      bad first segment. `/fr/about` → `/en/about`.
  //
  //  (b) A regular path segment (e.g. `privacy`, `resume`, `foo/bar`). Prepend
  //      defaultLocale and keep the path. `/privacy` → `/en/privacy`.
  //
  // Heuristic for (a): exactly 2 a-z chars optionally followed by a BCP-47
  // region tag like `-US`, `-Hans`, etc. All six supported locales (en, es,
  // de, it, ja, zh) are 2-letter, so 3-letter first segments like `foo`,
  // `bar`, `api2` (none of which exist today) fall through to case (b) and
  // get prepended rather than stripped. Previously the proxy redirected to
  // bare `/${defaultLocale}` and silently dropped the rest of the path,
  // which broke any non-locale-prefixed deep link (proxy.test.ts pinned
  // the wrong behavior; that test is now updated).
  const looksLikeLocale = /^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(segment);
  const restOfPath = looksLikeLocale
    ? pathname.slice(segment.length + 1) // strip leading "/<segment>"
    : pathname;
  return NextResponse.redirect(new URL(`/${defaultLocale}${restOfPath}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.).*)'],
};
