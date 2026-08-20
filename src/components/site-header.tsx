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
    <header className="site-header">
      <div className="topbar">
        <div className="shell topbar-inner">
          <div className="topbar-group">
            <a href={`mailto:${site.contact.email}`} className="link-quiet">
              <Mail className="icon-sm" aria-hidden />
              {site.contact.email}
            </a>
            <a href={site.contact.phoneHref} className="link-quiet">
              <Phone className="icon-sm" aria-hidden />
              {site.contact.phone}
            </a>
          </div>
          <div className="topbar-group">
            <LanguageSwitcher locale={locale} />
            {site.socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="shell header-inner">
          <Link href={localePath(locale, "/")} className="brandmark">
            <span className="brandmark-glyph" aria-hidden>
              ✝
            </span>
            <span>
              <span className="brandmark-name">{site.name}</span>
              <span className="brandmark-tag">{tagline[locale]}</span>
            </span>
          </Link>

          <nav aria-label="Main" className="nav">
            <ul className="nav-list">
              {nav.map((item) => (
                <li key={item.label} className="nav-item">
                  <Link href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="nav-sub">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="nav-sub-link">
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

          <div className="header-actions">
            <a
              href={site.giving.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent btn-give"
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
