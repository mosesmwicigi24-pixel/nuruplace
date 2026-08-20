import type { Localized } from "./localized";

/**
 * Photo galleries, grouped into albums.
 *
 * As with src/content/photos.ts, nothing is bundled and nothing is invented.
 * An album with no photographs renders as a labelled empty state rather than
 * a broken grid, so the page is honest about what the church has published so
 * far instead of filling itself with stock images of other people's churches.
 *
 * To add photographs: put the files in /public/gallery/<album-slug>/, list them
 * below, and read public/photos/README.md first — it covers sizing for metered
 * connections and the consent rule about children.
 */
export type GalleryImage = {
  /** Path under /public, e.g. "/gallery/commissioning/entrance.jpg". */
  src: string;
  /** Describe what is happening, not "church photo". Required. */
  alt: Localized<string>;
  /** Intrinsic size, so the grid reserves space and nothing jumps. */
  width: number;
  height: number;
};

export type Album = {
  slug: string;
  title: Localized<string>;
  /** ISO date of the occasion, used for ordering. */
  date: string;
  description: Localized<string>;
  images: GalleryImage[];
};

export const albums: Album[] = [
  {
    slug: "church-commissioning",
    title: { en: "Church Commissioning", sw: "Uzinduzi wa Kanisa" },
    date: "2018-12-09",
    description: {
      en: "The day the building at Saika was commissioned, and the congregation walked in for the first time.",
      sw: "Siku jengo la Saika lilipozinduliwa, na kusanyiko likaingia ndani kwa mara ya kwanza.",
    },
    images: [],
  },
  {
    slug: "ablaze-worship-experience",
    title: { en: "Ablaze Worship Experience", sw: "Tukio la Ibada la Ablaze" },
    date: "2022-10-23",
    description: {
      en: "An evening of open worship — singers, instrumentalists, and a room that did not want to leave.",
      sw: "Jioni ya ibada ya wazi — waimbaji, wapiga ala, na chumba ambacho hakikutaka kuondoka.",
    },
    images: [],
  },
  {
    slug: "sunday-gatherings",
    title: { en: "Sunday Gatherings", sw: "Makusanyiko ya Jumapili" },
    date: "2026-08-01",
    description: {
      en: "Ordinary Sundays at Saika — arriving, worshipping, and the long conversations afterwards.",
      sw: "Jumapili za kawaida Saika — kuwasili, kuabudu, na mazungumzo marefu baadaye.",
    },
    images: [],
  },
];

export function getAlbum(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug);
}

/** True once at least one album has photographs in it. */
export function galleryHasImages(): boolean {
  return albums.some((a) => a.images.length > 0);
}
