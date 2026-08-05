#!/bin/bash
echo "=== CHECKING FOR IDOR VULNERABILITIES ==="
echo ""
echo "Searching for mutations that accept IDs without ownership verification..."
echo ""

# Check mutations that accept ID parameters
grep -r "args:.*v\.id\|habitId\|noteId\|letterId\|trackingId" convex/ --include="*.ts" | \
  grep "export const .* = mutation" | \
  grep -v node_modules | \
  grep -v test | \
  grep -v _generated | \
  cut -d: -f1 | \
  sort -u | \
  while read file; do
    echo "📄 $file"
    # Show the mutation signature
    grep -A 5 "export const .* = mutation" "$file" | head -20
    echo ""
  done
