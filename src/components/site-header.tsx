import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { getMainNav, site, tagline } from "@/content/site";
import { getDictionary } from "@/i18n/dictionary";
import { localePath, type Locale } from "@/i18n/config";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader({ locale }: { locale: Locale }) {
  const nav = getMainNav(locale);
  const dict = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-ink-900 text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-xs">
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${site.contact.email}`}
              className="flex items-center gap-2 hover:text-brand-300"
            >
              <Mail className="size-3.5" aria-hidden />
              {site.contact.email}
            </a>
            <a
              href={site.contact.phoneHref}
              className="flex items-center gap-2 hover:text-brand-300"
            >
              <Phone className="size-3.5" aria-hidden />
              {site.contact.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} className="text-white" />
            {site.socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-300"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href={localePath(locale, "/")} className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 font-display text-lg text-white">
              ✝
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-ink-900 sm:text-base">
                {site.name}
              </span>
              <span className="block text-[11px] text-brand-700">
                {tagline[locale]}
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) => (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className="inline-block rounded-md px-2.5 py-2 text-[13px] font-semibold text-ink-800 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="invisible absolute left-0 top-full z-50 w-72 rounded-lg border border-slate-200 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.giving.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-600 sm:inline-block"
            >
              {dict.common.give}
            </a>
            <MobileNav locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
