#!/bin/bash
cd /tmp/conflict-fix5-worktree

PRS="485 486 488 489 490 491 492 494 496 499 502 503 504 506 518 524 526 527 529 530 531 533 534 535 536 537 538 539 540 541 542 549 550 551 552 553 554 555 558 559 560 561 567 570 572 573 574 575 576 577 578 579 582 585 587 588 591 592 593 594 595 596 597 598 599 600 601 602 603 604 606 607 608 609 610 611 612 613 614 615 616 617 618 619 620 621 622 623 624 625 626 627 628 629 630 631 632 633 634 635"

# First fetch all PR heads
echo "=== Fetching all PR refs ==="
for pr in $PRS; do
  git fetch origin pull/$pr/head:pr-$pr 2>/dev/null
done
echo "=== Done fetching ==="

CLEAN=""
CONFLICTED=""
FAILED_FETCH=""

for pr in $PRS; do
  # Check if branch exists
  if ! git rev-parse --verify pr-$pr >/dev/null 2>&1; then
    FAILED_FETCH="$FAILED_FETCH $pr"
    echo "PR #$pr: FAILED TO FETCH"
    continue
  fi
  
  # Try merge
  git checkout pr-$pr 2>/dev/null
  git merge origin/main --no-commit --no-ff 2>/tmp/merge_output_$pr.txt
  status=$?
  
  if [ $status -eq 0 ]; then
    git merge --abort 2>/dev/null || git reset --hard HEAD 2>/dev/null
    CLEAN="$CLEAN $pr"
    echo "PR #$pr: CLEAN"
  else
    git merge --abort 2>/dev/null || git reset --hard HEAD 2>/dev/null
    CONFLICTED="$CONFLICTED $pr"
    echo "PR #$pr: CONFLICTS"
  fi
done

echo ""
echo "=== SUMMARY ==="
echo "CLEAN:$CLEAN"
echo "CONFLICTS:$CONFLICTED"
echo "FAILED:$FAILED_FETCH"
