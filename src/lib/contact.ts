import "server-only";

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
};

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
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(submission),
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
