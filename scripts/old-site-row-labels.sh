#!/usr/bin/env bash
# Dump every short text column for the content tables, so each row can be
# identified. The image map gave filenames against row ids; without the names
# those ids are meaningless and matching falls back to guessing at filenames.
set -uo pipefail
DB=${1:-nuruplace}
MYSQL=(mysql --batch --raw --skip-column-names)
[ -n "${DB_USER:-}" ] && MYSQL+=(-u "$DB_USER")
if [ -z "${DB_PASS:-}" ] && [ ! -r "$HOME/.my.cnf" ]; then
  read -rsp "MySQL password for ${DB_USER:-$(id -un)}: " DB_PASS < /dev/tty; echo
fi
[ -n "${DB_PASS:-}" ] && MYSQL+=(-p"$DB_PASS")

for tbl in ministries sermons events blog team_members sermon_series departments announcements; do
  cols=$("${MYSQL[@]}" -e "
    SELECT GROUP_CONCAT(CONCAT('\`',column_name,'\`') ORDER BY ordinal_position SEPARATOR ', ')
      FROM information_schema.columns
     WHERE table_schema='$DB' AND table_name='$tbl'
       AND data_type IN ('varchar','char')
       AND character_maximum_length BETWEEN 1 AND 255
       AND column_name NOT REGEXP 'image|photo|thumb|slug|url|password|token';" < /dev/null 2>/dev/null)
  [ -z "$cols" ] || [ "$cols" = "NULL" ] && continue
  key=$("${MYSQL[@]}" -e "SELECT column_name FROM information_schema.columns
     WHERE table_schema='$DB' AND table_name='$tbl' AND column_key='PRI' LIMIT 1;" < /dev/null 2>/dev/null)
  echo "== $tbl"
  "${MYSQL[@]}" -e "SELECT CONCAT_WS(' | ', ${key:-"''"}, $cols) FROM \`$DB\`.\`$tbl\` LIMIT 40;" < /dev/null 2>/dev/null | sed 's/^/   /'
  echo
done
