import Image from "next/image";
import { hasPhoto, photos, type Photo } from "@/content/photos";
import { t } from "@/content/localized";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Renders a photograph when one exists and nothing at all when it does not,
 * so a missing file degrades to the page's colour treatment rather than a
 * broken image or a grey box.
 *
 * `sizes` is required rather than optional: without it Next serves the widest
 * candidate to every device, and on a Kenyan data bundle that difference is
 * money.
 */
export function Photo({
  name,
  locale,
  sizes,
  className,
  priority,
}: {
  name: keyof typeof photos;
  locale: Locale;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const photo: Photo | undefined = photos[name];
  if (!hasPhoto(photo)) return null;

  return (
    <Image
      src={photo.src}
      alt={t(photo.alt, locale)}
      width={photo.width ?? 1600}
      height={photo.height ?? 900}
      sizes={sizes}
      priority={priority}
      // Everything below the fold waits until it is nearly on screen.
      loading={priority ? undefined : "lazy"}
      className={cn("object-cover", className)}
    />
  );
}
