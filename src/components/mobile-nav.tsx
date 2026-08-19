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
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
        className="grid size-10 place-items-center rounded-md border border-slate-200 text-ink-800"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full max-h-[75vh] overflow-y-auto border-b border-slate-200 bg-white px-6 py-4 shadow-lg"
        >
          <LanguageSwitcher locale={locale} className="mb-3 text-ink-700" />
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 font-semibold text-ink-800 hover:bg-brand-50"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-3 border-l border-slate-200 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-md px-3 py-1.5 text-sm text-ink-700 hover:bg-brand-50"
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
            className="mt-4 block rounded-full bg-accent-500 px-5 py-3 text-center font-bold text-white"
          >
            {dict.common.give}
          </a>
        </div>
      )}
    </div>
  );
}
