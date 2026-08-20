import Link from "next/link";
import { cn } from "@/lib/utils";
import type { StaticPage } from "@/content/pages";
import { t } from "@/content/localized";
import type { Locale } from "@/i18n/config";

/** Banner at the top of every inner page. */
export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-hero-page">
      <div className="shell page-hero">
        <h1 className="t-page on-dark">{title}</h1>
        {subtitle && (
          <p className="t-lead page-hero-sub on-dark-soft">{subtitle}</p>
        )}
      </div>
    </section>
  );
}

/** Centred heading used above home page sections. */
export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="t-section">{title}</h2>
      <span className="rule" aria-hidden />
    </div>
  );
}

/** Pull-quote for scripture. */
export function Scripture({
  reference,
  children,
}: {
  reference: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="scripture">
      <blockquote className="t-quote on-dark">“{children}”</blockquote>
      <figcaption>
        <cite>{reference}</cite>
      </figcaption>
    </figure>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "accent" | "outline";
  external?: boolean;
}) {
  const className = cn("btn", `btn-${variant}`);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Renders a StaticPage from src/content/pages.ts as article prose. */
export function StaticPageBody({
  page,
  locale,
}: {
  page: StaticPage;
  locale: Locale;
}) {
  return (
    <article className="measure section prose">
      {page.sections.map((section, i) => (
        <section key={i}>
          {section.heading && <h2>{t(section.heading, locale)}</h2>}
          {section.paragraphs &&
            t(section.paragraphs, locale).map((p, j) => (
              <p key={j} className="t-body">
                {p}
              </p>
            ))}
          {section.bullets && (
            <ul className="bullets">
              {t(section.bullets, locale).map((b, j) => (
                <li key={j} className="t-body">
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}

/** Placeholder for pages whose content has not been supplied yet. */
export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="empty shell">
      <h2 className="t-sub">{title}</h2>
      <p className="t-body" style={{ marginTop: "var(--s-3)" }}>
        {message}
      </p>
    </div>
  );
}
