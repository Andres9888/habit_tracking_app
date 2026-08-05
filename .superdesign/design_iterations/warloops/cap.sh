#!/bin/zsh
# cap.sh URL OUT W H [SCALE] [BUDGET_MS]
# Genuine-browser capture via Chrome for Testing (headless), waits for async React/Babel via virtual-time-budget.
CFT="/Users/andres/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
URL="$1"; OUT="$2"; W="${3:-460}"; H="${4:-860}"; SCALE="${5:-2}"; BUDGET="${6:-9000}"
PROF=$(mktemp -d)
"$CFT" --headless=new --disable-gpu --hide-scrollbars --no-sandbox \
  --user-data-dir="$PROF" \
  --force-device-scale-factor="$SCALE" \
  --window-size="$W,$H" \
  --virtual-time-budget="$BUDGET" \
  --run-all-compositor-stages-before-draw \
  --screenshot="$OUT" "$URL" >/dev/null 2>&1
rm -rf "$PROF"
[ -f "$OUT" ] && echo "OK $OUT" || echo "FAIL $OUT"
