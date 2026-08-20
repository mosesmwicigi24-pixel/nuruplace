"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { t } from "@/content/localized";
import type { GalleryImage } from "@/content/gallery";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";

/**
 * A photo grid whose images open in a lightbox.
 *
 * The lightbox is a real dialog: Escape closes it, arrows move between photos,
 * focus moves into it on open and returns to the thumbnail that opened it on
 * close, and the page behind it stops scrolling. A viewer that only works with
 * a mouse would exclude exactly the people the accessibility work elsewhere in
 * this site was for.
 */
export function GalleryGrid({
  images,
  locale,
}: {
  images: GalleryImage[];
  locale: Locale;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const dict = getDictionary(locale);

  const close = useCallback(() => {
    setOpenIndex(null);
    // Send focus back where it came from, or the keyboard user is dumped at
    // the top of the document.
    returnFocusRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((i) =>
        i === null ? null : (i + delta + images.length) % images.length,
      );
    },
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }

    document.addEventListener("keydown", onKey);
    // Stop the page behind scrolling under the overlay.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [openIndex, close, step]);

  if (images.length === 0) return null;

  const open = openIndex === null ? null : images[openIndex];

  return (
    <>
      <ul className="gallery-grid">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              className="gallery-thumb"
              onClick={(e) => {
                returnFocusRef.current = e.currentTarget;
                setOpenIndex(i);
              }}
            >
              <Image
                src={image.src}
                alt={t(image.alt, locale)}
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t(open.alt, locale)}
          tabIndex={-1}
          ref={dialogRef}
          onClick={(e) => {
            // Click the backdrop, not the photo, to dismiss.
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={close}
            aria-label={dict.common.close}
          >
            <X className="icon-lg" aria-hidden />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={() => step(-1)}
              aria-label={dict.common.previous}
            >
              <ChevronLeft className="icon-lg" aria-hidden />
            </button>
          )}

          <figure className="lightbox-figure">
            <Image
              src={open.src}
              alt={t(open.alt, locale)}
              width={open.width}
              height={open.height}
              sizes="90vw"
              priority
            />
            <figcaption>{t(open.alt, locale)}</figcaption>
          </figure>

          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={() => step(1)}
              aria-label={dict.common.next}
            >
              <ChevronRight className="icon-lg" aria-hidden />
            </button>
          )}
        </div>
      )}
    </>
  );
}
