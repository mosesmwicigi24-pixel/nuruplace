import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { leadership } from "@/content/leadership";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.leadership };
}

export default async function LeadershipPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageHero
        title={getDictionary(locale).nav.leadership}
        subtitle={
          locale === "sw"
            ? "Timu ambayo Mungu ameikabidhi kuchunga The Good News Mission."
            : "The team God has entrusted with shepherding The Good News Mission."
        }
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((leader, i) => (
            <article
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div
                className="grid size-16 place-items-center rounded-full bg-brand-50 font-display text-2xl text-brand-600"
                aria-hidden
              >
                ✝
              </div>
              <h2 className="mt-4 text-lg font-bold text-ink-900">{leader.name}</h2>
              <p className="mt-1 text-sm font-bold text-brand-700">
                {t(leader.role, locale)}
              </p>
              {leader.bio && (
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  {t(leader.bio, locale)}
                </p>
              )}
            </article>
          ))}
        </div>
        <p className="mt-12 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-ink-700">
          {locale === "sw"
            ? "Majina, picha na wasifu bado hazijatolewa. Zibadilishe katika "
            : "Names, photographs and biographies have not been supplied yet. Update them in "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">
            src/content/leadership.ts
          </code>
          .
        </p>
      </div>
    </>
  );
}
