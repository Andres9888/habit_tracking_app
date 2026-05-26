#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
D=:118
export DISPLAY="${D}"
HTML="file://${ROOT}/habit_library_transform_mock_1.html"
OUT="${ROOT}/habit_library_transform_mock_1.mp4"
W=820
H=1100

Xvfb "${D}" -screen 0 "${W}x${H}x24" -nolisten tcp &
XPID=$!
trap 'kill "${CPID:-}" 2>/dev/null || true; kill "${XPID}" 2>/dev/null || true' EXIT
sleep 1

google-chrome --no-sandbox --disable-dev-shm-usage --disable-gpu \
  --window-size="${W},${H}" --window-position=0,0 \
  --disable-extensions --no-first-run \
  "${HTML}" &
CPID=$!
sleep 6

WID=$(xdotool search --name "Habit Library" 2>/dev/null | head -1 || true)
if [[ -n "${WID}" ]]; then
  xdotool windowactivate --sync "${WID}" 2>/dev/null || true
  xdotool mousemove --window "${WID}" 200 400 click 1 2>/dev/null || true
fi

ffmpeg -y -f x11grab -video_size "${W}x${H}" -framerate 20 -draw_mouse 0 \
  -i "${D}.0" -t 18 -c:v libx264 -preset fast -pix_fmt yuv420p "${OUT}" &
FPID=$!

sleep 1
for _ in $(seq 1 12); do
  xdotool key --delay 100 Page_Down 2>/dev/null || true
  sleep 0.28
done
xdotool key Home 2>/dev/null || true
sleep 1.2

wait "${FPID}" || true
echo "Wrote ${OUT}"
