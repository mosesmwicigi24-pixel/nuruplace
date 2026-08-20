import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Scripture, SectionHeading } from "@/components/ui";
import { EventCard, MinistryCard, PostCard, SermonCard } from "@/components/cards";
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
import { Photo } from "@/components/photo";
import { photos, hasPhoto } from "@/content/photos";

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
      <section className="relative overflow-hidden bg-ink-900 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(28,36,255,0.45),transparent_65%)]">
        {/* Renders nothing until a real photograph exists; the gradient above
            carries the hero on its own until then. */}
        {hasPhoto(photos.hero) && (
          <div className="absolute inset-0" aria-hidden>
            <Photo
              name="hero"
              locale={locale}
              sizes="100vw"
              priority
              className="size-full opacity-35"
            />
            <div className="absolute inset-0 bg-ink-900/55" />
          </div>
        )}
        <div className="shell relative py-24 text-center sm:py-32">
          <p className="t-lead font-display text-brand-300">{tagline[locale]}</p>
          <h1 className="t-hero mt-4 font-extrabold tracking-tight text-white">
            {home.heroTitle}
          </h1>
          <p className="t-lead mx-auto mt-6 max-w-[56ch] text-slate-300">
            {home.heroBody}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href={p("/plan-your-visit")}>{common.planVisit}</Button>
            <Button href={p("/sermons")} variant="outline">
              {common.listenSermon}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-brand-700 section-y">
        <div className="shell">
          <Scripture reference="John 8:12">
            {locale === "sw"
              ? "Mimi ndimi nuru ya ulimwengu. Yeye anifualaye hatakwenda gizani kamwe, bali atakuwa na nuru ya uzima"
              : "I am the light of the world. If you follow me, you won’t have to walk in darkness, because you will have the light that leads to life"}
          </Scripture>
        </div>
      </section>

      <section className="section-y">
        <div className="measure text-center">
          <SectionHeading eyebrow={home.welcomeEyebrow} title={home.welcomeTitle} />
          <p className="t-body mt-8 leading-relaxed text-ink-700">{home.welcomeBody}</p>
          <div className="mt-8">
            <Button href={p("/about-us")}>{common.learnMore}</Button>
          </div>
        </div>
      </section>

      {andrew && (
        <section className="bg-brand-50 section-y">
          <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="t-body font-display text-brand-600">{home.andrewEyebrow}</p>
              <h2 className="t-section mt-1 font-extrabold tracking-tight text-ink-900">
                {home.andrewTitle}
              </h2>
              <p className="t-body mt-5 leading-relaxed text-ink-700">{home.andrewBody1}</p>
              <p className="t-body mt-4 leading-relaxed text-ink-700">{home.andrewBody2}</p>
              <div className="mt-8">
                <Button href={p(`/ministries/${andrew.slug}`)}>{home.andrewCta}</Button>
              </div>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-white p-8">
              <h3 className="t-card font-bold text-ink-900">{home.soulsTitle}</h3>
              <p className="t-body mt-4 leading-relaxed text-ink-700">{home.soulsBody}</p>
            </div>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="shell">
          <SectionHeading eyebrow={home.ministriesEyebrow} title={home.ministriesTitle} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {ministries.slice(0, 6).map((m) => (
              <MinistryCard key={m.slug} ministry={m} locale={locale} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href={p("/ministries")}>{common.allMinistries}</Button>
          </div>
        </div>
      </section>

      <section className="bg-ink-900 section-y">
        <div className="shell">
          <Scripture reference="Matthew 11:28-30">
            {locale === "sw"
              ? "Njoni kwangu, ninyi nyote msumbukao na wenye kulemewa na mizigo, nami nitawapumzisha. Jitieni nira yangu, mjifunze kwangu; kwa kuwa mimi ni mpole na mnyenyekevu wa moyo; nanyi mtapata raha nafsini mwenu"
              : "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls"}
          </Scripture>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <SectionHeading eyebrow={home.eventsEyebrow} title={home.eventsTitle} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {latestEvents.map((e) => (
              <EventCard key={e.slug} event={e} locale={locale} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href={p("/events")}>{common.seeAll}</Button>
          </div>
        </div>
      </section>

      {latestSermon && (
        <section className="bg-slate-50 section-y">
          <div className="measure">
            <SectionHeading eyebrow={home.sermonEyebrow} title={home.sermonTitle} />
            <div className="mt-12">
              <SermonCard sermon={latestSermon} locale={locale} />
            </div>
            <div className="mt-10 text-center">
              <Button href={p("/sermons")}>{dict.nav.sermons}</Button>
            </div>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="shell">
          <SectionHeading eyebrow={home.blogEyebrow} title={home.blogTitle} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href={p("/blog")}>{dict.nav.blog}</Button>
          </div>
        </div>
      </section>

      <section className="bg-accent-500 section-y">
        <div className="measure text-center">
          <h2 className="t-section font-extrabold tracking-tight text-white">
            {home.givingTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-white">{home.givingBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={site.giving.url} variant="outline" external>
              {common.giveNow}
            </Button>
            <Button href={site.giving.causesUrl} variant="outline" external>
              {common.ourCauses}
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="measure !max-w-5xl">
          <SectionHeading eyebrow={home.servicesEyebrow} title={home.servicesTitle} />
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">
                {common.sunday}
              </h3>
              <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
                {sundayServices.map((s) => (
                  <li key={t(s.name, "en")} className="py-4">
                    <p className="font-bold text-ink-900">{t(s.name, locale)}</p>
                    <p className="text-sm text-ink-700">
                      {t(s.time, locale)}
                      {s.note && (
                        <span className="text-brand-700"> · {t(s.note, locale)}</span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">
                {common.duringWeek}
              </h3>
              <ul className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
                {weeklyServices.map((s) => (
                  <li key={t(s.name, "en")} className="py-4">
                    <p className="font-bold text-ink-900">{t(s.name, locale)}</p>
                    <p className="text-sm text-ink-700">
                      {t(s.time, locale)}
                      {s.note && (
                        <span className="text-brand-700"> · {t(s.note, locale)}</span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 text-center text-ink-700">
            {home.servicesOutro}{" "}
            <Link
              href={p("/contact-us")}
              className="font-bold text-brand-600 hover:text-brand-700"
            >
              {common.getInTouch}
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
