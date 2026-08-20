"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { t } from "@/content/localized";
import { embedUrl, posterUrl, watchUrl, type Video } from "@/content/videos";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";

/**
 * A click-to-load video facade.
 *
 * Rendering a live provider iframe costs a visitor roughly a megabyte before
 * they have watched a second of anything, and sets the provider's cookies on
 * a church website whether or not they wanted that. So this renders a poster
 * and a play button, and only mounts the iframe once someone asks.
 *
 * On a Kenyan data bundle the difference is money, and most of it would have
 * been spent by people who were only scrolling past.
 */
export function VideoEmbed({
  video,
  locale,
}: {
  video: Video;
  locale: Locale;
}) {
  const [playing, setPlaying] = useState(false);
  const dict = getDictionary(locale);
  const title = t(video.title, locale);
  const poster = posterUrl(video);

  if (playing) {
    return (
      <div className="video-frame">
        <iframe
          src={embedUrl(video)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="video-frame">
      <button
        type="button"
        className="video-facade"
        onClick={() => setPlaying(true)}
        // The accessible name has to carry the title; "play" alone tells a
        // screen-reader user nothing about which video they are on.
        aria-label={`${dict.common.play}: ${title}`}
        style={
          poster ? { backgroundImage: `url("${poster}")` } : undefined
        }
      >
        <span className="video-play" aria-hidden>
          <Play className="icon-lg" />
        </span>
      </button>
      <p className="hint video-fallback">
        {dict.common.videoBlocked}{" "}
        <a
          href={watchUrl(video)}
          target="_blank"
          rel="noopener noreferrer"
          className="link-inline"
        >
          {dict.common.watchThere}
        </a>
      </p>
    </div>
  );
}
