"use server";

import {
  deliver,
  ContactNotConfiguredError,
  type ContactKind,
  type ContactSubmission,
} from "@/lib/contact";
import { defaultLocale, isLocale } from "@/i18n/config";

export type FormState = {
  status: "idle" | "ok" | "error";
  /** Message key the client renders in the right language. */
  message?:
    | "required"
    | "contactRequired"
    | "tooLong"
    | "notConfigured"
    | "failed"
    | "sent";
};

const MAX = { name: 120, contact: 160, message: 4000 } as const;

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Honeypot: a real person never fills a field they cannot see. Bots do.
  // Answer as though it worked so the bot does not learn to retry.
  if ((formData.get("website") as string)?.length) {
    return { status: "ok", message: "sent" };
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";
  const localeRaw = (formData.get("locale") as string | null) ?? defaultLocale;
  const kind = ((formData.get("kind") as string | null) ??
    "message") as ContactKind;

  if (!name || !message) return { status: "error", message: "required" };
  if (!phone && !email) return { status: "error", message: "contactRequired" };
  if (
    name.length > MAX.name ||
    phone.length > MAX.contact ||
    email.length > MAX.contact ||
    message.length > MAX.message
  ) {
    return { status: "error", message: "tooLong" };
  }

  const submission: ContactSubmission = {
    kind,
    name,
    phone: phone || undefined,
    email: email || undefined,
    message,
    locale: isLocale(localeRaw) ? localeRaw : defaultLocale,
    wantsPrayer: formData.get("wantsPrayer") === "on",
    planningVisit: formData.get("planningVisit") === "on",
    submittedAt: new Date().toISOString(),
  };

  try {
    await deliver(submission);
    return { status: "ok", message: "sent" };
  } catch (err) {
    if (err instanceof ContactNotConfiguredError) {
      // Loud on the server so this is caught in staging, not by a member.
      console.error(
        "[contact] No destination configured — set CONTACT_WEBHOOK_URL or " +
          "CONTACT_EMAIL_TO/API/KEY. Submission was NOT delivered.",
      );
      return { status: "error", message: "notConfigured" };
    }
    console.error("[contact] delivery failed:", err);
    return { status: "error", message: "failed" };
  }
}
