import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { getMinistry, ministries } from "@/content/ministries";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, locales, localePath } from "@/i18n/config";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    ministries.map((m) => ({ locale, slug: m.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const ministry = getMinistry(slug);
  if (!ministry || !isLocale(locale)) return {};
  return {
    title: t(ministry.name, locale),
    description: t(ministry.summary, locale),
  };
}

export default async function MinistryPage({ params }: Props) {
  const { locale, slug } = await params;
  const ministry = getMinistry(slug);
  if (!ministry || !isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={t(ministry.name, locale)}
        subtitle={t(ministry.summary, locale)}
      />
      <article className="measure section-y">
        {t(ministry.body, locale).map((p, i) => (
          <p key={i} className="mt-4 leading-relaxed text-ink-700">
            {p}
          </p>
        ))}
        <Link
          href={localePath(locale, "/ministries")}
          className="mt-10 inline-flex min-h-6 items-center font-bold text-brand-600 hover:text-brand-700"
        >
          ← {dict.common.allMinistries}
        </Link>
      </article>
    </>
  );
}
