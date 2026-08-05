#!/bin/bash
# Security audit script to find mutations/queries without auth checks

echo "=== SECURITY AUDIT: Authentication Checks ==="
echo ""

# Find all files with mutations or queries
FILES=$(grep -rl "export const .* = \(mutation\|query\|internalMutation\|internalQuery\)" convex/ --include="*.ts" | grep -v node_modules | grep -v test | grep -v _generated)

for file in $FILES; do
  # Get all exported mutation/query names
  EXPORTS=$(grep -E "^export const .* = (mutation|query|internalMutation|internalQuery)" "$file" | sed 's/export const \([^ ]*\).*/\1/')
  
  for export_name in $EXPORTS; do
    # Extract the function body for this export
    FUNCTION_TYPE=$(grep "^export const $export_name = " "$file" | sed 's/.*= \([a-zA-Z]*\).*/\1/')
    
    # Check if it's an internal function (these don't need auth)
    if [[ "$FUNCTION_TYPE" == "internalMutation" ]] || [[ "$FUNCTION_TYPE" == "internalQuery" ]]; then
      continue
    fi
    
    # Extract function content (rough approximation)
    START_LINE=$(grep -n "^export const $export_name = " "$file" | cut -d: -f1)
    
    if [ ! -z "$START_LINE" ]; then
      # Get ~80 lines after the export (enough to see auth check)
      CONTENT=$(tail -n +$START_LINE "$file" | head -n 80)
      
      # Check for auth patterns
      if ! echo "$CONTENT" | grep -q "getUserIdentity\|checkPremium"; then
        echo "⚠️  MISSING AUTH: $file :: $export_name ($FUNCTION_TYPE)"
      fi
    fi
  done
done

echo ""
echo "=== Checking for intentionally public endpoints ==="
# Some queries might be intentionally public (like templates list)
