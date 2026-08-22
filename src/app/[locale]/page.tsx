import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Scripture, SectionHeading } from "@/components/ui";
import { EventCard, MinistryCard, PostCard, SermonCard } from "@/components/cards";
import { Photo } from "@/components/photo";
import { HeroCarousel } from "@/components/hero-carousel";
import { photos, hasPhoto } from "@/content/photos";
import { site, tagline } from "@/content/site";
import { ministries } from "@/content/ministries";
import { events } from "@/content/events";
import { sermons } from "@/content/sermons";
import { posts } from "@/content/posts";
import { sundayServices, weeklyServices } from "@/content/services";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, localePath } from "@/i18n/config";
import { byDateDesc } from "@/lib/utils";
import type { ServiceSlot } from "@/content/services";
import type { Locale } from "@/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const { home, common } = dict;
  const p = (path: string) => localePath(locale, path);

  const latestEvents = byDateDesc(events).slice(0, 3);
  const latestSermon = byDateDesc(sermons)[0];
  const latestPosts = byDateDesc(posts).slice(0, 3);
  const andrew = ministries.find((m) => m.slug === "the-andrew-project");

  return (
    <>
      {/* Three stacked bands (hero, scripture, welcome) became one carousel.
          The slides are built here, on the server, from the same dictionary
          strings the sections used — so nothing needed retranslating and the
          first slide is in the HTML before any JavaScript runs. */}
      <HeroCarousel
        labels={{
          carousel: common.carouselSlide,
          previous: common.carouselPrev,
          next: common.carouselNext,
          pause: common.carouselPause,
          play: common.carouselPlay,
          goTo: common.carouselGoTo,
        }}
        slides={[
          {
            art: heroArt("hero", locale, true),
            eyebrow: tagline[locale],
            title: home.heroTitle,
            body: home.heroBody,
            ctas: [
              { href: p("/plan-your-visit"), label: common.planVisit },
              { href: p("/sermons"), label: common.listenSermon, variant: "outline" },
            ],
          },
          {
            art: heroArt("heroScripture", locale),
            title:
              locale === "sw"
                ? "Mimi ndimi nuru ya ulimwengu. Yeye anifuataye hatakwenda gizani kamwe, bali atakuwa na nuru ya uzima"
                : "I am the light of the world. If you follow me, you won’t have to walk in darkness, because you will have the light that leads to life",
            reference: "John 8:12",
            body: "",
          },
          {
            art: heroArt("heroWelcome", locale),
            eyebrow: home.welcomeEyebrow,
            title: home.welcomeTitle,
            body: home.welcomeBody,
            ctas: [{ href: p("/about-us"), label: common.learnMore }],
          },
        ]}
      />

      {andrew && (
        <section className="bg-wash section">
          <div className="shell grid-2 grid-2-align">
            <div>
              <p className="eyebrow">{home.andrewEyebrow}</p>
              <h2 className="t-section" style={{ marginTop: "var(--s-1)" }}>
                {home.andrewTitle}
              </h2>
              <p className="t-body" style={{ marginTop: "var(--s-5)" }}>
                {home.andrewBody1}
              </p>
              <p className="t-body" style={{ marginTop: "var(--s-4)" }}>
                {home.andrewBody2}
              </p>
              <div style={{ marginTop: "var(--s-8)" }}>
                <Button href={p(`/ministries/${andrew.slug}`)}>{home.andrewCta}</Button>
              </div>
            </div>
            <div className="card-panel">
              <h3 className="t-sub">{home.soulsTitle}</h3>
              <p className="t-body" style={{ marginTop: "var(--s-4)" }}>
                {home.soulsBody}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow={home.ministriesEyebrow} title={home.ministriesTitle} />
          <div className="grid-cards" style={{ marginTop: "var(--s-12)" }}>
            {ministries.slice(0, 6).map((m) => (
              <MinistryCard key={m.slug} ministry={m} locale={locale} />
            ))}
          </div>
          <div className="center" style={{ marginTop: "var(--s-10)" }}>
            <Button href={p("/ministries")}>{common.allMinistries}</Button>
          </div>
        </div>
      </section>

      <section className="bg-dark section">
        <div className="shell">
          <Scripture reference="Matthew 11:28-30">
            {locale === "sw"
              ? "Njoni kwangu, ninyi nyote msumbukao na wenye kulemewa na mizigo, nami nitawapumzisha. Jitieni nira yangu, mjifunze kwangu; kwa kuwa mimi ni mpole na mnyenyekevu wa moyo; nanyi mtapata raha nafsini mwenu"
              : "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls"}
          </Scripture>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow={home.eventsEyebrow} title={home.eventsTitle} />
          <div className="grid-cards" style={{ marginTop: "var(--s-12)" }}>
            {latestEvents.map((e) => (
              <EventCard key={e.slug} event={e} locale={locale} />
            ))}
          </div>
          <div className="center" style={{ marginTop: "var(--s-10)" }}>
            <Button href={p("/events")}>{common.seeAll}</Button>
          </div>
        </div>
      </section>

      {latestSermon && (
        <section className="bg-sunk section">
          <div className="measure">
            <SectionHeading eyebrow={home.sermonEyebrow} title={home.sermonTitle} />
            <div style={{ marginTop: "var(--s-12)" }}>
              <SermonCard sermon={latestSermon} locale={locale} />
            </div>
            <div className="center" style={{ marginTop: "var(--s-10)" }}>
              <Button href={p("/sermons")}>{dict.nav.sermons}</Button>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow={home.blogEyebrow} title={home.blogTitle} />
          <div className="grid-cards" style={{ marginTop: "var(--s-12)" }}>
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
          <div className="center" style={{ marginTop: "var(--s-10)" }}>
            <Button href={p("/blog")}>{dict.nav.blog}</Button>
          </div>
        </div>
      </section>

      <section className="bg-accent section">
        <div className="measure center">
          {/* Pure white on this red is 4.78:1 — AA. Do not soften it. */}
          <h2 className="t-section on-dark">{home.givingTitle}</h2>
          <p className="t-body on-dark" style={{ marginTop: "var(--s-4)" }}>
            {home.givingBody}
          </p>
          <div className="btn-group row-center" style={{ marginTop: "var(--s-8)" }}>
            <Button href={p("/give")} variant="outline">
              {common.giveNow}
            </Button>
            <Button href={site.giving.causesUrl} variant="outline" external>
              {common.ourCauses}
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="measure measure-wide">
          <SectionHeading eyebrow={home.servicesEyebrow} title={home.servicesTitle} />
          <div className="grid-2" style={{ marginTop: "var(--s-12)" }}>
            <ServiceColumn title={common.sunday} slots={sundayServices} locale={locale} />
            <ServiceColumn title={common.duringWeek} slots={weeklyServices} locale={locale} />
          </div>
          <p className="t-body center" style={{ marginTop: "var(--s-10)" }}>
            {home.servicesOutro}{" "}
            <Link href={p("/contact-us")} className="link-inline">
              {common.getInTouch}
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

function ServiceColumn({
  title,
  slots,
  locale,
}: {
  title: string;
  slots: ServiceSlot[];
  locale: Locale;
}) {
  return (
    <div>
      <h3 className="label">{title}</h3>
      <ul className="list-divided" style={{ marginTop: "var(--s-4)" }}>
        {slots.map((s) => (
          <li key={t(s.name, "en")}>
            <p className="strong">{t(s.name, locale)}</p>
            <p className="t-small">
              {t(s.time, locale)}
              {s.note && (
                <span style={{ color: "var(--brand-700)" }}> · {t(s.note, locale)}</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The artwork behind one hero slide.
 *
 * Returns nothing at all when no file has been supplied — which is every slot
 * today. The slide's own gradient carries it, and no stock face or generated
 * "congregation" stands in for people who have not been photographed. Drop a
 * file into /public/photos and set `src` in content/photos.ts and it appears
 * here with no other change.
 */
function heroArt(
  name: "hero" | "heroScripture" | "heroWelcome",
  locale: Locale,
  priority = false,
) {
  if (!hasPhoto(photos[name])) return undefined;
  return (
    <div className="hero-photo" aria-hidden>
      <Photo name={name} locale={locale} sizes="100vw" priority={priority} />
    </div>
  );
}
