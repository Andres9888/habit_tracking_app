#!/bin/bash
# Session Start Hook - Show Task Master Status and Context

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   🚀 Claude Code Session Started      ║"
echo "╔════════════════════════════════════════╝"
echo ""

# Show git status
echo "📦 Git Status:"
git status --short 2>/dev/null | head -10 || echo "  Not a git repository"
echo ""

# Show Task Master status if available
if command -v task-master &> /dev/null; then
  echo "📋 Task Master Status:"
  task-master next 2>/dev/null | head -15 || echo "  No tasks available"
  echo ""
fi

# Show recent activity
echo "🕒 Recent Files Modified (last 2 hours):"
find . -type f -mmin -120 -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" 2>/dev/null | head -5 || echo "  None"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
