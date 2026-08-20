import "server-only";
import { createHash, createHmac } from "node:crypto";

/**
 * Where a submitted form actually goes.
 *
 * A church form that silently drops messages is worse than no form at all —
 * someone reaches out at a hard moment and hears nothing back. So delivery is
 * explicit: if no destination is configured, submission FAILS with a message
 * telling the visitor to call or WhatsApp instead. It never pretends to send.
 *
 * Configure exactly one of:
 *   CONTACT_WEBHOOK_URL  — POST the JSON payload (the Pathway pastoral intake,
 *                          a Formspree/Zapier hook, or any endpoint you own)
 *   CONTACT_EMAIL_TO +   — hand off to an email provider that accepts a simple
 *   CONTACT_EMAIL_API      POST (e.g. Resend). CONTACT_EMAIL_KEY authenticates.
 */

export type ContactKind = "connection-card" | "message" | "prayer";

export type ContactSubmission = {
  kind: ContactKind;
  name: string;
  phone?: string;
  email?: string;
  message: string;
  /** Which language the person wrote in, so the reply matches. */
  locale: string;
  /** Set when they ticked "I'd like someone to pray with me". */
  wantsPrayer: boolean;
  /** Set when they ticked "I'm planning to visit". */
  planningVisit: boolean;
  submittedAt: string;
  /**
   * Idempotency key (§3.6 of the Pathway spec). Derived from the submission's
   * own content, so a retry after a timeout — or a visitor who saw no
   * confirmation and pressed send again — is recognised as the same message
   * rather than becoming a second one a pastor answers twice.
   *
   * Content-derived rather than random precisely so a RETRY matches: a fresh
   * uuid per attempt would defeat the whole mechanism. A genuinely new message
   * differs in `submittedAt` and so gets its own key.
   */
  dedupeKey?: string;
};

/**
 * A stable fingerprint of one submission.
 *
 * Truncated to 32 hex characters: the receiving column is VARCHAR(64), and 128
 * bits is far past the point where a collision between two church enquiries is
 * a thing that happens.
 *
 * Fields are joined on NUL rather than a space, and that is not fussiness. A
 * collision here does not produce a duplicate — it produces a SILENT DROP,
 * because the receiver treats a repeated key as "already have this one". With a
 * space separator a boundary can shift between adjacent fields ("A" + "B C"
 * joins to the same string as "A B" + "C"), so two genuinely different messages
 * could hash alike and the second person would never be answered. NUL cannot
 * appear in any of these values, so the class of bug goes away rather than
 * merely becoming unlikely.
 */
const SEP = "\u0000";
export function dedupeKeyFor(
  s: Omit<ContactSubmission, "dedupeKey">,
): string {
  return createHash("sha256")
    .update(
      [s.kind, s.name, s.phone ?? "", s.email ?? "", s.message, s.submittedAt].join(SEP),
    )
    .digest("hex")
    .slice(0, 32);
}

/**
 * Sign the payload so the receiver can tell it came from this website.
 *
 * The Pathway intake is a `/webhooks/*` route: no session, no cookie, nothing
 * to authenticate a caller with — exactly like its Stripe and mobile-money
 * callbacks, which trust an HMAC over the raw body and nothing else. Without a
 * signature that endpoint is an open door onto the pastoral inbox, and the
 * first thing through it will be spam addressed to pastors.
 *
 * Timestamped and signed together so a captured request cannot be replayed
 * later; the receiver rejects a stale timestamp. Same shape as Stripe's
 * `t=…,v1=…` because Pathway's team already reads that format daily.
 *
 * Unsigned when CONTACT_WEBHOOK_SECRET is unset: a Zapier or Formspree hook
 * has no way to verify one, and refusing to POST at all would make the honest
 * "please call us" fallback unreachable for people using those.
 */
function signatureHeaders(body: string): Record<string, string> {
  const secret = process.env.CONTACT_WEBHOOK_SECRET?.trim();
  if (!secret) return {};
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  return { "x-nuruplace-signature": `t=${timestamp},v1=${signature}` };
}

export class ContactNotConfiguredError extends Error {
  constructor() {
    super("No contact destination is configured");
    this.name = "ContactNotConfiguredError";
  }
}

/**
 * A destination only counts if it is actually usable.
 *
 * A configured-but-unusable endpoint is more dangerous than no endpoint at
 * all: `deliver` takes that branch, the POST fails, and the visitor sees a
 * generic "something went wrong" instead of the honest "please call us" —
 * which is precisely the silent-drop this module exists to prevent.
 *
 * The shape that caused it in production was a placeholder pasted rather than
 * filled in: `CONTACT_WEBHOOK_URL=https://…your endpoint…`. Non-empty, so the
 * old check accepted it. Parsing rejects it, and rejects `not-a-url` and a
 * blank-but-present value too. The protocol check is separate because
 * `ftp://example.com` parses perfectly well and cannot receive a POST.
 */
function usableEndpoint(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export async function deliver(submission: ContactSubmission): Promise<void> {
  const webhook = usableEndpoint(process.env.CONTACT_WEBHOOK_URL);
  const emailTo = process.env.CONTACT_EMAIL_TO?.trim();
  const emailApi = usableEndpoint(process.env.CONTACT_EMAIL_API);
  const emailKey = process.env.CONTACT_EMAIL_KEY?.trim();

  // Say so loudly when something IS set but unusable — otherwise this looks
  // identical to "nobody configured it yet" and nobody goes looking.
  if (process.env.CONTACT_WEBHOOK_URL?.trim() && !webhook) {
    console.error(
      "[contact] CONTACT_WEBHOOK_URL is set but is not a usable http(s) URL — " +
        "treating it as unconfigured. Check for an unfilled placeholder.",
    );
  }

  if (webhook) {
    // Always send a key. The receiver only dedupes when one is present, so
    // omitting it would quietly turn idempotency off.
    const body = JSON.stringify({
      ...submission,
      dedupeKey: submission.dedupeKey ?? dedupeKeyFor(submission),
    });
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...signatureHeaders(body),
      },
      body,
      // A visitor should not wait forever on a slow downstream.
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      throw new Error(`Contact webhook returned ${res.status}`);
    }
    return;
  }

  if (emailTo && emailApi && emailKey) {
    const res = await fetch(emailApi, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${emailKey}`,
      },
      body: JSON.stringify({
        from: process.env.CONTACT_EMAIL_FROM ?? "website@nuruplace.org",
        to: [emailTo],
        subject: subjectFor(submission),
        text: bodyFor(submission),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      throw new Error(`Contact email provider returned ${res.status}`);
    }
    return;
  }

  throw new ContactNotConfiguredError();
}

function subjectFor(s: ContactSubmission): string {
  const tags = [
    s.kind === "connection-card" ? "Connection card" : "Website message",
    s.planningVisit ? "planning a visit" : null,
    s.wantsPrayer ? "prayer requested" : null,
  ].filter(Boolean);
  return `${tags.join(" · ")} — ${s.name}`;
}

function bodyFor(s: ContactSubmission): string {
  return [
    `Name:     ${s.name}`,
    s.phone ? `Phone:    ${s.phone}` : null,
    s.email ? `Email:    ${s.email}` : null,
    `Language: ${s.locale}`,
    s.planningVisit ? "Planning to visit: yes" : null,
    s.wantsPrayer ? "Would like prayer: yes" : null,
    `Received: ${s.submittedAt}`,
    "",
    s.message,
  ]
    .filter(Boolean)
    .join("\n");
}
