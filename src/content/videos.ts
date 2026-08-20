import type { Localized } from "./localized";

/**
 * Recorded services, worship evenings and teaching.
 *
 * Videos are referenced by provider id rather than embedded markup, so the
 * page can render a lightweight facade (a thumbnail and a play button) and
 * only load the provider's player when someone actually asks for it. A page of
 * live YouTube iframes costs a visitor several megabytes before they have
 * watched anything — on a Kenyan data bundle that is real money, and most of
 * it is spent by people who were only scrolling past.
 */
export type VideoProvider = "youtube" | "vimeo";

export type Video = {
  slug: string;
  provider: VideoProvider;
  /** The provider's id — the part after v= on YouTube, or the numeric Vimeo id. */
  videoId: string;
  title: Localized<string>;
  /** ISO date, used for ordering. */
  date: string;
  description: Localized<string>;
  /** Rough runtime, shown so people know what they are committing to. */
  duration?: string;
};

export const videos: Video[] = [];

/** Poster image for a video, served by the provider so we store no files. */
export function posterUrl(video: Video): string {
  return video.provider === "youtube"
    ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
    : // Vimeo requires an API call for thumbnails; until one is wired up the
      // facade falls back to its own gradient rather than a broken image.
      "";
}

/** The URL the facade swaps in once the visitor clicks play. */
export function embedUrl(video: Video): string {
  return video.provider === "youtube"
    ? // youtube-nocookie and autoplay=1: no tracking cookie until they choose
      // to watch, and the click that loaded it is also the click that starts it.
      `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${video.videoId}?autoplay=1`;
}

/** Where to send someone if the embed is blocked on their network. */
export function watchUrl(video: Video): string {
  return video.provider === "youtube"
    ? `https://www.youtube.com/watch?v=${video.videoId}`
    : `https://vimeo.com/${video.videoId}`;
}
