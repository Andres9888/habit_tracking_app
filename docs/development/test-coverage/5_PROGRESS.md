# Test Coverage Gate - 80% Target

## Context

- **Playbook:** Testing
- **Agent:** refactor-performance-security-testing
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/refactor-performance-security-testing
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/docs
- **Loop:** 00001

## Purpose

This document is the **coverage gate** for the testing pipeline. It checks whether we've reached the 80% coverage target. **This is the only document with Reset ON** - it controls loop continuation by resetting tasks in documents 1-4 when more work is needed.

## Instructions

1. **Run coverage analysis** to get current metrics
2. **Check if line coverage is 80% or higher**
3. **If coverage < 80% AND there are PENDING items** with EASY/MEDIUM testability and HIGH/CRITICAL importance in `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md`: Reset all tasks in documents 1-4 to continue the loop
4. **If coverage >= 80% OR no such PENDING items**: Do NOT reset - pipeline exits

## Coverage Check

- [x] **Check coverage and decide**: Run coverage analysis. If line coverage is below 80% AND there are still `PENDING` items with EASY/MEDIUM testability and HIGH/CRITICAL importance in `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md`, then reset documents 1-4 to continue the loop. If coverage >= 80% OR no auto-testable items remain, do NOT reset anything - allow the pipeline to exit.
  - **Checked:** 2026-01-08 by refactor-performance-security-testing agent
  - **Result:** Coverage is 39.72% (below 80% target). Found 3 PENDING items with EASY/MEDIUM testability and HIGH importance. Proceeding to reset documents 1-4.

## Reset Tasks (Only if coverage < 80% AND auto-testable PENDING items exist)

If the coverage check above determines we need to continue, reset all tasks in the following documents:

- [x] **Reset 1_ANALYZE.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/development/test-coverage/1_ANALYZE.md`
  - **Reset:** 2026-01-08 by refactor-performance-security-testing agent
- [x] **Reset 2_FIND_GAPS.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/development/test-coverage/2_FIND_GAPS.md`
  - **Reset:** 2026-01-08 by refactor-performance-security-testing agent
- [x] **Reset 3_EVALUATE.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/development/test-coverage/3_EVALUATE.md`
  - **Reset:** 2026-01-08 by refactor-performance-security-testing agent
- [x] **Reset 4_IMPLEMENT.md**: Uncheck all tasks in `/Users/andres/Code/habit_tracking_app/docs/development/test-coverage/4_IMPLEMENT.md`
  - **Reset:** 2026-01-08 by refactor-performance-security-testing agent

**IMPORTANT**: Only reset documents 1-4 if coverage is below 80% AND there are PENDING items with EASY/MEDIUM testability and HIGH/CRITICAL importance. If coverage target is met, or only HARD/VERY HARD items remain, leave these reset tasks unchecked to allow the pipeline to exit.

## Decision Logic

```
IF line_coverage >= 80%:
    → Do NOT reset anything (TARGET REACHED - EXIT)

ELSE IF no PENDING items with (EASY|MEDIUM testability) AND (HIGH|CRITICAL importance):
    → Do NOT reset anything (NO MORE AUTO-IMPLEMENTABLE WORK - EXIT)

ELSE:
    → Reset documents 1-4 (CONTINUE TO NEXT LOOP)
```

## How This Works

This document controls loop continuation through resets:

- **Reset tasks checked** → Documents 1-4 get reset → Loop continues
- **Reset tasks unchecked** → Nothing gets reset → Pipeline exits

### Exit Conditions (Do NOT Reset)

1. **Target Reached**: Coverage is 80% or higher
2. **No Work Remaining**: All PENDING items are IMPLEMENTED
3. **Only Hard Items Left**: Remaining items are HARD/VERY HARD testability
4. **Only Low Priority Left**: Remaining items are LOW/MEDIUM importance
5. **Max Loops Reached**: Hit the loop limit in Batch Runner

### Continue Conditions (Reset Documents 1-4)

1. Coverage is below 80%
2. There are PENDING items with EASY/MEDIUM testability AND HIGH/CRITICAL importance
3. We haven't hit max loops

## Current Status

Before making a decision, run coverage and record:

| Metric                                   | Value                                                |
| ---------------------------------------- | ---------------------------------------------------- |
| **Current Line Coverage**                | 39.72%                                               |
| **Target**                               | 80%                                                  |
| **Gap**                                  | 40.28%                                               |
| **PENDING (EASY/MEDIUM, HIGH/CRITICAL)** | 3 (TEST-006, TEST-007, TEST-010)                     |
| **PENDING (other)**                      | 5 (TEST-003, TEST-004, TEST-005, TEST-008, TEST-009) |
| **IMPLEMENTED**                          | 2 (TEST-001, TEST-002)                               |

**Decision: CONTINUE** - Coverage is 39.72% (well below 80% target) and there are 3 PENDING items with EASY/MEDIUM testability and HIGH importance. Resetting documents 1-4 to continue the loop.

## Coverage History

Track progress across loops:

| Loop | Coverage | Tests Added                      | Cumulative Gain | Decision          |
| ---- | -------- | -------------------------------- | --------------- | ----------------- |
| 1    | 39.72%   | 0 (existing: TEST-001, TEST-002) | +0%             | CONTINUE          |
| 2    | \_\_\_ % | \_\_\_                           | +\_\_\_ %       | [CONTINUE / EXIT] |
| ...  | ...      | ...                              | ...             | ...               |

## Manual Override

**To force exit before 80%:**

- Leave all reset tasks unchecked regardless of coverage

**To continue past 80%:**

- Check the reset tasks to keep improving coverage

**To pause for review:**

- Leave unchecked
- Review TEST_LOG and plan file
- Restart when ready

## Notes

- The 80% target is **line coverage**, not branch coverage
- Some code may be legitimately untestable (generated, deprecated)
- It's okay to stop early if remaining gaps are all HARD/VERY HARD
- Quality matters more than hitting exactly 80%
