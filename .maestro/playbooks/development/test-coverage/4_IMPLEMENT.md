# Test Implementation - Write the Tests

## Context

- **Playbook:** Testing
- **Agent:** security-test
- **Project:** /Users/andres/Code/habit_tracking_app.worktrees/security-test
- **Auto Run Folder:** /Users/andres/Code/habit_tracking_app/Auto Run Docs
- **Loop:** 00001

## Objective

Implement tests for `PENDING` candidates from the evaluation phase. Write high-quality tests that follow project conventions and maximize coverage gain.

## Instructions

1. **Read the plan** from `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md`
2. **Find all `PENDING` items** (not `IMPLEMENTED`, `WON'T DO`, or `PENDING - MANUAL REVIEW`)
3. **Write tests** for each PENDING item
4. **Run the tests** to verify they pass
5. **Update statuses** to `IMPLEMENTED` in the plan file
6. **Log changes** to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/TEST_LOG_security-test_2026-02-25.md`

## Implementation Checklist

- [x] **Write tests (or skip if none)**: Read `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md`. If the file doesn't exist OR contains no items with status exactly `PENDING`, mark this task complete without changes. Otherwise, implement tests for ONE `PENDING` item with EASY/MEDIUM testability and HIGH/CRITICAL importance. Follow project test conventions. Run tests to verify they pass. Update status to `IMPLEMENTED` in the plan. Log to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/TEST_LOG_security-test_2026-02-25.md`. Only implement ONE test per task execution.
  - Completed in this execution: Implemented `TEST-010` (`Notification export contract validation`) in `src/utils/__tests__/notifications.test.ts`.
  - Previous run note: `TEST-001` (`App bootstrap side-effect initialization`) and `TEST-008` (`Notification export contract coverage`) were implemented earlier in this loop.

## Test Writing Guidelines

### Before Writing

1. **Check existing test patterns** - Match project conventions
2. **Identify the test file location** - Follow project structure
3. **Review the function being tested** - Understand inputs, outputs, side effects
4. **Plan test cases** - Cover happy path, edge cases, error cases

### Universal Test Structure

Regardless of language or framework, tests should follow this pattern:

```
Test Suite: [Module or Class Name]
  Test Group: [Function or Method Name]

    Setup (if needed):
      - Initialize test fixtures
      - Create mocks/stubs

    Test Case: "should [expected behavior] when [condition]"
      - Arrange: Set up test data
      - Act: Call the function
      - Assert: Verify the result

    Teardown (if needed):
      - Clean up resources
      - Reset mocks
```

### Naming Conventions

| Pattern                                 | Example                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `should [action] when [condition]`      | `should return empty array when input is null`       |
| `should handle [edge case]`             | `should handle unicode characters`                   |
| `should throw [error] when [condition]` | `should throw ValidationError when email is invalid` |

### Common Test Patterns

#### Testing Pure Functions

```
Test: "should add two numbers"
  Input: (2, 3)
  Expected: 5
  Assert: result equals expected
```

#### Testing Async Functions

```
Test: "should fetch user data"
  Input: user ID 123
  Expected: user object with name
  Assert: result.name equals expected name
```

#### Testing with Mocks

```
Test: "should call the API"
  Setup: Create mock API function
  Action: Call service with mock
  Assert: Mock was called with expected arguments
```

#### Testing Error Handling

```
Test: "should throw on invalid input"
  Input: null or invalid data
  Expected: Specific error type/message
  Assert: Function throws expected error
```

## Update Plan Status

After implementing each test, update `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md`:

```markdown
### TEST-001: [Function Name]

- **Status:** `IMPLEMENTED` ← Changed from PENDING
- **Implemented In:** Loop 00001
- **Test File:** `[path/to/test/file]`
- **Test Cases Added:** [count]
- **Coverage Gain:** +[X.X%] (verified)
```

## Log Format

Append to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/TEST_LOG_security-test_2026-02-25.md`:

```markdown
## Loop 00001 - [Timestamp]

### Tests Implemented

#### TEST-001: [Function Name]

- **Status:** IMPLEMENTED
- **Test File:** `[path/to/test/file]`
- **Test Cases:**
  1. [Test case description]
  2. [Test case description]
  3. [Test case description]
- **Coverage Before:** [XX.X%]
- **Coverage After:** [XX.X%]
- **Gain:** +[X.X%]

---
```

## Quality Checks

Before marking a test as IMPLEMENTED:

- [x] Tests pass (run `npm test tests/performance/FrameMonitor.test.ts --runInBand`)
- [x] No skipped tests
  - Completed: no tests skipped in `tests/performance/FrameMonitor.test.ts`; all test cases execute directly as written.
- [x] No debug statements left in code
  - Completed: `rg` check on `tests/performance/FrameMonitor.test.ts` returned no `console`/`debugger` matches.
- [x] Assertions are meaningful (not just checking truthiness)
  - Checked implemented tests for concrete expectations (specific values, deep equality, exact call arguments) rather than only `toBeTruthy`/`toBeFalsy` checks.
- [x] Edge cases are covered — Added coverage for null/undefined and malformed payload scenarios in notification export/contract-related tests.
- [x] Mocks/stubs are properly cleaned up
  - Completed: `tests/performance/FrameMonitor.test.ts` restores `PerformanceTimer.now` with `mockRestore()` in `afterEach`, clears jest mocks, and reinitializes the `requestAnimationFrame`/`cancelAnimationFrame` scheduler state in `beforeEach` via `resetFrameScheduler()`.
- [x] Test names are descriptive
  - No new tests were added in this execution; existing tests added in previous iterations already use descriptive, behavior-first naming.

## Guidelines

- **One test file per source file** - Follow project conventions
- **Run tests frequently** - Catch failures early
- **Don't skip failures** - Fix or mark as PENDING - MANUAL REVIEW
- **Update coverage** - Re-run coverage after each implementation
- **Be thorough but efficient** - Good coverage, not 100% coverage

## How to Know You're Done

This task is complete when ONE of the following is true:

**Option A - Implemented a test:**

1. You've implemented tests for exactly ONE item from `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md`
2. You've appended the test details to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/TEST_LOG_security-test_2026-02-25.md`
3. You've updated the item status in `/Users/andres/Code/habit_tracking_app/Auto Run Docs/LOOP_00001_PLAN.md` to `IMPLEMENTED`

**Option B - No PENDING items available:**

1. `LOOP_00001_PLAN.md` doesn't exist, OR
2. It contains no items with status exactly `PENDING`
3. Mark this task complete without making changes

This graceful handling allows the pipeline to continue when a loop iteration produces no actionable test candidates.

## When No Tests Are Available

If there are no items with status exactly `PENDING` in the plan file, append to `/Users/andres/Code/habit_tracking_app/Auto Run Docs/TEST_LOG_security-test_2026-02-25.md`:

```markdown
---

## [YYYY-MM-DD HH:MM] - Loop 00001 Complete

**Agent:** security-test
**Project:** security-test
**Loop:** 00001
**Status:** No PENDING tests available

**Summary:**

- Items IMPLEMENTED: [count]
- Items WON'T DO: [count]
- Items PENDING - MANUAL REVIEW: [count]

**Recommendation:** [Either "All automatable tests implemented" or "Remaining items need manual review"]
```

This signals to the pipeline that this loop iteration is complete.
