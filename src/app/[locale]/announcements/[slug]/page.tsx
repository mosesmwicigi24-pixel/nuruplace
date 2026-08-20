import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { announcements, getAnnouncement } from "@/content/announcements";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, locales, localePath } from "@/i18n/config";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    announcements.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const notice = getAnnouncement(slug);
  if (!notice || !isLocale(locale)) return {};
  return {
    title: t(notice.title, locale),
    description: t(notice.summary, locale),
  };
}

export default async function AnnouncementPage({ params }: Props) {
  const { locale, slug } = await params;
  const notice = getAnnouncement(slug);
  if (!notice || !isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={t(notice.title, locale)}
        subtitle={t(notice.summary, locale)}
      />
      <article className="measure section prose">
        <p className="t-small muted">
          {dict.common.posted}{" "}
          <time dateTime={notice.date}>{formatDate(notice.date, locale)}</time>
        </p>
        {t(notice.body, locale).map((p, i) => (
          <p key={i} className="t-body">
            {p}
          </p>
        ))}
        <Link
          href={localePath(locale, "/announcements")}
          className="link link-back"
        >
          ← {dict.common.allNotices}
        </Link>
      </article>
    </>
  );
}
