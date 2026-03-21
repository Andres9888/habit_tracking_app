#!/usr/bin/env bash
set -euo pipefail

BATCH_SIZE="${1:-500}"
CURSOR="${2:-}"
ITERATION=0
TOTAL_MIGRATED=0
TOTAL_SKIPPED=0

while true; do
  ITERATION=$((ITERATION + 1))

  if [ -z "$CURSOR" ]; then
    REQUEST="{\"batchSize\":$BATCH_SIZE}"
  else
    REQUEST="{\"batchSize\":$BATCH_SIZE,\"cursor\":\"$CURSOR\"}"
  fi

  RESPONSE="$(npx convex run migration:normalizeHabitReminderTimes "$REQUEST")"
  RESULT="$(printf '%s\n' "$RESPONSE" | tail -n 1)"

  read -r MIGRATED SKIPPED SCANNED IS_DONE CONTINUE_CURSOR < <(
    printf '%s' "$RESULT" | node <<'NODE'
const fs = require('node:fs');
const input = fs.readFileSync(0, 'utf8').trim();

if (!input) {
  process.exit(1);
}

const payload = JSON.parse(input);
process.stdout.write(
  `${payload.migrated || 0} ${payload.skipped || 0} ${payload.scanned || 0} ${payload.isDone ? 1 : 0} ${payload.continueCursor || ''}`
);
NODE
  )

  TOTAL_MIGRATED=$((TOTAL_MIGRATED + MIGRATED))
  TOTAL_SKIPPED=$((TOTAL_SKIPPED + SKIPPED))

  echo "Batch $ITERATION: migrated=$MIGRATED skipped=$SKIPPED scanned=$SCANNED"

  if [ "$IS_DONE" -eq 1 ]; then
    echo "Migration complete. Total migrated=$TOTAL_MIGRATED, total skipped=$TOTAL_SKIPPED, batches=$ITERATION."
    break
  fi

  CURSOR="$CONTINUE_CURSOR"
done
