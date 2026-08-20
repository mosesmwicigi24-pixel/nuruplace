"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, localeNames, localeTags, type Locale } from "@/i18n/config";

/**
 * Plain links rather than buttons: they work without JavaScript, they are
 * crawlable, and they keep the reader on the page they were already on.
 * The choice is remembered server-side — src/proxy.ts writes the cookie when
 * it sees an explicit locale path.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "");

  return (
    <div className="lang">
      <Languages className="icon-sm" aria-hidden />
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={localeTags[l]}
          aria-current={l === locale ? "true" : undefined}
          lang={l}
          className="lang-link"
        >
          {localeNames[l]}
        </Link>
      ))}
    </div>
  );
}
