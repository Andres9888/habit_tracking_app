#!/bin/bash
# Task Context Hook - Show current task context before operations

# Check if Task Master is available
if ! command -v task-master &> /dev/null; then
  exit 0
fi

# Get current in-progress task
CURRENT_TASK=$(task-master list 2>/dev/null | grep "in-progress" | head -1)

if [ -n "$CURRENT_TASK" ]; then
  echo ""
  echo "📌 Current Task Context:"
  echo "  $CURRENT_TASK"
  echo ""
fi

exit 0
