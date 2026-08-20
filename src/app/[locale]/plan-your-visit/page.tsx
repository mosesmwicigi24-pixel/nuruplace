import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/ui";
import { ConnectionCard } from "@/components/connection-card";
import { visitIntro, visitQuestions, visitFacts } from "@/content/visit";
import { site } from "@/content/site";
import { sundayServices } from "@/content/services";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: getDictionary(locale).nav.planVisit,
    description: t(visitIntro, locale),
  };
}

export default async function PlanYourVisitPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero title={dict.nav.planVisit} subtitle={t(visitIntro, locale)} />

      {/* The four facts someone needs before deciding to come at all. */}
      <section className="bg-wash" style={{ borderBottom: "1px solid var(--line)" }}>
        <dl className="shell grid-facts section-sm">
          {visitFacts.map((fact) => (
            <div key={t(fact.label, "en")}>
              <dt className="label">{t(fact.label, locale)}</dt>
              <dd className="t-sub strong" style={{ marginTop: "var(--s-1)" }}>
                {t(fact.value, locale)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="shell grid-aside section">
        <div>
          <div className="flow-lg">
            {visitQuestions.map((q, i) => (
              <section key={i}>
                <h2 className="t-sub">{t(q.question, locale)}</h2>
                {t(q.answer, locale).map((para, j) => (
                  <p key={j} className="t-body" style={{ marginTop: "var(--s-3)" }}>
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <section className="card-panel" style={{ marginTop: "var(--s-16)", borderColor: "var(--line)", background: "var(--surface-sunk)" }}>
            <h2 className="t-sub">
              {locale === "sw" ? "Ratiba ya Jumapili" : "Sunday at a glance"}
            </h2>
            <ul className="list-divided" style={{ marginTop: "var(--s-4)" }}>
              {sundayServices.map((s) => (
                <li key={t(s.name, "en")} className="list-split">
                  <span className="strong">{t(s.name, locale)}</span>
                  <span className="value">
                    {t(s.time, locale)}
                    {s.note && (
                      <span style={{ display: "block", color: "var(--brand-700)" }}>
                        {t(s.note, locale)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flow" style={{ marginTop: "var(--s-5)" }}>
              <p className="t-small row" style={{ alignItems: "flex-start" }}>
                <MapPin className="icon" aria-hidden />
                <span>
                  {site.contact.address}, {site.contact.city}
                </span>
              </p>
              <p className="t-small row" style={{ alignItems: "flex-start" }}>
                <Clock className="icon" aria-hidden />
                <span>
                  {locale === "sw"
                    ? "Fika dakika kumi mapema ukipenda kupata kiti bila haraka."
                    : "Arrive ten minutes early if you would like to find a seat unhurried."}
                </span>
              </p>
              <p className="row row-wrap">
                <a href={site.contact.phoneHref} className="link t-small">
                  <Phone className="icon" aria-hidden />
                  <span style={{ marginLeft: "var(--s-2)" }}>{site.contact.phone}</span>
                </a>
                <a
                  href={site.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link t-small"
                >
                  <MessageCircle className="icon" aria-hidden />
                  <span style={{ marginLeft: "var(--s-2)" }}>WhatsApp</span>
                </a>
              </p>
            </div>
          </section>
        </div>

        <aside className="aside-sticky">
          <ConnectionCard locale={locale} kind="connection-card" />
        </aside>
      </div>
    </>
  );
}
