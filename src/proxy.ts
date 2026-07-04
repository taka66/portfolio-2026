import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Negotiator from "negotiator";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import { i18n } from "@/i18n/config";

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as (typeof i18n.locales)[number])) {
    return cookieLocale;
  }

  try {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => (headers[key] = value));

    const acceptLanguage = headers["accept-language"];
    if (!acceptLanguage || acceptLanguage === "*") return i18n.defaultLocale;

    const languages = new Negotiator({ headers }).languages();
    if (!languages || languages.length === 0) return i18n.defaultLocale;

    return matchLocale(languages, i18n.locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // The default locale is served without a prefix ("/works"), so a prefixed
  // URL like "/ja/works" is duplicate content — redirect to the canonical URL.
  if (pathname === `/${i18n.defaultLocale}` || pathname.startsWith(`/${i18n.defaultLocale}/`)) {
    const canonicalPathname = pathname.slice(i18n.defaultLocale.length + 1) || "/";
    return NextResponse.redirect(new URL(canonicalPathname, request.url), 308);
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    // "/" must map to "/en", not "/en/"
    const localizedPathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

    if (locale === i18n.defaultLocale) {
      return NextResponse.rewrite(new URL(localizedPathname, request.url));
    }
    return NextResponse.redirect(new URL(localizedPathname, request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|sitemap.xml|robots.txt|favicon.ico|.*\\.webp|.*\\.png|.*\\.jpg).*)"],
};
