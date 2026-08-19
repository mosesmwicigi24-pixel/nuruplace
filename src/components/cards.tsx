import Link from "next/link";
import { CalendarDays, MapPin, Mic } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { localePath, type Locale } from "@/i18n/config";
import type { Ministry } from "@/content/ministries";
import type { ChurchEvent } from "@/content/events";
import type { Sermon } from "@/content/sermons";
import type { Post } from "@/content/posts";

const cardBase =
  "flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg";

export function MinistryCard({
  ministry,
  locale,
}: {
  ministry: Ministry;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const href = localePath(locale, `/ministries/${ministry.slug}`);
  return (
    <article className={cardBase}>
      <h3 className="text-lg font-bold text-ink-900">
        <Link href={href} className="hover:text-brand-700">
          {t(ministry.name, locale)}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">
        {t(ministry.summary, locale)}
      </p>
      <Link
        href={href}
        className="mt-4 text-sm font-bold text-brand-600 hover:text-brand-700"
      >
        {dict.common.readMore} →
      </Link>
    </article>
  );
}

export function EventCard({
  event,
  locale,
}: {
  event: ChurchEvent;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  return (
    <article className={cardBase}>
      <h3 className="text-lg font-bold text-ink-900">{t(event.title, locale)}</h3>
      <dl className="mt-3 space-y-1.5 text-sm text-ink-700">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-brand-600" aria-hidden />
          <dt className="sr-only">{dict.common.date}</dt>
          <dd>
            <time dateTime={event.date}>{formatDate(event.date, locale)}</time> ·{" "}
            {event.timeLabel}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-brand-600" aria-hidden />
          <dt className="sr-only">{dict.common.location}</dt>
          <dd>{event.location}</dd>
        </div>
      </dl>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">
        {t(event.summary, locale)}
      </p>
    </article>
  );
}

export function SermonCard({
  sermon,
  locale,
}: {
  sermon: Sermon;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  return (
    <article className={cardBase}>
      <h3 className="text-lg font-bold text-ink-900">{t(sermon.title, locale)}</h3>
      <dl className="mt-3 space-y-1.5 text-sm text-ink-700">
        <div className="flex items-center gap-2">
          <Mic className="size-4 shrink-0 text-brand-600" aria-hidden />
          <dt className="sr-only">{dict.common.speaker}</dt>
          <dd>{t(sermon.speaker, locale)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-brand-600" aria-hidden />
          <dt className="sr-only">{dict.common.date}</dt>
          <dd>
            <time dateTime={sermon.date}>{formatDate(sermon.date, locale)}</time>
          </dd>
        </div>
      </dl>
      {sermon.scripture && (
        <p className="mt-3 font-display text-brand-700">{sermon.scripture}</p>
      )}
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700">
        {t(sermon.summary, locale)}
      </p>
    </article>
  );
}

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const dict = getDictionary(locale);
  const href = localePath(locale, `/blog/${post.slug}`);
  return (
    <article className={cardBase}>
      <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
      </p>
      <h3 className="mt-2 text-lg font-bold text-ink-900">
        <Link href={href} className="hover:text-brand-700">
          {t(post.title, locale)}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">
        {t(post.excerpt, locale)}
      </p>
      <Link
        href={href}
        className="mt-4 text-sm font-bold text-brand-600 hover:text-brand-700"
      >
        {dict.common.continueReading} →
      </Link>
    </article>
  );
}
