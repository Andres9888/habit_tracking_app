#!/usr/bin/env bash
set -euo pipefail

start_port="${EXPO_PORT:-8081}"
env_file="${ENV_FILE:-.env.local}"
expo_args=("$@")

if [[ ${#expo_args[@]} -eq 0 ]]; then
  expo_args=(--ios)
fi

if [[ ! -f "$env_file" ]]; then
  env_file=".env"
fi

if ! command -v lsof >/dev/null 2>&1; then
  ./scripts/export-env.sh "$env_file" -- npx expo start --port "$start_port" "${expo_args[@]}"
  exit 0
fi

while lsof -iTCP:"$start_port" -sTCP:LISTEN -P -n -t >/dev/null 2>&1; do
  start_port=$((start_port + 1))
done

./scripts/export-env.sh "$env_file" -- npx expo start --port "$start_port" "${expo_args[@]}"
