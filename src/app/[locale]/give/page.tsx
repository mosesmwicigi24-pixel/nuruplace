import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Smartphone, ShieldCheck, HandCoins, Phone } from "lucide-react";
import { PageHero } from "@/components/ui";
import { GiveForm } from "@/components/give-form";
import { fetchGivingOptions, givingConfigured } from "@/lib/giving";
import { site } from "@/content/site";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

/**
 * Rendered per request, not prerendered.
 *
 * Whether giving works is decided by environment variables that exist at RUN
 * time — the container gets them from compose, and `next build` runs long
 * before that. Prerendered, this page would bake in "giving is not switched
 * on" from a build that never saw the secret, and keep serving that answer
 * after the feature was live. The funds list is still cached upstream (see
 * `fetchGivingOptions`), so this costs a cheap render, not a round trip.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { give } = getDictionary(locale);
  return { title: give.title, description: give.lede };
}

/**
 * The Give page.
 *
 * Renders the form only when giving genuinely works end to end: an endpoint is
 * configured, a signing secret exists, the API answered, and M-Pesa is wired on
 * its side. Any one of those missing and the page says so and points at the
 * ways to give that DO work.
 *
 * This is the same rule the contact form follows, and it matters more here. A
 * giving form that accepts a phone number and does nothing does not merely lose
 * a message — it takes someone's decision to give and quietly discards it,
 * while they believe they have given.
 */
export default async function GivePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { give } = getDictionary(locale);

  const options = givingConfigured() ? await fetchGivingOptions() : null;
  const usable = Boolean(options?.mpesaEnabled && options.funds.length > 0);

  return (
    <>
      <PageHero title={give.title} subtitle={give.lede} />

      <div className="shell grid-2 section">
        <div>
          <blockquote className="pull-quote">
            <p className="t-body">{give.scripture}</p>
            <cite>{give.scriptureRef}</cite>
          </blockquote>

          <h2 className="t-sub" style={{ marginTop: "var(--s-12)" }}>
            {give.howItWorks}
          </h2>
          <ol className="give-steps">
            <li>
              <HandCoins className="icon-lg" aria-hidden />
              <span>{give.step1}</span>
            </li>
            <li>
              <Smartphone className="icon-lg" aria-hidden />
              <span>{give.step2}</span>
            </li>
            <li>
              <ShieldCheck className="icon-lg" aria-hidden />
              <span>{give.step3}</span>
            </li>
          </ol>

          <ul className="contact-list" style={{ marginTop: "var(--s-10)" }}>
            <li>
              <Phone className="icon-lg" aria-hidden />
              <div>
                <p className="strong">{getDictionary(locale).common.phone}</p>
                <a href={site.contact.phoneHref} className="link">
                  {site.contact.phone}
                </a>
              </div>
            </li>
          </ul>
        </div>

        <div>
          {usable && options ? (
            <GiveForm locale={locale} funds={options.funds} />
          ) : (
            <div className="form">
              <h2 className="t-sub">{give.unavailable}</h2>
              <p className="t-body" style={{ marginTop: "var(--s-4)" }}>
                {give.unavailableBody}
              </p>
              {/* The mission's existing giving site. It is the path that worked
                  before this page existed, so it stays reachable — routing the
                  Give button here must not take away a way of giving. */}
              <a
                href={site.giving.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-block"
                style={{ marginTop: "var(--s-6)" }}
              >
                {site.giving.label}
              </a>
              <p className="hint" style={{ marginTop: "var(--s-4)" }}>
                <a href={site.contact.phoneHref} className="link-inline">
                  {site.contact.phone}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
