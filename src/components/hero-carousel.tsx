"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * The homepage hero, as one carousel instead of three stacked bands.
 *
 * Auto-advancing carousels are one of the easiest things on the web to build
 * inaccessibly, so the rules that matter are enforced here rather than left to
 * a library:
 *
 *  - **A pause control (WCAG 2.2.2).** Anything that moves for more than five
 *    seconds must be stoppable. Someone using a screen magnifier, or reading
 *    slowly, or translating as they go, loses the sentence when it slides away.
 *  - **prefers-reduced-motion stops it entirely** — no auto-advance and no
 *    sliding transition. For a vestibular disorder that is not a preference.
 *  - **Hover and keyboard focus pause it.** Reading or tabbing through a slide
 *    that vanishes mid-sentence is the single most common complaint about
 *    carousels, and it is trivial to prevent.
 *  - **Every slide stays in the DOM**, hidden with `inert` rather than removed,
 *    so assistive tech announces a stable structure and Google indexes all
 *    three — this is the church's front page and its copy should be findable.
 *
 * The first slide is server-rendered and visible before hydration, so the page
 * is never blank and works with JavaScript disabled (you simply get slide one,
 * which is the most important one).
 */

export type HeroSlide = {
  /** Small line above the title. */
  eyebrow?: string;
  title: string;
  body: string;
  /** Set for a scripture slide: rendered as a quotation with its reference. */
  reference?: string;
  ctas?: { href: string; label: string; variant?: "solid" | "outline" }[];
};

type Props = {
  slides: HeroSlide[];
  /** Rendered behind every slide — the hero photograph, when one exists. */
  backdrop?: React.ReactNode;
  labels: {
    /** e.g. "Slide {n} of {total}" */
    carousel: string;
    previous: string;
    next: string;
    pause: string;
    play: string;
    goTo: string;
  };
};

const INTERVAL_MS = 7000;

export function HeroCarousel({ slides, backdrop, labels }: Props) {
  const [index, setIndex] = useState(0);
  // Starts true so the very first paint matches the server. Auto-advance is
  // switched on in an effect, which never runs for a user who has asked for
  // reduced motion.
  const [paused, setPaused] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const region = useRef<HTMLDivElement>(null);

  const count = slides.length;
  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(mq.matches);
      setPaused(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused || userPaused || reducedMotion || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, userPaused, reducedMotion, count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  const running = !paused && !userPaused && !reducedMotion;

  return (
    <section
      className="bg-hero hero-carousel"
      aria-roledescription="carousel"
      aria-label={labels.carousel.replace("{n}", "").replace("{total}", String(count)).trim()}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(reducedMotion)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(reducedMotion);
      }}
    >
      {backdrop}

      <div
        ref={region}
        className="hero-track"
        // Polite, not assertive: a slide changing is never urgent enough to
        // interrupt whatever someone is already having read to them.
        aria-live={running ? "off" : "polite"}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className={`hero-slide${i === index ? " is-current" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={labels.carousel.replace("{n}", String(i + 1)).replace("{total}", String(count))}
            aria-hidden={i === index ? undefined : true}
            // inert keeps hidden slides out of the tab order and off the
            // accessibility tree without unmounting them. React 19 takes this
            // as a real boolean and omits the attribute when false.
            inert={i !== index}
          >
            <div className="shell hero-inner">
              {s.eyebrow && (
                <p className="t-lead eyebrow" style={{ color: "var(--brand-300)" }}>
                  {s.eyebrow}
                </p>
              )}
              {s.reference ? (
                <blockquote className="hero-quote">
                  <p className="t-hero on-dark hero-quote-text">{s.title}</p>
                  <cite className="on-dark-soft hero-quote-ref">{s.reference}</cite>
                </blockquote>
              ) : (
                <h1 className="t-hero on-dark" style={{ marginTop: "var(--s-4)" }}>
                  {s.title}
                </h1>
              )}
              {s.body && (
                <p
                  className="t-lead on-dark-soft"
                  style={{ maxWidth: "56ch", margin: "var(--s-6) auto 0" }}
                >
                  {s.body}
                </p>
              )}
              {s.ctas && s.ctas.length > 0 && (
                <div className="btn-group row-center" style={{ marginTop: "var(--s-10)" }}>
                  {s.ctas.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={c.variant === "outline" ? "btn btn-outline" : "btn"}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="hero-controls shell">
          <button type="button" className="hero-arrow" onClick={() => go(index - 1)} aria-label={labels.previous}>
            <span aria-hidden>&#8249;</span>
          </button>

          <div className="hero-dots" role="tablist" aria-label={labels.goTo}>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                className={`hero-dot${i === index ? " is-current" : ""}`}
                aria-selected={i === index}
                aria-label={labels.carousel.replace("{n}", String(i + 1)).replace("{total}", String(count))}
                onClick={() => go(i)}
              />
            ))}
          </div>

          {/* WCAG 2.2.2. Hidden when reduced motion already stopped everything —
              a pause button for something that is not moving is just confusing. */}
          {!reducedMotion && (
            <button
              type="button"
              className="hero-arrow hero-playpause"
              onClick={() => setUserPaused((v) => !v)}
              aria-label={userPaused ? labels.play : labels.pause}
            >
              <span aria-hidden>{userPaused ? "▶" : "‖"}</span>
            </button>
          )}

          <button type="button" className="hero-arrow" onClick={() => go(index + 1)} aria-label={labels.next}>
            <span aria-hidden>&#8250;</span>
          </button>
        </div>
      )}
    </section>
  );
}
