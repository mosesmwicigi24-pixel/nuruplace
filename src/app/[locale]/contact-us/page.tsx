import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui";
import { ConnectionCard } from "@/components/connection-card";
import { site } from "@/content/site";
import { sundayServices, weeklyServices } from "@/content/services";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.contact };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.nav.contact}
        subtitle={
          locale === "sw"
            ? "Tungependa kusikia kutoka kwako. Njoo utembelee, tupigie simu, au tutumie ujumbe."
            : "We would love to hear from you. Come and visit, call, or send us a message."
        }
      />
      <div className="shell grid-2 section">
        <div>
          <h2 className="t-sub">{locale === "sw" ? "Tupate wapi" : "Find us"}</h2>
          <p className="t-body" style={{ marginTop: "var(--s-4)" }}>
            {locale === "sw"
              ? "The Good News Mission ni kanisa linalotuma wamisionari. Tunatamani kuonyesha upendo wa Kristo kwa watu wote kwa kushiriki Habari Njema ya Bwana wetu Yesu Kristo na kila mtu duniani kote. Wito wetu ni ule usemao “Enendeni”, badala ya kuwaomba watu waje na kubaki milele ndani ya kuta nne za jengo."
              : "The Good News Mission is a missionary sending church. We desire to show the love of Christ to all people through sharing the Good News of our Lord Jesus Christ with every soul across the world. Our calling is one that says “Go ye out”, rather than asking people to come and forever remain within the four walls of a building."}
          </p>

          <ul className="contact-list">
            <li>
              <MapPin className="icon-lg" aria-hidden />
              <div>
                <p className="strong">{dict.common.address}</p>
                <p className="t-body">{site.contact.address}</p>
                <p className="t-body">{site.contact.city}</p>
              </div>
            </li>
            <li>
              <Phone className="icon-lg" aria-hidden />
              <div>
                <p className="strong">{dict.common.phone}</p>
                <a href={site.contact.phoneHref} className="link">
                  {site.contact.phone}
                </a>
              </div>
            </li>
            <li>
              <MessageCircle className="icon-lg" aria-hidden />
              <div>
                <p className="strong">WhatsApp</p>
                <a
                  href={site.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {site.contact.phone}
                </a>
              </div>
            </li>
            <li>
              <Mail className="icon-lg" aria-hidden />
              <div>
                <p className="strong">{dict.common.email}</p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="link"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {site.contact.email}
                </a>
              </div>
            </li>
          </ul>

          <h2 className="t-sub" style={{ marginTop: "var(--s-12)" }}>
            {locale === "sw" ? "Nyakati za ibada" : "Service times"}
          </h2>
          <ul className="list-divided" style={{ marginTop: "var(--s-4)" }}>
            {[...sundayServices, ...weeklyServices].map((s) => (
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
        </div>

        <div>
          <ConnectionCard locale={locale} kind="message" />
        </div>
      </div>
    </>
  );
}
