"use server";

import { headers } from "next/headers";
import {
  sendGift,
  fetchGiftStatus,
  givingConfigured,
  GivingNotConfiguredError,
  GivingThrottledError,
  GivingRejectedError,
} from "@/lib/giving";
import {
  normalizeKenyanMobile,
  parseAmountToMinor,
  GIVING_MIN_MINOR,
  GIVING_MAX_MINOR,
} from "@/lib/money";

/**
 * Ask whether a gift has landed.
 *
 * A server action rather than a public route, because the query has to be
 * signed and the secret must never reach the browser. The transaction id is a
 * UUIDv4 the client received when it created the gift; guessing one is not a
 * practical attack, and the response carries no phone number or name.
 *
 * Returns "unknown" when we could not tell. The caller keeps waiting: a
 * timeout is not a failed gift, and the person has already paid.
 */
export async function checkGift(
  transactionId: string,
): Promise<{ state: "waiting" | "given" | "failed" | "unknown"; amountMinor?: number; currency?: string; fund?: string | null; receipt?: string | null }> {
  if (!/^[0-9a-fA-F-]{36}$/.test(transactionId)) return { state: "unknown" };
  const gift = await fetchGiftStatus(transactionId);
  if (!gift) return { state: "unknown" };
  if (gift.status === "succeeded") {
    return {
      state: "given",
      amountMinor: gift.amount_minor,
      currency: gift.currency,
      fund: gift.fund,
      receipt: gift.receipt_code,
    };
  }
  // `refunded` is not reachable mid-flow, but it is terminal and definitely not
  // a gift in progress, so it belongs on this side of the line.
  if (gift.status === "failed" || gift.status === "refunded") return { state: "failed" };
  return { state: "waiting" };
}

export type GiveState = {
  status: "idle" | "ok" | "error";
  /** Message key the client renders in the right language. */
  message?:
    | "amountRequired"
    | "amountRange"
    | "phoneRequired"
    | "fundRequired"
    | "tooLong"
    | "notConfigured"
    | "throttled"
    | "rejected"
    | "failed";
  /** For "rejected", the API's own sentence — already written for a person. */
  detail?: string;
  /** For "throttled", roughly how long to wait, in minutes. */
  waitMinutes?: number;
  /** On success, the number the push went to, echoed so they can check it. */
  sentTo?: string;
  /** Lets the confirmation screen poll until the gift actually settles. */
  transactionId?: string;
};

const MAX = { name: 120, email: 255, fund: 40 } as const;

/**
 * Take a gift from a visitor and ask Pathway to push it to their phone.
 *
 * Everything below is validated again on the API side. It is repeated here so
 * a mistyped number gets an immediate, specific answer rather than a round trip
 * ending in a generic failure — and so an obviously-bad request never reaches
 * an endpoint whose whole job is making phones ring.
 */
export async function submitGift(
  _prev: GiveState,
  formData: FormData,
): Promise<GiveState> {
  // Honeypot: a real person never fills a field they cannot see.
  //
  // Unlike the contact form, a bot here is NOT answered with a cheerful "sent".
  // Claiming a gift went through when it did not is a lie about money. It gets
  // a plain failure, which tells a bot nothing useful either.
  if ((formData.get("website") as string)?.length) {
    return { status: "error", message: "failed" };
  }

  if (!givingConfigured()) {
    console.error(
      "[giving] Not configured — set PATHWAY_API_URL and PATHWAY_GIVING_SECRET. " +
        "The gift was NOT sent.",
    );
    return { status: "error", message: "notConfigured" };
  }

  const amountRaw = (formData.get("amount") as string | null)?.trim() ?? "";
  const phoneRaw = (formData.get("phone") as string | null)?.trim() ?? "";
  const fund = (formData.get("fund") as string | null)?.trim() ?? "";
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const key = (formData.get("idempotencyKey") as string | null)?.trim() ?? "";

  if (!fund || fund.length > MAX.fund) return { status: "error", message: "fundRequired" };
  if (name.length > MAX.name || email.length > MAX.email) {
    return { status: "error", message: "tooLong" };
  }

  if (!amountRaw) return { status: "error", message: "amountRequired" };
  const amountMinor = parseAmountToMinor(amountRaw);
  if (amountMinor === null) return { status: "error", message: "amountRequired" };
  // Mirrors the API's bounds. Below the floor is somebody testing whether the
  // form rings phones; above the ceiling Safaricom refuses the push anyway.
  if (amountMinor < GIVING_MIN_MINOR || amountMinor > GIVING_MAX_MINOR) {
    return { status: "error", message: "amountRange" };
  }

  const phone = normalizeKenyanMobile(phoneRaw);
  if (!phone) return { status: "error", message: "phoneRequired" };

  // The key comes from the form, minted once when it was rendered. Deliberately
  // NOT derived from the content and NOT minted here: derived-from-content
  // would refuse a second, genuinely intended gift of the same amount, and
  // minting per call would turn an impatient double-click into two STK pushes
  // and two debits. One key per rendered form is the only version that gets
  // both cases right.
  const idempotencyKey = /^[a-zA-Z0-9_-]{8,64}$/.test(key)
    ? `web-${key}`
    : `web-${crypto.randomUUID()}`;

  // The visitor's address, so the API rate-limits per person instead of putting
  // every visitor behind this server's single address. Best effort: behind a
  // proxy chain the leftmost entry is the client's and can be spoofed, which is
  // why the API's real protection is keyed on the phone number instead.
  const h = await headers();
  const clientIp =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || undefined;

  try {
    const { transactionId } = await sendGift({
      fund,
      amount_minor: amountMinor,
      currency: "KES",
      method: "mpesa",
      phone_number: phone,
      giver_name: name || undefined,
      giver_email: email || undefined,
      idempotency_key: idempotencyKey,
      client_ip: clientIp,
    });
    // The id is what lets the page find out whether the gift landed, instead of
    // leaving "check your phone" on screen forever.
    return { status: "ok", sentTo: phone, transactionId };
  } catch (err) {
    if (err instanceof GivingNotConfiguredError) {
      return { status: "error", message: "notConfigured" };
    }
    if (err instanceof GivingThrottledError) {
      return {
        status: "error",
        message: "throttled",
        waitMinutes: Math.max(1, Math.ceil(err.retryAfterSeconds / 60)),
      };
    }
    if (err instanceof GivingRejectedError) {
      return { status: "error", message: "rejected", detail: err.message };
    }
    console.error("[giving] send failed:", err);
    return { status: "error", message: "failed" };
  }
}
