/**
 * Locales. Swahili is first-class here, not an afterthought: more Kenyans
 * speak Swahili than English once second-language speakers are counted.
 */
export const locales = ["en", "sw"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  sw: "Kiswahili",
};

/** BCP-47 tags for <html lang> and hreflang. */
export const localeTags: Record<Locale, string> = {
  en: "en-KE",
  sw: "sw-KE",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefixes a path with the locale: ("sw", "/events") → "/sw/events". */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}
