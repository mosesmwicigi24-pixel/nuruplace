import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Mic } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { localePath, type Locale } from "@/i18n/config";
import type { Ministry } from "@/content/ministries";
import type { ChurchEvent } from "@/content/events";
import type { Sermon } from "@/content/sermons";
import type { Post } from "@/content/posts";

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
    <article className="card">
      {ministry.cover && (
        <Link href={href} className="card-media">
          <Image
            src={ministry.cover.src}
            alt={t(ministry.cover.alt, locale)}
            width={ministry.cover.width}
            height={ministry.cover.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
      )}
      <h3 className="t-card card-title">
        <Link href={href}>{t(ministry.name, locale)}</Link>
      </h3>
      <p className="t-body card-body">{t(ministry.summary, locale)}</p>
      <Link href={href} className="link t-small" style={{ marginTop: "var(--s-4)" }}>
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
    <article className="card">
      <h3 className="t-card card-title">{t(event.title, locale)}</h3>
      <dl className="card-meta">
        <div>
          <CalendarDays className="icon" aria-hidden />
          <dt className="sr-only">{dict.common.date}</dt>
          <dd>
            <time dateTime={event.date}>{formatDate(event.date, locale)}</time> ·{" "}
            {event.timeLabel}
          </dd>
        </div>
        <div>
          <MapPin className="icon" aria-hidden />
          <dt className="sr-only">{dict.common.location}</dt>
          <dd>{event.location}</dd>
        </div>
      </dl>
      <p className="t-body card-body">{t(event.summary, locale)}</p>
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
    <article className="card">
      <h3 className="t-card card-title">{t(sermon.title, locale)}</h3>
      <dl className="card-meta">
        <div>
          <Mic className="icon" aria-hidden />
          <dt className="sr-only">{dict.common.speaker}</dt>
          <dd>{t(sermon.speaker, locale)}</dd>
        </div>
        <div>
          <CalendarDays className="icon" aria-hidden />
          <dt className="sr-only">{dict.common.date}</dt>
          <dd>
            <time dateTime={sermon.date}>{formatDate(sermon.date, locale)}</time>
          </dd>
        </div>
      </dl>
      {sermon.scripture && <p className="card-scripture">{sermon.scripture}</p>}
      <p className="t-body card-body">{t(sermon.summary, locale)}</p>
    </article>
  );
}

export function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const dict = getDictionary(locale);
  const href = localePath(locale, `/blog/${post.slug}`);
  return (
    <article className="card">
      <p className="label card-date">
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
      </p>
      <h3 className="t-card card-title">
        <Link href={href}>{t(post.title, locale)}</Link>
      </h3>
      <p className="t-body card-body">{t(post.excerpt, locale)}</p>
      <Link href={href} className="link t-small" style={{ marginTop: "var(--s-4)" }}>
        {dict.common.continueReading} →
      </Link>
    </article>
  );
}
