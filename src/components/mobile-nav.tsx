"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getMainNav, site } from "@/content/site";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./language-switcher";

export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const nav = getMainNav(locale);
  const dict = getDictionary(locale);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
        className="menu-toggle"
      >
        {open ? <X className="icon-lg" /> : <Menu className="icon-lg" />}
      </button>

      {open && (
        <div id="mobile-menu" className="menu-panel">
          <LanguageSwitcher locale={locale} />
          <ul>
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="menu-link"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="menu-sub">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="menu-sub-link"
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
          <a
            href={site.giving.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-block"
            style={{ marginTop: "var(--s-4)" }}
          >
            {dict.common.give}
          </a>
        </div>
      )}
    </div>
  );
}
