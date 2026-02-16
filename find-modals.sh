#!/bin/bash
# Find all files with <Modal tags that don't have accessibilityViewIsModal

grep -r "<Modal" src --include="*.tsx" | \
  grep -v ".test." | \
  cut -d: -f1 | \
  sort -u | \
  while read file; do
    if ! grep -q "accessibilityViewIsModal" "$file"; then
      echo "$file"
    fi
  done
