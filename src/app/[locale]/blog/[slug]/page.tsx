import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { getPost, posts } from "@/content/posts";
import { t } from "@/content/localized";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, locales, localePath } from "@/i18n/config";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post || !isLocale(locale)) return {};
  return { title: t(post.title, locale), description: t(post.excerpt, locale) };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post || !isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero title={t(post.title, locale)} />
      <article className="measure section prose">
        <p className="t-small muted">
          {dict.common.by} {post.author} ·{" "}
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        </p>
        {t(post.body, locale).map((p, i) => (
          <p key={i} className="t-body">
            {p}
          </p>
        ))}
        <Link href={localePath(locale, "/blog")} className="link link-back">
          ← {dict.common.allArticles}
        </Link>
      </article>
    </>
  );
}
