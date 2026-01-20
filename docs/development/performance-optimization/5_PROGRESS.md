# Performance Pipeline Progress Gate

## Context

- **Playbook:** Performance
- **Agent:** Performance
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/Performance
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/docs
- **Loop:** 00001

## Purpose

This document is the **progress gate** for the performance pipeline. It checks whether there are still `PENDING` performance fixes to implement. **This is the only document with Reset ON** - it controls loop continuation by resetting tasks in documents 1-4 when more work is needed.

## Instructions

1. **Read `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md`** to check for remaining work
2. **Check if there are any `PENDING` items** (not `IMPLEMENTED`, not `WON'T DO`, not `PENDING - MANUAL REVIEW`)
3. **If PENDING items exist**: Reset all tasks in documents 1-4 to continue the loop
4. **If NO PENDING items exist**: Do NOT reset - pipeline exits

## Progress Check

- [x] **Check for remaining work**: Read LOOP_00001_PLAN.md and LOOP_00001_CANDIDATES.md. The loop should CONTINUE (reset docs 1-4) if EITHER: (1) there are items with status exactly `PENDING`, OR (2) CANDIDATES.md does NOT contain `## ALL_TACTICS_EXHAUSTED`. The loop should EXIT (do NOT reset) only when BOTH conditions are false: no PENDING items AND all tactics are exhausted.
  - **Checked 2026-01-20:** PENDING=0, ALL_TACTICS_EXHAUSTED marker NOT present → CONTINUE (more tactics to discover)

## Reset Tasks (Only if work remains)

If the progress check above determines we need to continue (PENDING items OR tactics remaining), reset all tasks in the following documents:

- [x] **Reset 1_ANALYZE.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/1_ANALYZE.md`
  - **Reset 2026-01-20:** Task unchecked to allow next loop iteration
- [x] **Reset 2_FIND_ISSUES.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/2_FIND_ISSUES.md`
  - **Reset 2026-01-20:** Task unchecked to allow next loop iteration
- [x] **Reset 3_EVALUATE.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/3_EVALUATE.md`
  - **Reset 2026-01-20:** Task unchecked to allow next loop iteration
- [x] **Reset 4_IMPLEMENT.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/4_IMPLEMENT.md`
  - **Reset 2026-01-20:** Task unchecked to allow next loop iteration

**IMPORTANT**: Only reset documents 1-4 if there is work remaining (PENDING items OR unexplored tactics). If all tactics are exhausted AND all items are IMPLEMENTED, WON'T DO, or PENDING - MANUAL REVIEW, leave these reset tasks unchecked to allow the pipeline to exit.

## Decision Logic

```
IF LOOP_00001_PLAN.md doesn't exist:
    → Do NOT reset anything (PIPELINE JUST STARTED - LET IT RUN)

ELSE IF items with status exactly `PENDING` exist:
    → Reset documents 1-4 (CONTINUE TO IMPLEMENT PENDING ITEMS)

ELSE IF LOOP_00001_CANDIDATES.md does NOT contain "ALL_TACTICS_EXHAUSTED":
    → Reset documents 1-4 (CONTINUE TO DISCOVER MORE CANDIDATES)

ELSE:
    → Do NOT reset anything (ALL TACTICS EXHAUSTED AND NO PENDING ITEMS - EXIT)
```

**Key insight:** The loop should continue if EITHER:

1. There are PENDING items to implement, OR
2. There are still tactics to execute (no `ALL_TACTICS_EXHAUSTED` marker)

## How This Works

This document controls loop continuation through resets:

- **Reset tasks checked** → Documents 1-4 get reset → Loop continues
- **Reset tasks unchecked** → Nothing gets reset → Pipeline exits

### Exit Conditions (Do NOT Reset)

Exit when ALL of these are true:

1. **Tactics exhausted**: `LOOP_00001_CANDIDATES.md` contains `## ALL_TACTICS_EXHAUSTED`
2. **No PENDING items**: All items in the plan are `IMPLEMENTED`, `WON'T DO`, or `PENDING - MANUAL REVIEW`

Also exit if: 3. **Max Loops**: Hit the loop limit in Batch Runner

### Continue Conditions (Reset Documents 1-4)

Continue if EITHER is true:

1. There are items with status exactly `PENDING` in LOOP_00001_PLAN.md
2. `LOOP_00001_CANDIDATES.md` does NOT contain `## ALL_TACTICS_EXHAUSTED` (more tactics to run)

## Current Status

Before making a decision, check the plan file:

| Metric                            | Value |
| --------------------------------- | ----- |
| **PENDING Items**                 | 0     |
| **IMPLEMENTED Items**             | 7     |
| **WON'T DO Items**                | 7     |
| **PENDING - MANUAL REVIEW Items** | 7     |

## Progress History

Track progress across loops:

| Loop | Fixes Implemented | Items Remaining            | Decision                  |
| ---- | ----------------- | -------------------------- | ------------------------- |
| 1    | 7                 | 0 PENDING, 7 MANUAL REVIEW | CONTINUE (tactics remain) |
| 2    | \_\_\_            | \_\_\_                     | [CONTINUE / EXIT]         |
| ...  | ...               | ...                        | ...                       |

## Manual Override

**To force exit early:**

- Leave all reset tasks unchecked regardless of PENDING items

**To continue despite no PENDING items:**

- Check the reset tasks to force another analysis pass

**To pause for manual review:**

- Leave unchecked
- Review PERF_LOG and plan file
- Restart when ready

## Notes

- This playbook focuses on LOW complexity fixes with MEDIUM or HIGH gain
- MEDIUM and HIGH complexity fixes are marked for manual review
- Each loop iteration implements ONE fix at a time for safety
- The PERF_LOG tracks all changes across loops for easy review
