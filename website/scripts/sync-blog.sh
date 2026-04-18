#!/bin/bash
set -euo pipefail

# Sync blog posts from an Obsidian vault to website/content/blog.
#
# Paths are overridable via env vars. Defaults match andres's local
# setup; CI and other environments can point to a different source or
# simply skip the sync by unsetting OBSIDIAN_BLOG.

DEFAULT_OBSIDIAN_BLOG="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/Andres/Blog/Habit-App-Site"

# Resolve WEBSITE_BLOG relative to this script so it works from any CWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_WEBSITE_BLOG="$SCRIPT_DIR/../content/blog"

OBSIDIAN_BLOG="${OBSIDIAN_BLOG:-$DEFAULT_OBSIDIAN_BLOG}"
WEBSITE_BLOG="${WEBSITE_BLOG:-$DEFAULT_WEBSITE_BLOG}"

# In CI or on machines without the Obsidian vault, skip cleanly so
# `npm run build` still succeeds. The already-committed content in
# WEBSITE_BLOG is used as-is.
if [ ! -d "$OBSIDIAN_BLOG" ]; then
  echo "ℹ️  Obsidian source not found at: $OBSIDIAN_BLOG"
  echo "   Skipping blog sync (using committed content in $WEBSITE_BLOG)."
  exit 0
fi

mkdir -p "$WEBSITE_BLOG"

echo "🔗 Syncing blog posts from Obsidian..."
echo "   Source: $OBSIDIAN_BLOG"
echo "   Target: $WEBSITE_BLOG"

BEFORE=$(ls -1 "$WEBSITE_BLOG"/*.md 2>/dev/null | wc -l | tr -d ' ')

rsync -av --delete --include="*.md" --exclude="*" "$OBSIDIAN_BLOG/" "$WEBSITE_BLOG/"

AFTER=$(ls -1 "$WEBSITE_BLOG"/*.md 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "✅ Sync complete!"
echo "   Posts synced: $AFTER"

if [ "$BEFORE" != "$AFTER" ]; then
  DIFF=$((AFTER - BEFORE))
  if [ $DIFF -gt 0 ]; then
    echo "   New posts: +$DIFF"
  else
    echo "   Posts removed: $DIFF"
  fi
fi

echo ""
echo "📝 Add posts to Blog/Habit-App-Site/ in Obsidian with status: published"
