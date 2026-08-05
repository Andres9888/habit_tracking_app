#!/bin/bash
# Script to add maxFontSizeMultiplier to Text components that are missing it
# This is a one-time migration script for the accessibility audit

set -e

echo "🔍 Finding Text components without maxFontSizeMultiplier..."

# Find all TSX files with Text components
find src -name "*.tsx" -type f | while read -r file; do
  # Check if file contains Text but not maxFontSizeMultiplier
  if grep -q "<Text" "$file" && ! grep -q "maxFontSizeMultiplier" "$file"; then
    echo "  📝 Processing: $file"
    
    # Add maxFontSizeMultiplier={2.0} to Text components
    # This is a simple pattern - may need manual review
    # Only adds to Text components that don't already have the prop
    
    # Backup file
    cp "$file" "$file.bak"
    
    # Skip files that already have AccessibleText import
    if grep -q "AccessibleText" "$file"; then
      echo "  ⏭️  Skipping (already uses AccessibleText): $file"
      rm "$file.bak"
      continue
    fi
    
    echo "  ℹ️  Manual review needed: $file"
    echo "     Consider using <AccessibleText> or adding maxFontSizeMultiplier={2.0}"
  fi
done

echo "✅ Scan complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review components and add appropriate maxFontSizeMultiplier values"
echo "   2. Use AccessibleText component for new components"
echo "   3. Choose appropriate scaling type: body (2.5x), ui (2.0x), strict (1.5x)"
echo ""
echo "See docs/ACCESSIBILITY_GUIDE.md for details"
