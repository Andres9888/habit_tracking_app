#!/bin/bash
# CodeRabbit Review Handler for Claude Code
# This script runs CodeRabbit on uncommitted changes

FILE_PATH="$1"
REVIEW_OUTPUT=".claude/coderabbit-review.txt"

# Exit if no file path provided
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only run on supported file types
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.py|*.java|*.go|*.rs|*.rb)
    # File type supported
    ;;
  *)
    # Skip unsupported file types
    exit 0
    ;;
esac

# Check if file has uncommitted changes
if ! git diff --quiet "$FILE_PATH" 2>/dev/null && ! git diff --cached --quiet "$FILE_PATH" 2>/dev/null; then
  # Create .claude directory if it doesn't exist
  mkdir -p .claude

  # Run CodeRabbit review on uncommitted changes (plain text mode)
  echo "🔍 Running CodeRabbit review on uncommitted changes..."
  coderabbit review --plain --type uncommitted > "$REVIEW_OUTPUT" 2>&1

  # Check if review was successful and has content
  if [ -s "$REVIEW_OUTPUT" ]; then
    # Filter output for the specific file if possible
    if grep -q "$FILE_PATH" "$REVIEW_OUTPUT"; then
      echo ""
      echo "📊 CodeRabbit Review for $FILE_PATH:"
      echo "=============================="
      # Show relevant section
      grep -A 20 "$FILE_PATH" "$REVIEW_OUTPUT" | head -30
      echo ""
      echo "💾 Full review: $REVIEW_OUTPUT"
    fi
  fi
fi

exit 0