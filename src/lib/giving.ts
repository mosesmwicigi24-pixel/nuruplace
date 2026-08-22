import "server-only";
import { createHmac } from "node:crypto";

/**
 * Giving from nuruplace.org: the visitor's browser posts here, this module
 * signs the gift and forwards it to Pathway, and Pathway sends an M-Pesa STK
 * push to the number they typed. Their phone asks them to confirm.
 *
 * Two properties this file exists to hold onto:
 *
 * **Money never touches this server.** No card number, no PIN, no M-Pesa
 * credentials. The visitor confirms on their handset with Safaricom, and we
 * learn the outcome only when Safaricom tells Pathway. Nothing here can be
 * breached into a payment.
 *
 * **It fails loudly.** Same rule as the contact form: if the destination is not
 * configured, giving refuses and says "use the app or M-Pesa directly" rather
 * than accepting a phone number and doing nothing with it. A giving form that
 * silently drops a gift is worse than no giving form, because the person walks
 * away believing they gave.
 *
 * Configure:
 *   PATHWAY_API_URL              e.g. https://pathway.nuruplace.org/v1
 *   PATHWAY_GIVING_SECRET        shared with the API's WEBSITE_GIVING_WEBHOOK_SECRET
 */

export type Gift = {
  fund: string;
  /** Integer minor units (cents of a shilling). Never a float — see below. */
  amount_minor: number;
  currency: "KES";
  method: "mpesa";
  phone_number: string;
  giver_name?: string;
  giver_email?: string;
  idempotency_key: string;
  /** The visitor's address as we saw it, so the API can rate-limit per person
   *  rather than lumping every visitor into this server's one address. */
  client_ip?: string;
};

export class GivingNotConfiguredError extends Error {
  constructor() {
    super("No giving destination is configured");
    this.name = "GivingNotConfiguredError";
  }
}

/** The API said "too many pushes to this number" — a real answer to show a
 *  real person, not a generic failure. */
export class GivingThrottledError extends Error {
  constructor(readonly retryAfterSeconds: number) {
    super("Too many giving attempts for this number");
    this.name = "GivingThrottledError";
  }
}

/** The API rejected the gift itself (unknown fund, amount out of bounds). */
export class GivingRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GivingRejectedError";
  }
}

/**
 * A destination only counts if it is actually usable.
 *
 * Same guard as contact.ts, and for the same reason: a placeholder pasted
 * rather than filled in (`PATHWAY_API_URL=https://…your endpoint…`) is
 * non-empty, so a truthiness check accepts it, the POST fails, and the visitor
 * sees a generic error instead of the honest fallback. The protocol check is
 * separate because `ftp://example.com` parses perfectly well and cannot receive
 * a POST.
 */
function usableBase(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.href.replace(/\/+$/, "");
  } catch {
    return undefined;
  }
}

export function givingBase(): string | undefined {
  const base = usableBase(process.env.PATHWAY_API_URL);
  if (process.env.PATHWAY_API_URL?.trim() && !base) {
    console.error(
      "[giving] PATHWAY_API_URL is set but is not a usable http(s) URL — " +
        "treating giving as unconfigured. Check for an unfilled placeholder.",
    );
  }
  return base;
}

/** Configured means BOTH halves: an endpoint and the secret to sign with. The
 *  API refuses unsigned gifts, so a URL without a secret is not configured, it
 *  is a 401 waiting to happen. */
export function givingConfigured(): boolean {
  return Boolean(givingBase() && process.env.PATHWAY_GIVING_SECRET?.trim());
}

function signatureHeaders(body: string): Record<string, string> {
  const secret = process.env.PATHWAY_GIVING_SECRET?.trim();
  if (!secret) return {};
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return {
    "x-nuruplace-signature": `t=${timestamp},v1=${createHmac("sha256", secret)
      .update(`${timestamp}.${body}`)
      .digest("hex")}`,
  };
}

export type Fund = { code: string; name: string };
export type GivingOptions = {
  funds: Fund[];
  currency: string;
  minMinor: number;
  maxMinor: number;
  mpesaEnabled: boolean;
};

/**
 * What the church currently accepts. Read at request time so a fund added in
 * the portal shows up here without a redeploy.
 *
 * Returns null rather than throwing when the API is unreachable: the page can
 * still render, explaining how to give another way. A page that 500s because a
 * downstream is slow helps nobody.
 */
export async function fetchGivingOptions(): Promise<GivingOptions | null> {
  const base = givingBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/giving/funds`, {
      // Funds change when someone edits them, not on a timer; a short revalidate
      // keeps the page fast without pinning a retired fund on screen for hours.
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) {
      console.error(`[giving] funds lookup returned ${res.status}`);
      return null;
    }
    const body = (await res.json()) as {
      funds?: Fund[];
      currency?: string;
      min_minor?: number;
      max_minor?: number;
      providers?: { key: string; enabled: boolean }[];
    };
    return {
      funds: Array.isArray(body.funds) ? body.funds : [],
      currency: body.currency ?? "KES",
      minMinor: body.min_minor ?? 1000,
      maxMinor: body.max_minor ?? 15_000_000,
      mpesaEnabled: Boolean(body.providers?.find((p) => p.key === "mpesa")?.enabled),
    };
  } catch (err) {
    console.error("[giving] funds lookup failed:", err);
    return null;
  }
}

/** Send the gift. Resolves when the STK push is on its way to the giver's phone. */
export async function sendGift(gift: Gift): Promise<{ transactionId: string }> {
  const base = givingBase();
  const secret = process.env.PATHWAY_GIVING_SECRET?.trim();
  if (!base || !secret) throw new GivingNotConfiguredError();

  const body = JSON.stringify(gift);
  const res = await fetch(`${base}/webhooks/website-giving`, {
    method: "POST",
    headers: { "content-type": "application/json", ...signatureHeaders(body) },
    body,
    // The STK push is synchronous at Safaricom's end and can be slow; but a
    // visitor staring at a spinner needs an answer either way.
    signal: AbortSignal.timeout(20_000),
  });

  if (res.status === 429) {
    const retry = Number(res.headers.get("retry-after") ?? "");
    throw new GivingThrottledError(Number.isFinite(retry) && retry > 0 ? retry : 600);
  }
  if (res.status === 400 || res.status === 422) {
    // The API's message is written for a person ("above the M-Pesa limit"), so
    // pass it through rather than replacing it with something vaguer.
    const detail = await res
      .json()
      .then((b: { error?: { message?: string } }) => b?.error?.message)
      .catch(() => undefined);
    throw new GivingRejectedError(detail ?? "That gift was not accepted");
  }
  if (!res.ok) {
    throw new Error(`Giving endpoint returned ${res.status}`);
  }

  const out = (await res.json()) as { transaction_id?: string };
  return { transactionId: out.transaction_id ?? "" };
}

export type GiftStatus = {
  status: "processing" | "succeeded" | "failed" | "refunded" | "requires_action";
  amount_minor: number;
  currency: string;
  fund: string | null;
  receipt_code: string | null;
  settled_at: string | null;
};

/**
 * Has the gift landed yet?
 *
 * The page asks this while the giver is at their handset, so it can stop saying
 * "check your phone" and say thank you instead. Signed like everything else we
 * send, because it reads from the ledger.
 *
 * Returns null when we cannot TELL — a timeout, a 429, a network blip. The
 * caller keeps waiting rather than announcing a failure it has not established:
 * telling someone their gift failed when it merely could not be checked is the
 * worst of the available wrong answers, and they have already paid.
 */
export async function fetchGiftStatus(transactionId: string): Promise<GiftStatus | null> {
  const base = givingBase();
  const secret = process.env.PATHWAY_GIVING_SECRET?.trim();
  if (!base || !secret) return null;

  const body = JSON.stringify({ transaction_id: transactionId });
  try {
    const res = await fetch(`${base}/webhooks/website-giving/status`, {
      method: "POST",
      headers: { "content-type": "application/json", ...signatureHeaders(body) },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // 429 means the poller is asking too often, not that the gift failed.
      if (res.status !== 429) console.error(`[giving] status lookup returned ${res.status}`);
      return null;
    }
    return (await res.json()) as GiftStatus;
  } catch (err) {
    console.error("[giving] status lookup failed:", err);
    return null;
  }
}

// The two parsers live in ./money so a plain node script can execute their
// assertions — this module imports `server-only` and cannot be. Re-exported so
// callers have one place to import giving from.
export {
  normalizeKenyanMobile,
  parseAmountToMinor,
  GIVING_MIN_MINOR,
  GIVING_MAX_MINOR,
} from "./money";
