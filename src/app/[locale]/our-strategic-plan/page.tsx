import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, StaticPageBody } from "@/components/ui";
import { strategicPlanPage } from "@/content/pages";
import { t } from "@/content/localized";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: t(strategicPlanPage.title, locale) };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <PageHero
        title={t(strategicPlanPage.title, locale)}
        subtitle={strategicPlanPage.intro ? t(strategicPlanPage.intro, locale) : undefined}
      />
      <StaticPageBody page={strategicPlanPage} locale={locale} />
    </>
  );
}
