#!/usr/bin/env bash
#
# Which image belongs to which piece of content?
#
# The 82 files recovered from /var/www/nuruplace are only half the story. The
# old CodeIgniter site kept the ASSOCIATIONS in MySQL — sermon 4 has this cover,
# the Watchnight vigil has that photograph. Without them every image has to be
# matched by guessing at its filename, and a guess that looks plausible is worse
# than an empty slot: nobody checks it again.
#
# Self-discovering on purpose. Rather than assume table names, it asks
# information_schema which columns look like image references and dumps every
# non-empty value with whatever the row calls itself. That way it works whatever
# the old developer named things.
#
#   ./mapq.sh nuruplace            # reads ~/.my.cnf or prompts
#   DB_USER=webmaster ./mapq.sh nuruplace
set -uo pipefail

DB=${1:-nuruplace}
OUT=${2:-/root/nuruplace-image-map.tsv}
MYSQL=(mysql --batch --raw --skip-column-names)
[ -n "${DB_USER:-}" ] && MYSQL+=(-u "$DB_USER")
[ -n "${DB_PASS:-}" ] && MYSQL+=(-p"$DB_PASS")

# Columns whose NAME suggests an image, in tables that hold content rather than
# framework plumbing. ci_sessions and migrations have nothing to say about which
# picture belongs to which sermon.
cols=$("${MYSQL[@]}" -e "
  SELECT CONCAT(table_name,'\t',column_name)
    FROM information_schema.columns
   WHERE table_schema = '$DB'
     AND data_type IN ('varchar','text','char')
     AND (column_name REGEXP 'image|photo|picture|cover|thumb|banner|slider|logo|avatar')
     AND table_name NOT REGEXP '^(ci_sessions|migrations|sessions)$'
   ORDER BY table_name, column_name;" 2>/dev/null)

if [ -z "$cols" ]; then
  echo "No image-like columns found in '$DB'. Is the database name right?" >&2
  exit 1
fi

printf 'table\tcolumn\trow_id\tlabel\timage\n' > "$OUT"

while IFS=$'\t' read -r tbl col; do
  [ -z "$tbl" ] && continue
  # A human-readable label for the row: whichever of these the table happens to
  # have. Without it the map is a list of numbers and filenames.
  label=$("${MYSQL[@]}" -e "
    SELECT column_name FROM information_schema.columns
     WHERE table_schema='$DB' AND table_name='$tbl'
       AND column_name IN ('title','name','caption','heading','subject','label')
     ORDER BY FIELD(column_name,'title','name','caption','heading','subject','label')
     LIMIT 1;" 2>/dev/null)
  key=$("${MYSQL[@]}" -e "
    SELECT column_name FROM information_schema.columns
     WHERE table_schema='$DB' AND table_name='$tbl' AND column_key='PRI' LIMIT 1;" 2>/dev/null)
  sel_label=${label:-"''"}
  sel_key=${key:-"''"}
  "${MYSQL[@]}" -e "
    SELECT '$tbl', '$col', COALESCE($sel_key,''), COALESCE($sel_label,''), \`$col\`
      FROM \`$DB\`.\`$tbl\`
     WHERE \`$col\` IS NOT NULL AND \`$col\` <> '';" >> "$OUT" 2>>"$OUT.err"
done <<< "$cols"

rows=$(($(wc -l < "$OUT") - 1))
echo "wrote $rows mappings to $OUT"
echo
echo "by table:"
tail -n +2 "$OUT" | cut -f1 | sort | uniq -c | sort -rn | sed 's/^/  /'
