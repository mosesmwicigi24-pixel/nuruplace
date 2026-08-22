/**
 * Parsing a person's typing into things a payment system will accept.
 *
 * Deliberately free of `server-only` and of every import: these two functions
 * are the parts of giving that can be checked in isolation, and
 * `scripts/check-giving.ts` does exactly that. A module that drags in
 * `server-only` cannot be imported by a plain node script, and a rule about
 * money that is never executed is a rule nobody has tested.
 */

/**
 * Kenyan mobile number → E.164, or null if it is not one.
 *
 * This is the field that makes a phone ring, so it is the field worth being
 * strict about. It accepts the four ways people actually write their own
 * number — 0722…, 722…, 254722…, +254722… — and rejects everything else: a
 * landline, a short code, a number with letters in it, an ID number typed into
 * the wrong box. All Kenyan mobile prefixes are 07xx or 01xx.
 *
 * This is not the security boundary; the API rate-limits per number regardless.
 * It is so someone who typos learns immediately rather than waiting for a
 * payment request that can never arrive.
 */
export function normalizeKenyanMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let national: string | null = null;
  if (/^0[17]\d{8}$/.test(digits)) national = digits.slice(1);
  else if (/^[17]\d{8}$/.test(digits)) national = digits;
  else if (/^254[17]\d{8}$/.test(digits)) national = digits.slice(3);
  return national ? `+254${national}` : null;
}

/**
 * "1,500" or "1500.50" → integer minor units, or null.
 *
 * Money is integer minor units end to end (Pathway §3.1). Parsing to a float
 * and multiplying by 100 is how 1500.10 becomes 150009.99999999999 and then
 * 150009 — a gift a shilling short, and a ledger that will not reconcile. So
 * the decimal part is read as digits and padded, never multiplied.
 *
 * Spaces and commas are stripped because people type "1,500" and "1 500" and
 * both mean the same thing; anything else is refused rather than guessed at.
 */
export function parseAmountToMinor(raw: string): number | null {
  const cleaned = raw.replace(/[\s,]/g, "");
  const m = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!m) return null;
  const shillings = Number(m[1]);
  const cents = Number((m[2] ?? "").padEnd(2, "0") || "0");
  const minor = shillings * 100 + cents;
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
}

/** Mirrors the API's bounds (migration 202). KES 10 floor, M-Pesa's 150,000
 *  per-transaction ceiling. */
export const GIVING_MIN_MINOR = 10_00;
export const GIVING_MAX_MINOR = 150_000_00;
