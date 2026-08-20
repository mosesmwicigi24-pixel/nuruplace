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
    <section className="bg-ink-900 bg-[radial-gradient(ellipse_at_top_right,rgba(28,36,255,0.35),transparent_60%)]">
      <div className="shell section-y">
        <h1 className="t-page font-extrabold tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="t-lead mt-4 max-w-[52ch] text-slate-300">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

/** Centred heading used above home page sections. */
export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      {eyebrow && (
        <p className="font-display text-brand-600 t-body">{eyebrow}</p>
      )}
      <h2 className="t-section mt-1 font-extrabold tracking-tight text-ink-900">
        {title}
      </h2>
      <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-accent-500" />
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
    <figure className="mx-auto max-w-[46ch] text-center 2xl:max-w-[56ch]">
      <blockquote className="t-quote font-display text-white">
        “{children}”
      </blockquote>
      <figcaption className="mt-4 text-sm font-bold uppercase tracking-widest text-brand-300">
        {reference}
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
  const classes = cn(
    "inline-block rounded-full px-6 py-3 text-sm font-bold transition-colors",
    variant === "primary" && "bg-brand-600 text-white hover:bg-brand-700",
    variant === "accent" && "bg-accent-500 text-white hover:bg-accent-600",
    variant === "outline" &&
      "border-2 border-white text-white hover:bg-white hover:text-ink-900",
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
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
    <article className="measure section-y">
      {page.sections.map((section, i) => (
        <section key={i} className={i > 0 ? "mt-12" : undefined}>
          {section.heading && (
            <h2 className="t-card font-extrabold tracking-tight text-ink-900">
              {t(section.heading, locale)}
            </h2>
          )}
          {section.paragraphs &&
            t(section.paragraphs, locale).map((p, j) => (
              <p key={j} className="t-body mt-4 leading-relaxed text-ink-700">
                {p}
              </p>
            ))}
          {section.bullets && (
            <ul className="mt-4 space-y-3">
              {t(section.bullets, locale).map((b, j) => (
                <li key={j} className="t-body flex gap-3 leading-relaxed text-ink-700">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600"
                    aria-hidden
                  />
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
    <div className="measure py-24 text-center">
      <h2 className="text-xl font-bold text-ink-900">{title}</h2>
      <p className="mt-3 leading-relaxed text-ink-700">{message}</p>
    </div>
  );
}
