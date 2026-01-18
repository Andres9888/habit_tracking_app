#!/bin/bash

# Sync blog posts from Obsidian vault to website content folder
# Syncs from Blog/Habit-App-Site folder

OBSIDIAN_BLOG="/Users/andres/Library/Mobile Documents/iCloud~md~obsidian/Documents/Andres/Blog/Habit-App-Site"
WEBSITE_BLOG="/Users/andres/Code/habit_tracking_app/website/content/blog"

echo "🔗 Syncing blog posts from Obsidian..."
echo "   Source: $OBSIDIAN_BLOG"
echo "   Target: $WEBSITE_BLOG"

# Check if source exists - create if it doesn't
if [ ! -d "$OBSIDIAN_BLOG" ]; then
  echo "📁 Creating Obsidian blog folder..."
  mkdir -p "$OBSIDIAN_BLOG"
  echo "   Created: $OBSIDIAN_BLOG"
fi

# Count files before sync
BEFORE=$(ls -1 "$WEBSITE_BLOG"/*.md 2>/dev/null | wc -l | tr -d ' ')

# Sync only .md files from Posts folder
# Using rsync for efficient syncing
rsync -av --delete --include="*.md" --exclude="*" "$OBSIDIAN_BLOG/" "$WEBSITE_BLOG/"

# Count files after sync
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
