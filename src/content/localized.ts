import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";

/**
 * A value that exists in every locale. Keeping translations beside the English
 * rather than in a parallel file tree means a missing one is a type error, not
 * a page that silently falls back and nobody notices.
 */
export type Localized<T> = Record<Locale, T>;

/** Reads a localized value, falling back to the default locale if empty. */
export function t<T>(value: Localized<T>, locale: Locale): T {
  const v = value[locale];
  if (v === undefined || (Array.isArray(v) && v.length === 0)) {
    return value[defaultLocale];
  }
  return v;
}
