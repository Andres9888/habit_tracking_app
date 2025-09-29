#!/bin/bash
# CodeRabbit Review Handler for Claude Code
# This script runs CodeRabbit on modified files and formats suggestions

FILE_PATH="$1"
REVIEW_OUTPUT=".claude/coderabbit-review.json"

# Exit if no file path provided
if [ -z "$FILE_PATH" ]; then
  echo "Error: No file path provided"
  exit 1
fi

# Create .claude directory if it doesn't exist
mkdir -p .claude

# Run CodeRabbit review
echo "🔍 Running CodeRabbit review on: $FILE_PATH"
coderabbit review --file="$FILE_PATH" --format=json > "$REVIEW_OUTPUT" 2>&1

# Check if review was successful and has content
if [ -s "$REVIEW_OUTPUT" ]; then
  echo ""
  echo "📊 CodeRabbit Review Results:"
  echo "=============================="

  # Parse and format suggestions using jq if available
  if command -v jq &> /dev/null; then
    # Extract suggestions with formatting
    SUGGESTIONS=$(jq -r '
      if .suggestions then
        .suggestions[] |
        "⚠️  Line \(.line): \(.message)\n   💡 Suggestion: \(.suggestion)\n   🔧 Severity: \(.severity // "info")\n"
      else
        "✅ No suggestions found - code looks good!"
      end
    ' "$REVIEW_OUTPUT" 2>/dev/null)

    if [ -z "$SUGGESTIONS" ]; then
      echo "✅ No suggestions found - code looks good!"
    else
      echo "$SUGGESTIONS"
      echo ""
      echo "💾 Full review saved to: $REVIEW_OUTPUT"
    fi
  else
    # Fallback if jq is not available
    echo "⚠️  jq not installed - showing raw output:"
    cat "$REVIEW_OUTPUT"
  fi
else
  echo "✅ CodeRabbit review completed - no issues found"
fi

exit 0