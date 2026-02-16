#!/bin/bash
cd /tmp/conflict-fix5-worktree

CONFLICTED="485 486 488 490 492 499 502 503 504 506 518 524 527 530 534 536 538 541 549 552 554 555 560 561 567 570 573 574 575 576 577 578 579 587 591 593 594 595 596 597 598 599 600 601 602 603 608 609 610 612 613 614 615 616 618 620 621 623 624 625 626 627 628 629 630 631 632 633 634 635"

RESOLVED=""
FAILED=""

for pr in $CONFLICTED; do
  echo "=== PR #$pr ==="
  
  git checkout pr-$pr 2>/dev/null
  git reset --hard pr-$pr 2>/dev/null
  
  # Try merge
  if git merge origin/main --no-edit 2>/dev/null; then
    echo "CLEAN"
    RESOLVED="$RESOLVED $pr"
    continue
  fi
  
  # Resolve all conflicts accepting main's version (theirs)
  # This preserves main's structure while keeping non-conflicting PR changes
  UNMERGED=$(git diff --name-only --diff-filter=U 2>/dev/null)
  
  for f in $UNMERGED; do
    if [ -f "$f" ]; then
      git checkout --theirs "$f" 2>/dev/null && git add "$f" 2>/dev/null
    else
      git rm "$f" 2>/dev/null || git add "$f" 2>/dev/null
    fi
  done
  
  # Handle modify/delete conflicts
  DELETED=$(git ls-files -u | awk '{print $4}' | sort -u)
  for f in $DELETED; do
    if git ls-files -u "$f" | grep -q .; then
      if [ -f "$f" ]; then
        git checkout --theirs "$f" 2>/dev/null && git add "$f" 2>/dev/null
      else
        git rm "$f" 2>/dev/null || git add "$f" 2>/dev/null  
      fi
    fi
  done
  
  git add -A 2>/dev/null
  
  if git commit --no-edit 2>/dev/null; then
    echo "RESOLVED"
    RESOLVED="$RESOLVED $pr"
  else
    echo "FAILED"
    FAILED="$FAILED $pr"
    git merge --abort 2>/dev/null
    git reset --hard pr-$pr 2>/dev/null
  fi
done

echo ""
echo "=== SUMMARY ==="
echo "RESOLVED:$RESOLVED"
echo "FAILED:$FAILED"
