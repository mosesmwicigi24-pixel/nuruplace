"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, localeNames, localeTags, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Plain links rather than buttons: they work without JavaScript, they are
 * crawlable, and they keep the reader on the page they were already on.
 * The choice is remembered server-side — src/proxy.ts writes the cookie when
 * it sees an explicit locale path.
 */
export function LanguageSwitcher({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "");

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Languages className="size-4 shrink-0 opacity-70" aria-hidden />
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={localeTags[l]}
          aria-current={l === locale ? "true" : undefined}
          lang={l}
          className={cn(
            "rounded px-1.5 py-0.5 text-xs font-semibold transition-colors",
            l === locale
              ? "underline underline-offset-2"
              : "opacity-80 hover:opacity-100",
          )}
        >
          {localeNames[l]}
        </Link>
      ))}
    </div>
  );
}
