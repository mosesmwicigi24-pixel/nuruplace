import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { partitionAnnouncements } from "@/content/announcements";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, localePath } from "@/i18n/config";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.announcements };
}

export default async function AnnouncementsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // Expiry is evaluated per request rather than baked in at build, so a notice
  // does not sit at the top of the page a week after it stopped being true.
  const today = new Date().toISOString().slice(0, 10);
  const { current, past } = partitionAnnouncements(today);

  return (
    <>
      <PageHero
        title={dict.nav.announcements}
        subtitle={
          locale === "sw"
            ? "Matangazo kwa familia ya kanisa — mabadiliko ya ibada, mikutano na habari."
            : "Notices for the church family — service changes, meetings and news."
        }
      />

      <div className="shell section">
        {current.length > 0 && (
          <section>
            <h2 className="t-sub">{dict.common.current}</h2>
            <ul className="notice-list">
              {current.map((a) => (
                <li
                  key={a.slug}
                  className={a.urgent ? "notice-item is-urgent" : "notice-item"}
                >
                  <p className="label">
                    {dict.common.posted}{" "}
                    <time dateTime={a.date}>{formatDate(a.date, locale)}</time>
                  </p>
                  <h3 className="t-card notice-title">
                    <Link href={localePath(locale, `/announcements/${a.slug}`)}>
                      {t(a.title, locale)}
                    </Link>
                  </h3>
                  <p className="t-body">{t(a.summary, locale)}</p>
                  <Link
                    href={localePath(locale, `/announcements/${a.slug}`)}
                    className="link t-small"
                  >
                    {dict.common.readNotice} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {past.length > 0 && (
          <section style={{ marginTop: "var(--s-16)" }}>
            <h2 className="t-sub">{dict.common.earlier}</h2>
            <ul className="notice-list is-past">
              {past.map((a) => (
                <li key={a.slug} className="notice-item">
                  <p className="label">
                    <time dateTime={a.date}>{formatDate(a.date, locale)}</time>
                  </p>
                  <h3 className="t-card notice-title">
                    <Link href={localePath(locale, `/announcements/${a.slug}`)}>
                      {t(a.title, locale)}
                    </Link>
                  </h3>
                  <p className="t-body">{t(a.summary, locale)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
