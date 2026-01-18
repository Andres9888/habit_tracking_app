#!/bin/bash
# Auto Test Hook - Run tests on relevant file changes

FILE_PATH="$1"

# Exit if no file path
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only run on test-related files or source files with tests
case "$FILE_PATH" in
  *test.tsx|*test.ts|*.test.js|*.spec.ts|*.spec.tsx)
    echo ""
    echo "🧪 Running tests for: $FILE_PATH"

    # Determine test command based on file type
    if [ -f "package.json" ]; then
      # Check if we have a test script
      if grep -q '"test"' package.json; then
        # Run tests related to this file (if using Jest)
        if grep -q 'jest' package.json; then
          npm test -- "$FILE_PATH" --passWithNoTests 2>&1 | head -50
        else
          echo "  Test framework not detected, skipping auto-test"
        fi
      fi
    fi
    ;;
  */src/*|*/lib/*)
    # For source files, check if corresponding test exists
    TEST_FILE="${FILE_PATH%.*}.test.${FILE_PATH##*.}"
    if [ -f "$TEST_FILE" ]; then
      echo ""
      echo "🧪 Running related test: $TEST_FILE"
      npm test -- "$TEST_FILE" --passWithNoTests 2>&1 | head -50
    fi
    ;;
esac

exit 0
