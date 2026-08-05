#!/usr/bin/env bash
set -euo pipefail

# Maestro commands often run in a non-interactive shell with a reduced PATH.
# Add common user-level bin locations so codex can be discovered consistently.
export PATH="$HOME/.bun/bin:$HOME/bin:/opt/homebrew/bin:/usr/local/bin:$HOME/node-v22.13.0-darwin-arm64/bin:$PATH"

if command -v codex >/dev/null 2>&1; then
  exec codex "$@"
fi

for candidate in \
  "$HOME/node-v22.13.0-darwin-arm64/bin/codex" \
  "/opt/homebrew/bin/codex" \
  "/usr/local/bin/codex"
do
  if [ -x "$candidate" ]; then
    exec "$candidate" "$@"
  fi
done

echo "Could not find codex. Install it or update scripts/maestro-codex.sh with your install path." >&2
exit 127
