import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

const LOCALE_COOKIE = "locale";

/**
 * Every page lives under /{locale}. Anything arriving without one is sent to
 * the visitor's best match: a previous explicit choice first, then the browser's
 * Accept-Language, then English.
 */
function pickLocale(req: NextRequest): string {
  const chosen = req.cookies.get(LOCALE_COOKIE)?.value;
  if (chosen && isLocale(chosen)) return chosen;

  const header = req.headers.get("accept-language") ?? "";
  // "sw-KE,sw;q=0.9,en;q=0.8" → ["sw-ke", "sw", "en"] in preference order.
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: (tag ?? "").toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    const base = tag.split("-")[0];
    if (base && isLocale(base)) return base;
  }
  return defaultLocale;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const current = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (current) {
    // Remember the language they are actually reading, so the next visit to a
    // bare URL lands in it. Written here rather than in the client so the
    // switcher can stay plain links.
    const res = NextResponse.next();
    if (req.cookies.get(LOCALE_COOKIE)?.value !== current) {
      res.cookies.set(LOCALE_COOKIE, current, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return res;
  }

  const locale = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, the metadata routes served from the app root, and
  // anything with a file extension.
  matcher: [
    "/((?!_next|api|healthz|icon.svg|manifest.webmanifest|opengraph-image|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
