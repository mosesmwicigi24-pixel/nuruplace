import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { GalleryGrid } from "@/components/gallery-grid";
import { albums } from "@/content/gallery";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.gallery };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const sorted = [...albums].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        title={dict.nav.gallery}
        subtitle={
          locale === "sw"
            ? "Nyakati kutoka ibada zetu, uinjilisti na matukio."
            : "Moments from our services, outreaches and events."
        }
      />

      <div className="shell section">
        <div className="flow-lg">
          {sorted.map((album) => (
            <section key={album.slug} className="album">
              <header className="album-head">
                <h2 className="t-sub">{t(album.title, locale)}</h2>
                <p className="label">
                  <time dateTime={album.date}>
                    {formatDate(album.date, locale)}
                  </time>
                </p>
                <p className="t-body">{t(album.description, locale)}</p>
              </header>

              {album.images.length > 0 ? (
                <GalleryGrid images={album.images} locale={locale} />
              ) : (
                // An album with nothing in it says so, rather than rendering a
                // grid of broken images or quietly disappearing.
                <p className="notice">{dict.common.noPhotosYet}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
