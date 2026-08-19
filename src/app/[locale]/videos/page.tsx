import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState, PageHero } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.videos };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={dict.nav.videos}
        subtitle={locale === "sw" ? "Ibada zilizorekodiwa, matukio ya ibada na mafundisho." : "Recorded services, worship experiences and teaching."}
      />
      <EmptyState
        title={dict.common.comingSoon}
        message={locale === "sw" ? "Ongeza vitambulisho vya YouTube au Vimeo katika faili la maudhui na uviweke hapa." : "Add YouTube or Vimeo IDs to a content file and embed them here."}
      />
    </>
  );
}
