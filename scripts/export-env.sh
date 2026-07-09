#!/usr/bin/env bash
# Usage: scripts/export-env.sh [env-file] -- command args...
# If ENV_FILE is set it will be used as the default env file.
# Loads variables from the given env file and executes the command.
set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Usage: $0 [env-file] -- command [args...]" >&2
  exit 1
fi

env_file="${ENV_FILE:-.env}"

first_arg="${1:-}"
if [[ "$first_arg" != "--" && -n "$first_arg" ]]; then
  env_file="$first_arg"
  shift
  first_arg="${1:-}"
fi

if [[ "$first_arg" != "--" ]]; then
  echo "Separator '--' required before command" >&2
  exit 1
fi
shift

if [[ $# -eq 0 ]]; then
  echo "No command provided to execute" >&2
  exit 1
fi

if [[ ! -f "$env_file" ]]; then
  echo "Environment file '$env_file' not found; running without it" >&2
  exec "$@"
fi

# Export env vars for the command only
set -a
source "$env_file"
set +a

exec "$@"
