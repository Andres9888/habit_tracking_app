# Performance Issue Discovery

## Context

- **Playbook:** Performance
- **Agent:** security-test
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/security-test
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/Auto Run Docs
- **Loop:** 00001

## Objective

Execute ONE tactic from `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md` to find specific performance issues. Output findings to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_CANDIDATES.md`.

## Instructions

1. **Read `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md`** to see available investigation tactics
2. **Read `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_CANDIDATES.md`** (if it exists) to see which tactics have already been executed
3. **Select ONE unexecuted tactic** from the game plan
4. **Execute the tactic**: Search the codebase using the specified patterns
5. **Document findings** in `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_CANDIDATES.md`

## Task

- [x] **Execute one tactic (or mark exhausted)**: Read /Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md and check for unexecuted tactics. If ALL tactics are already marked `[EXECUTED]`, append a section `## ALL_TACTICS_EXHAUSTED` to /Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_CANDIDATES.md and mark this task complete. Otherwise, pick one unexecuted tactic, search the codebase for matching issues, append findings to /Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_CANDIDATES.md, and mark the tactic as `[EXECUTED]` in the game plan.
  - **Note:** Executed [Tactic 1: Startup and provider initialization bottlenecks] at `2026-02-25 16:29` and recorded two startup findings in `LOOP_00001_CANDIDATES.md`.

## Output Format

Append to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_CANDIDATES.md` using this format:

```markdown
---

## [Tactic Name] - Executed [YYYY-MM-DD HH:MM]

### Finding 1: [Brief Title]
- **File:** `path/to/file.ext`
- **Line(s):** [line numbers or range]
- **Pattern Found:** [The specific code pattern that matches]
- **Context:** [Brief explanation of what this code does]

### Finding 2: [Brief Title]
...

### Tactic Summary

- **Issues Found:** [count]
- **Files Affected:** [count]
- **Status:** EXECUTED
```

## Guidelines

- **One tactic per run**: Only execute ONE tactic, then stop. This allows the pipeline to iterate.
- **Be thorough within the tactic**: Search comprehensively for the pattern specified
- **Include context**: Don't just list line numbers - explain what the code does
- **Skip false positives**: If a match isn't actually a performance issue, don't include it
- **Mark as executed**: Update `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md` to show which tactics have been run (add `[EXECUTED]` prefix)

## How to Know You're Done

This task is complete when ONE of the following is true:

**Option A - Executed a tactic:**

1. You've executed exactly ONE tactic from the game plan
2. You've appended all findings to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_CANDIDATES.md`
3. You've marked the tactic as `[EXECUTED]` in `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md`

**Option B - All tactics exhausted:**

1. All tactics in the game plan are already marked as `[EXECUTED]`
2. You've appended `## ALL_TACTICS_EXHAUSTED` to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_CANDIDATES.md`

The `ALL_TACTICS_EXHAUSTED` marker signals to downstream documents that discovery is complete.
