#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_PATH="$ROOT_DIR/.gitleaks.toml"
SCAN_MODE="${GITLEAKS_SCAN_MODE:-working-tree}"

if [[ ! -f "$CONFIG_PATH" ]]; then
  echo "Missing .gitleaks.toml at $CONFIG_PATH" >&2
  exit 1
fi

DETECT_ARGS=(
  detect
  --source "$ROOT_DIR"
  --config "$CONFIG_PATH"
  --redact
)

if [[ "$SCAN_MODE" == "working-tree" ]]; then
  DETECT_ARGS+=(--no-git)
fi

if command -v gitleaks >/dev/null 2>&1; then
  exec gitleaks "${DETECT_ARGS[@]}"
fi

if command -v docker >/dev/null 2>&1; then
  DOCKER_DETECT_ARGS=(
    detect
    --source /repo
    --config /repo/.gitleaks.toml
    --redact
  )
  if [[ "$SCAN_MODE" == "working-tree" ]]; then
    DOCKER_DETECT_ARGS+=(--no-git)
  fi

  exec docker run --rm \
    -v "$ROOT_DIR:/repo" \
    zricethezav/gitleaks:latest "${DOCKER_DETECT_ARGS[@]}"
fi

echo "gitleaks not found. Install with 'brew install gitleaks' or run with Docker available." >&2
exit 2
