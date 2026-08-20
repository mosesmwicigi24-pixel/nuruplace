import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Button } from "@/components/ui";
import { site } from "@/content/site";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, localePath } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

/**
 * The old CodeIgniter site carried a /shop link, so inbound links and printed
 * material may still point here — the URL stays alive rather than 404ing.
 *
 * There is no catalogue, and inventing one would be a lie on a church website.
 * So this says plainly what does exist and sends people to it. Replace the
 * whole page if a real shop is ever built; do not fill it with placeholder
 * products in the meantime.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "sw" ? "Duka" : "Shop",
    // Nothing to sell means nothing to index.
    robots: { index: false, follow: true },
  };
}

export default async function ShopPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        title={locale === "sw" ? "Duka" : "Shop"}
        subtitle={
          locale === "sw"
            ? "Kwa sasa hatuuzi chochote mtandaoni — lakini kuna vitu viwili ambavyo pengine unavitafuta."
            : "We are not selling anything online at the moment — but there are two things you may well be looking for."
        }
      />

      <div className="measure section flow-lg">
        <section>
          <h2 className="t-sub">
            {locale === "sw" ? "Vifaa na vipakuliwa" : "Materials and downloads"}
          </h2>
          <p className="t-body">
            {locale === "sw"
              ? "Miongozo ya masomo, fomu na hati za kanisa zinapatikana bila malipo katika ukurasa wa Rasilimali."
              : "Study guides, forms and church documents are available free on the Resources page."}
          </p>
          <div style={{ marginTop: "var(--s-5)" }}>
            <Button href={localePath(locale, "/resources")}>
              {dict.nav.resources}
            </Button>
          </div>
        </section>

        <section>
          <h2 className="t-sub">{locale === "sw" ? "Kutoa" : "Giving"}</h2>
          <p className="t-body">
            {locale === "sw"
              ? "Kama ulikuja hapa kutoa sadaka au kuchangia mradi, hii ndiyo njia."
              : "If you came here to give an offering or support a project, this is the way."}
          </p>
          <div style={{ marginTop: "var(--s-5)" }}>
            <Button href={site.giving.url} variant="accent" external>
              {dict.common.giveNow}
            </Button>
          </div>
        </section>

        <section>
          <h2 className="t-sub">
            {locale === "sw" ? "Ulikuwa unatafuta kingine?" : "Looking for something else?"}
          </h2>
          <p className="t-body">
            {locale === "sw"
              ? "Tuambie na tutakusaidia kukipata."
              : "Tell us and we will help you find it."}
          </p>
          <div style={{ marginTop: "var(--s-5)" }}>
            <Button href={localePath(locale, "/contact-us")}>
              {dict.nav.contact}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
