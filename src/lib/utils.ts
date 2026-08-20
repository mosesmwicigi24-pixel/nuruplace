import { localeTags, type Locale } from "@/i18n/config";

/**
 * Joins class names, dropping anything falsy. This replaces clsx +
 * tailwind-merge: with a hand-written stylesheet there are no conflicting
 * utility classes to merge, so nine lines does the whole job.
 */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Formats an ISO date in the reader's language, e.g. "23 October 2022". */
export function formatDate(iso: string, locale: Locale) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(localeTags[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Sorts a list of dated records newest first (does not mutate the input). */
export function byDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}
