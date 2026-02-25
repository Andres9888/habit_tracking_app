# Performance Analysis - Codebase Survey

## Context

- **Playbook:** Performance
- **Agent:** security-test
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/security-test
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/Auto Run Docs
- **Loop:** 00001

## Objective

Analyze the codebase to identify **categories of potential performance issues** and create a game plan for systematic investigation. This document drives the discovery phase - finding WHERE to look for performance problems.

## Instructions

1. **Survey the codebase structure** - Identify the main directories, frameworks used, and architecture patterns
2. **Identify performance-sensitive areas** based on:
   - UI rendering (if applicable)
   - Data processing (large collections, frequent transformations)
   - Network/IO operations
   - State management patterns
   - Event handling
   - Memory-intensive operations
3. **Output a tactical game plan** to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md`

## Analysis Checklist

- [x] **Survey codebase (if needed)**: Checked for existing plan file at `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md`; confirmed it was already present from earlier survey and updated as needed. Created/verified the game plan with prioritized, actionable tactics at `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md` using this loop’s scope.
- [x] Note: Completed analysis task and validated the `LOOP_00001_GAME_PLAN.md` tactical format against the requested structure (Codebase Profile + 7 investigation tactics).

## Output Format

Create/update `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_GAME_PLAN.md` with the following structure:

```markdown
# Performance Game Plan

## Codebase Profile

- **Language/Framework:** [e.g., Python/Django, TypeScript/Node, Go, etc.]
- **Size:** [Approximate LOC or file count]
- **Key Directories:** [List main source directories]
- **Performance Libraries:** [Any existing perf tools, caching, profiling, etc.]

## Investigation Tactics

Each tactic is a specific, actionable search pattern for finding performance issues.

### Tactic 1: [Name]

- **Target:** [What type of issue this finds]
- **Search Pattern:** [Specific grep/glob patterns or code patterns to look for]
- **Files to Check:** [Specific files or glob patterns]
- **Why It Matters:** [Brief explanation of performance impact]

### Tactic 2: [Name]

...
```

## Tactic Categories to Consider

When creating tactics, consider these common performance issue categories:

### Algorithmic Complexity

- O(n²) or worse algorithms in hot paths
- Repeated searches through unsorted data
- Unnecessary sorting or re-computation
- Suboptimal data structures for the access pattern

### Memory Usage

- Unbounded collection growth
- Memory leaks from unclosed resources
- Large object allocations in loops
- Missing cleanup of temporary data

### I/O Operations

- Synchronous I/O in performance-critical paths
- N+1 query patterns (database or API)
- Missing caching for repeated reads
- Inefficient batch sizes

### Concurrency

- Lock contention in hot paths
- Unnecessary serialization
- Missing parallelization opportunities
- Thread pool exhaustion

### Network & External Services

- Redundant API calls
- Missing request batching
- No timeout handling
- Unbounded retry loops

### Rendering & UI (if applicable)

- Expensive computations in render loops
- Unnecessary re-renders or repaints
- Missing virtualization for long lists
- Unoptimized event handlers

## Guidelines

- **Be specific**: Each tactic should have concrete search patterns
- **Prioritize**: Order tactics by likely impact (biggest wins first)
- **Be realistic**: Focus on issues that are actually fixable with reasonable effort
- **No implementation**: This phase is discovery only - find WHERE to look, not WHAT to fix
