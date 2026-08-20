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
      <div className="shell section">
        <div className="grid-cards">
          {leadership.map((leader, i) => (
            <article key={i} className="card">
              <div className="avatar" aria-hidden>
                ✝
              </div>
              <h2 className="t-card" style={{ marginTop: "var(--s-4)" }}>
                {leader.name}
              </h2>
              <p className="label" style={{ marginTop: "var(--s-1)" }}>
                {t(leader.role, locale)}
              </p>
              {leader.bio && (
                <p className="t-body" style={{ marginTop: "var(--s-3)" }}>
                  {t(leader.bio, locale)}
                </p>
              )}
            </article>
          ))}
        </div>
        <p className="notice">
          {locale === "sw"
            ? "Majina, picha na wasifu bado hazijatolewa. Zibadilishe katika "
            : "Names, photographs and biographies have not been supplied yet. Update them in "}
          <code>src/content/leadership.ts</code>.
        </p>
      </div>
    </>
  );
}
