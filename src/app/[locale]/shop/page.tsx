import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState, PageHero } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.resources };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.nav.resources}
        subtitle={locale === "sw" ? "Vitabu, vifaa vya kufundishia na bidhaa za kanisa." : "Books, teaching materials and church merchandise."}
      />
      <EmptyState
        title={dict.common.comingSoon}
        message={locale === "sw" ? "Ukurasa huu ni wa muda. Amua kama duka liwe orodha tu au liwe na malipo kamili kabla ya kulijenga." : "This page is a placeholder. Decide whether the shop should be a catalogue or a full checkout before building it out."}
      />
    </>
  );
}
