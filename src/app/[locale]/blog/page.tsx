import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { PostCard } from "@/components/cards";
import { posts } from "@/content/posts";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";
import { byDateDesc } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.blog };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageHero
        title={getDictionary(locale).nav.blog}
        subtitle={
          locale === "sw"
            ? "Tafakari, mafundisho na ushuhuda kutoka The Good News Mission."
            : "Reflections, teaching and testimonies from The Good News Mission."
        }
      />
      <div className="shell section-y">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {byDateDesc(posts).map((p) => (
            <PostCard key={p.slug} post={p} locale={locale} />
          ))}
        </div>
      </div>
    </>
  );
}
