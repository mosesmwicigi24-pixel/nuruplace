#!/usr/bin/env bash
#
# Pull the church's OWN photographs out of the old CodeIgniter site, shrink them
# to something a phone on a Kenyan data bundle can afford, and package them for
# the new site.
#
# What it deliberately leaves behind:
#   assets/be/images/demo/**   the bootstrap theme's demo content. Ten of the
#                              largest files on that box are stock photographs
#                              of other people's churches. Shipping those is the
#                              exact lie this project has refused all along.
#   assets/fe/images/**        theme chrome, and duplicates of files that also
#                              live under uploads/ (the real copy).
#   pexels-*                   licensed stock someone used as an event cover.
#   anything under 40KB        icons, spacers, buttons.
#
# Everything kept comes from uploads/ — the directories the church's own admins
# uploaded into, named for what they hold.
#
# Sizes: the originals run to 7.6MB each. Nobody needs a 7MB JPEG on a phone,
# and Next/Image cannot rescue a repository that already carries 138MB of them.
# Longest edge 2000px, WebP q82 — visually indistinguishable on any screen this
# site targets, at roughly a fiftieth of the bytes.
set -uo pipefail

SRC=${1:-/var/www/nuruplace/uploads}
OUT=${2:-/root/nuruplace-images}
MAXEDGE=${MAXEDGE:-2000}
QUALITY=${QUALITY:-82}

command -v convert >/dev/null || { echo "need imagemagick: apt-get install -y imagemagick" >&2; exit 1; }

rm -rf "$OUT"; mkdir -p "$OUT"
MANIFEST="$OUT/MANIFEST.tsv"
printf 'category\tfile\torig_bytes\tnew_bytes\twidth\theight\n' > "$MANIFEST"

kept=0; skipped=0; before=0; after=0

# Deduplicate by content: several files exist twice (uploads/ and assets/fe/).
declare -A seen

while IFS= read -r -d '' f; do
  base=$(basename "$f")
  case "$base" in
    pexels-*|*placeholder*|*sample*) skipped=$((skipped+1)); continue ;;
  esac

  # thumbs/ BEFORE the checksum, not after. A thumbnail is byte-identical to
  # its full-size original often enough that registering its checksum first
  # makes the REAL image look like the duplicate and silently drops it. That is
  # how the homepage slider images disappeared from the first run of this.
  case "$f" in *"/thumbs/"*) skipped=$((skipped+1)); continue ;; esac

  # Dimensions, not bytes, decide whether this is a photograph. A 100x100 icon
  # can exceed any size threshold; it is still an icon.
  read -r w h < <(identify -format '%w %h' "$f" 2>/dev/null || echo "0 0")
  if [ "${w:-0}" -lt 700 ] && [ "${h:-0}" -lt 700 ]; then skipped=$((skipped+1)); continue; fi

  sum=$(md5sum "$f" | cut -d' ' -f1)
  if [ -n "${seen[$sum]:-}" ]; then skipped=$((skipped+1)); continue; fi
  seen[$sum]=1

  # Category = the uploads subdirectory, which is what the old admin called it.
  cat=$(dirname "${f#$SRC/}"); cat=${cat%%/*}
  [ "$cat" = "." ] && cat=misc

  mkdir -p "$OUT/$cat"
  # Lowercase, strip spaces, single extension.
  stem=$(printf '%s' "${base%.*}" | tr 'A-Z' 'a-z' | tr -cs 'a-z0-9' '-' | sed 's/^-//; s/-$//')
  dest="$OUT/$cat/$stem.webp"
  n=1; while [ -e "$dest" ]; do dest="$OUT/$cat/$stem-$n.webp"; n=$((n+1)); done

  osize=$(stat -c%s "$f")
  if convert "$f" -auto-orient -strip -resize "${MAXEDGE}x${MAXEDGE}>" \
       -quality "$QUALITY" "$dest" 2>/dev/null; then
    nsize=$(stat -c%s "$dest")
    dims=$(identify -format '%w\t%h' "$dest" 2>/dev/null || printf '?\t?')
    printf '%s\t%s\t%s\t%s\t%s\n' "$cat" "${dest#$OUT/}" "$osize" "$nsize" "$dims" >> "$MANIFEST"
    kept=$((kept+1)); before=$((before+osize)); after=$((after+nsize))
  else
    echo "  could not convert: $f" >&2
    skipped=$((skipped+1))
  fi
done < <(find "$SRC" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) -size +40k -print0)

echo
echo "kept    : $kept"
echo "skipped : $skipped  (duplicates, thumbs, stock, unconvertible)"
printf 'before  : %.1f MB\n' "$(echo "$before" | awk '{print $1/1048576}')"
printf 'after   : %.1f MB\n' "$(echo "$after" | awk '{print $1/1048576}')"
echo
echo "by category:"
tail -n +2 "$MANIFEST" | cut -f1 | sort | uniq -c | sort -rn | sed 's/^/  /'
echo
tar czf "$OUT.tar.gz" -C "$(dirname "$OUT")" "$(basename "$OUT")"
printf '\npackage : %s  (%s)\n' "$OUT.tar.gz" "$(du -h "$OUT.tar.gz" | cut -f1)"
