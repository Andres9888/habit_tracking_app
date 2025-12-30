# Performance Fix Implementation

## Context

- **Playbook:** Performance
- **Agent:** code-refactor
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/code-refactor
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/docs
- **Loop:** 00001

## Objective

Implement ONE performance fix from `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md` that has status `PENDING`. Log all changes to `/Users/andres/Code/habit_tracking_app/docs/PERF_LOG_code-refactor_2025-12-29.md`.

## Instructions

1. **Read `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md`** to find evaluated performance fixes
2. **Filter for actionable items**: Only consider fixes where:
   - **Status = `PENDING`** (exactly - not `PENDING - MANUAL REVIEW` or `WON'T DO`)
   - These are LOW complexity items with MEDIUM or HIGH gain
3. **Select ONE fix** that meets the criteria (prioritize HIGH gain over MEDIUM)
4. **Implement the fix**: Make the code changes as specified in the proposed fix
5. **Verify the change**: Ensure the code still works (syntax check, no obvious errors)
6. **Log the change** to `/Users/andres/Code/habit_tracking_app/docs/PERF_LOG_code-refactor_2025-12-29.md`
7. **Update status** in `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md` to `IMPLEMENTED`

## Task

- [x] **Implement one PENDING fix**: Read /Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md, find an item with status exactly `PENDING`, implement the fix, log to /Users/andres/Code/habit_tracking_app/docs/PERF_LOG_code-refactor_2025-12-29.md, and mark as IMPLEMENTED in /Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md.
  - **Completed:** 2025-12-29 - Item #10 (Duplicate CodeRabbit Configs) - Removed `.coderabbit 2.yaml`, `.coderabbit 3.yaml`, `.coderabbit 4.yaml`, and `.coderabbitignore 2`
  - **Completed:** 2025-12-29 - Item #11 (Duplicate Windsurfrules Configs) - Removed `.windsurfrules 2`, `.windsurfrules 3`, `.windsurfrules 4`
  - **Completed:** 2025-12-29 - Item #4 (Workshop Animation Constants Duplication) - Created shared `src/components/animations/constants.ts` with `SPRING_BUTTON`, `SPRING_GENTLE`, `SPRING_BOUNCY`, `STAGGER_DELAY`, `BASE_CHECKMARK_DELAY`. Updated 13 Workshop/Reward components to import from shared location.
  - **Loop Complete:** 2025-12-29 - No more auto-implementable PENDING items. Items #5 and #6 were upgraded to PENDING - MANUAL REVIEW (MEDIUM risk restructurings requiring manual implementation). See PERF_LOG for full analysis.

## Implementation Checklist

Before implementing, verify:

- [x] The status is exactly `PENDING` (not `PENDING - MANUAL REVIEW`) - **No PENDING items remain (as of 2025-12-29)**
- [x] The fix is clearly specified with before/after code - **All auto-implementable fixes completed**
- [x] No other changes are required (no dependencies) - **Verified**

## Output Format

Append to `/Users/andres/Code/habit_tracking_app/docs/PERF_LOG_code-refactor_2025-12-29.md` using this format:

````markdown
---

## [YYYY-MM-DD HH:MM] - [Brief Title]

**Agent:** code-refactor
**Project:** code-refactor
**Loop:** 00001
**File:** `path/to/file.ext`
**Line(s):** [line numbers affected]
**Change Type:** [caching | algorithm optimization | lazy loading | etc.]

### What Was Changed

[1-2 sentence description of the change]

### Before

```[language]
// Original code
```
````

### After

```[language]
// New code
```

### Expected Impact

[Brief description of expected performance improvement]

### Verification

- [ ] Code compiles/parses without errors
- [ ] No linter errors introduced
- [ ] Change matches the proposed fix from LOOP_00001_PLAN.md

````

## Guidelines

- **Only `PENDING` items**: Do NOT implement `PENDING - MANUAL REVIEW` or `WON'T DO` items
- **One fix per run**: Implement exactly ONE fix, then stop. This keeps changes small and reviewable.
- **Follow the plan**: Implement exactly what was proposed in `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md`, don't improvise
- **Update both files**: Log to `/Users/andres/Code/habit_tracking_app/docs/PERF_LOG_code-refactor_2025-12-29.md` AND update status in `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md`
- **Be conservative**: If anything is unclear about the fix, skip it and note why in the log file

## How to Know You're Done

This task is complete when:
1. You've implemented exactly ONE fix from `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md` (or logged why none were available)
2. You've appended the change details to `/Users/andres/Code/habit_tracking_app/docs/PERF_LOG_code-refactor_2025-12-29.md`
3. You've updated the item status in `/Users/andres/Code/habit_tracking_app/docs/LOOP_00001_PLAN.md` to `IMPLEMENTED`

## When No Fixes Are Available

If there are no items with status exactly `PENDING` in the plan file, append to `/Users/andres/Code/habit_tracking_app/docs/PERF_LOG_code-refactor_2025-12-29.md`:

```markdown
---

## [YYYY-MM-DD HH:MM] - Loop 00001 Complete

**Agent:** code-refactor
**Project:** code-refactor
**Loop:** 00001
**Status:** No PENDING fixes available

**Summary:**
- Items IMPLEMENTED: [count]
- Items WON'T DO: [count]
- Items PENDING - MANUAL REVIEW: [count]

**Recommendation:** [Either "All automatable wins implemented" or "Remaining items need manual review"]
````

This signals to the pipeline that this loop iteration is complete.
