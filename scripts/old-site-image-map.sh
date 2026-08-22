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
# -p with no value makes mysql PROMPT. Without it, `mysql -u webmaster` just
# fails to authenticate — and the first version of this script sent that error
# to /dev/null and reported "no image-like columns found", which sent the
# reader looking for the wrong problem entirely.
# Ask ONCE and reuse. `-p` makes every mysql invocation prompt separately, and
# each prompt reads from stdin — which is the loop's own input further down, so
# the second table onwards silently gets eaten. The first version of this
# returned 1 mapping instead of 8 for exactly that reason.
if [ -z "${DB_PASS:-}" ] && [ ! -r "$HOME/.my.cnf" ]; then
  read -rsp "MySQL password for ${DB_USER:-$(id -un)}: " DB_PASS < /dev/tty
  echo
fi
[ -n "${DB_PASS:-}" ] && MYSQL+=(-p"$DB_PASS")

# Prove the connection works before doing anything else, and say plainly what
# went wrong if it does not.
if ! err=$("${MYSQL[@]}" -e "SELECT 1;" < /dev/null 2>&1 >/dev/null); then
  echo "Could not connect to MySQL as '${DB_USER:-$(id -un)}':" >&2
  printf '  %s\n' "$err" >&2
  exit 1
fi
if ! "${MYSQL[@]}" -e "USE \`$DB\`;" 2>/dev/null; then
  echo "Connected, but database '$DB' is not readable by '${DB_USER:-$(id -un)}'." >&2
  echo "Databases this account CAN see:" >&2
  "${MYSQL[@]}" -e "SHOW DATABASES;" 2>/dev/null | sed 's/^/  /' >&2
  exit 1
fi

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
   ORDER BY table_name, column_name;" < /dev/null)

if [ -z "$cols" ]; then
  echo "Connected to '$DB' fine, but no column name matched image/photo/cover/..." >&2
  echo "Tables present:" >&2
  "${MYSQL[@]}" -e "SHOW TABLES FROM \`$DB\`;" 2>/dev/null | sed 's/^/  /' >&2
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
     LIMIT 1;" < /dev/null 2>/dev/null)
  key=$("${MYSQL[@]}" -e "
    SELECT column_name FROM information_schema.columns
     WHERE table_schema='$DB' AND table_name='$tbl' AND column_key='PRI' LIMIT 1;" < /dev/null 2>/dev/null)
  sel_label=${label:-"''"}
  sel_key=${key:-"''"}
  "${MYSQL[@]}" -e "
    SELECT '$tbl', '$col', COALESCE($sel_key,''), COALESCE($sel_label,''), \`$col\`
      FROM \`$DB\`.\`$tbl\`
     WHERE \`$col\` IS NOT NULL AND \`$col\` <> '';" < /dev/null >> "$OUT" 2>>"$OUT.err"
done <<< "$cols"

rows=$(($(wc -l < "$OUT") - 1))
echo "wrote $rows mappings to $OUT"
echo
echo "by table:"
tail -n +2 "$OUT" | cut -f1 | sort | uniq -c | sort -rn | sed 's/^/  /'
