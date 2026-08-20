import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { VideoEmbed } from "@/components/video-embed";
import { videos } from "@/content/videos";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.videos };
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const sorted = [...videos].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        title={dict.nav.videos}
        subtitle={
          locale === "sw"
            ? "Ibada zilizorekodiwa, matukio ya ibada na mafundisho."
            : "Recorded services, worship experiences and teaching."
        }
      />

      <div className="shell section">
        {sorted.length === 0 ? (
          <p className="notice">{dict.common.noVideosYet}</p>
        ) : (
          <ul className="video-list">
            {sorted.map((video) => (
              <li key={video.slug} className="video-item">
                <VideoEmbed video={video} locale={locale} />
                <div className="video-meta">
                  <h2 className="t-card">{t(video.title, locale)}</h2>
                  <p className="label">
                    <time dateTime={video.date}>
                      {formatDate(video.date, locale)}
                    </time>
                    {video.duration && <span> · {video.duration}</span>}
                  </p>
                  <p className="t-body">{t(video.description, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
