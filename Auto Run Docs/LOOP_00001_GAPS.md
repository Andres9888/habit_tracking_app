---
type: report
title: Test Gaps - Loop 00001
tags:
  - test-coverage
related:
  - '[[1_ANALYZE]]'
created: 2026-02-25
---

# Test Gaps - Loop 00001

## Summary

- **Total Gaps Found:** 14
- **By Type:** 8 Unit, 4 Integration, 2 Edge Case
- **By Priority:** 3 Critical, 9 High, 2 Medium

## Gap List

### GAP-001: `index.ts` bootstrap behavior

- **File:** `index.ts`
- **Location:** Lines 1-9
- **Type:** Unit
- **Description:** No test exercises app bootstrap path (`registerRootComponent`) or `import 'react-native-gesture-handler'` / `import 'react-native-reanimated'` side effects.
- **Current Coverage:** 0.00% lines (0/1), 0.00% funcs (0/0), 0.00% branches (0/0)
- **Why It Matters:** App startup can fail due to environment-specific side effects even when app logic is untouched.
- **Test Approach:** Add smoke test for entrypoint bootstrap that imports module and asserts no throw and that mocked `registerRootComponent` is called with `App`.

### GAP-002: `StreakMilestoneCelebration` animation/visibility branches

- **File:** `src/components/StreakMilestoneCelebration/StreakMilestoneCelebration.tsx`
- **Location:** Lines 54-115 and 117-128
- **Type:** Integration
- **Description:** Both `visible` branches (`reduceMotion` vs animated path), reset logic, and modal/Confetti interaction are untested.
- **Current Coverage:** 1.79% lines (1/56), 0.00% funcs (0/8), 0.00% branches (0/7)
- **Why It Matters:** Regression risk includes accessibility announcements, modal behavior, and animation regressions that affect a primary success/fidelity journey.
- **Test Approach:** Render with both `reduceMotion` states, assert animation style transitions, verify accessibility text, and confirm `onClose` handler wiring through `<Modal>`/buttons.

### GAP-003: `useArchivedHabitsModalLogic` restore/delete callbacks

- **File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.hooks.ts`
- **Location:** Lines 17-98
- **Type:** Unit
- **Description:** Restore, permanent delete, and bulk delete flows, including `try/catch` and confirmation callback branches, are effectively untested.
- **Current Coverage:** 2.50% lines (1/40), 0.00% funcs (0/7), 0.00% branches (0/14)
- **Why It Matters:** Incorrect error handling or missing side effects (haptics, Alert, DB mutations) can break archived data management silently.
- **Test Approach:** Unit test hook with mocked Convex hooks to cover success + failure branches for each handler and pluralization/disabled states.

### GAP-004: `FrameMonitor` control-flow and sample lifecycle

- **File:** `src/lib/performance/FrameMonitor.ts`
- **Location:** Lines 30-87
- **Type:** Unit
- **Description:** `start()` idempotent guard, scheduling recursion, sampling gate (`frameTime > 0 && frameTime < 1000`), full-window collection logic, and `stop/clear` behaviors are not covered.
- **Current Coverage:** 2.50% lines (1/40), 0.00% funcs (0/12), 0.00% branches (0/14)
- **Why It Matters:** Performance regressions can go undetected without monitoring tests, especially frame drop and stop/start lifecycle bugs.
- **Test Approach:** Fake timers + mocked `requestAnimationFrame`/`cancelAnimationFrame` + deterministic `now()` injection to validate transitions from monitoring to inactive state.

### GAP-005: Calendar grid generation and selection branching

- **File:** `src/components/CalendarTimeline/components/MiniCalendarGrid.tsx`
- **Location:** Lines 32-95
- **Type:** Unit
- **Description:** `weeks` construction, in-month filtering, future-date disable behavior, dot rendering, and day-label rendering are untested.
- **Current Coverage:** 4.00% lines (1/25), 0.00% funcs (0/6), 0.00% branches (0/14)
- **Why It Matters:** Incorrect date grid logic directly impacts core calendar/completion UX and can hide completion state or create invalid taps.
- **Test Approach:** Render with edge dates (month boundaries, first/last week), click future vs past dates, and verify computed cells, `onSelectDate` suppression expectations, and dot/today highlighting states.

### GAP-006: Notification permission wrapper not lazy-loaded/tested

- **File:** `src/utils/notifications/index.ts`
- **Location:** Lines 30-33
- **Type:** Integration
- **Description:** `ensureNotificationPermissions` lazy dynamic import path is untested, including rejection and propagation behavior.
- **Current Coverage:** 5.00% lines (1/20), 10.00% funcs (1/10), 0.00% branches (0/0)
- **Why It Matters:** Permission failures are user-facing and can block scheduling/retrieval paths across app lifecycle.
- **Test Approach:** Mock dynamic import module resolution and verify returned promise behavior and error handling in permission-denied and permission-granted states.

### GAP-007: Notification habit reminder wrappers

- **File:** `src/utils/notifications/index.ts`
- **Location:** Lines 35-78
- **Type:** Unit
- **Description:** `cancelHabitReminder` and `scheduleHabitReminder` wrappers are not covered, so parameter forwarding and module import delegation are unvalidated.
- **Current Coverage:** 5.00% lines (1/20), 10.00% funcs (1/10), 0.00% branches (0/0)
- **Why It Matters:** Wrapper-level regressions break notification scheduling for core habit flows while tests may still pass elsewhere.
- **Test Approach:** Mock `./habitReminders` module and assert lazy import + argument forwarding for success and reject paths.

### GAP-008: Letter notification wrappers

- **File:** `src/utils/notifications/index.ts`
- **Location:** Lines 47-78
- **Type:** Unit
- **Description:** `cancelLetterUnlockNotification`, `getScheduledLetterUnlockNotifications`, and `scheduleLetterUnlockNotification` all lack coverage.
- **Current Coverage:** 5.00% lines (1/20), 10.00% funcs (1/10), 0.00% branches (0/0)
- **Why It Matters:** Feature acceptance paths for letters likely rely on these wrappers for scheduling and cleanup.
- **Test Approach:** Add unit tests for each wrapper confirming lazy import, parameter passthrough, and call order.

### GAP-009: Affirmation notification wrappers

- **File:** `src/utils/notifications/index.ts`
- **Location:** Lines 80-122
- **Type:** Unit
- **Description:** Affirmation cancellation and scheduling wrapper family is currently untested.
- **Current Coverage:** 5.00% lines (1/20), 10.00% funcs (1/10), 0.00% branches (0/0)
- **Why It Matters:** Silent wrapper regression can block scheduled affirmations without obvious feature-level errors.
- **Test Approach:** Unit mock `./affirmations/*` modules and assert each function delegates correctly and handles promise rejection.

### GAP-010: `updateHabitStrength` mutation auth and update logic

- **File:** `convex/habitStrength/updateStrength.ts`
- **Location:** Lines 13-96
- **Type:** Integration
- **Description:** No covered execution for auth check, authorization failure, date validation, insert-vs-update tracking path, or metrics update computations.
- **Current Coverage:** 3.03% lines (1/33), 0.00% funcs (0/3), 0.00% branches (0/21)
- **Why It Matters:** This mutation affects strength progression; untested logic can corrupt progression math or bypass validation constraints.
- **Test Approach:** Convex integration tests with authenticated/unauthenticated users, valid/invalid date, existing/missing tracking record, and success/error branches.

### GAP-011: Authenticated and empty-state branches in `getAllHabitsStrengthStats`

- **File:** `convex/habitStrength/allHabitsStats.ts`
- **Location:** Lines 12-63
- **Type:** Edge Case
- **Description:** Missing coverage for unauthenticated path, no-habits path, max/min strength updates, and distribution counting across all levels.
- **Current Coverage:** 3.85% lines (1/26), 0.00% funcs (0/3), 0.00% branches (0/12)
- **Why It Matters:** Stats UI/automation may misreport progress states and distribution when edge cases are untested.
- **Test Approach:** Add Convex query tests for anonymous identity null, empty dataset, single habit, and multi-habit distribution scenarios.

### GAP-012: Convex coverage gap explosion in non-target modules

- **File:** `convex/`
- **Location:** Multiple files listed as 0% in the current coverage report
- **Type:** Edge Case
- **Description:** Multiple Convex modules are currently at or near 0% statement/function/branch coverage in this pass.
- **Current Coverage:** 0.00% on listed files from the report context
- **Why It Matters:** Backend feature parity cannot be validated while most Convex endpoints remain untested.
- **Test Approach:** After test infra stabilizes, create grouped query/mutation tests by domain (`habit`, `habitStrength`, `tracking`, `analytics`, `notifications`, `templates`).

### GAP-013: Notification command exports re-exported constants

- **File:** `src/utils/notifications/index.ts`
- **Location:** Lines 4-24
- **Type:** Unit
- **Description:** Re-exported enums/types/constants should be covered by import-shape tests to catch accidental export breakage and tree-shaking regressions.
- **Current Coverage:** 5.00% lines (1/20), 10.00% funcs (1/10), 0.00% branches (0/0)
- **Why It Matters:** Consumers rely on stable exports; export regressions can surface as runtime failures during scheduling pipelines.
- **Test Approach:** Add an index contract test and assert all expected exports are defined.

### GAP-014: Notification dependency path and offline behavior in high-risk user flows

- **File:** `src/utils/notifications/index.ts`
- **Location:** Lines 30-122
- **Type:** Integration
- **Description:** Cross-file lazy loading and async error propagation for notification wrappers has no integration-level test around offline/failure scenarios.
- **Current Coverage:** 5.00% lines (1/20), 10.00% funcs (1/10), 0.00% branches (0/0)
- **Why It Matters:** Real user conditions often involve rejected notification calls; without tests, fallback behavior can regress unnoticed.
- **Test Approach:** Integration test with mocked module failures and offline flags to verify no unhandled rejections and stable app behavior.

## Gaps by File

| File                                                                       | Gap Count | Types                 |
| -------------------------------------------------------------------------- | --------- | --------------------- |
| `index.ts`                                                                 | 1         | 1 Unit                |
| `src/components/StreakMilestoneCelebration/StreakMilestoneCelebration.tsx` | 1         | 1 Integration         |
| `src/components/ArchivedHabitsModal/ArchivedHabitsModal.hooks.ts`          | 1         | 1 Unit                |
| `src/lib/performance/FrameMonitor.ts`                                      | 1         | 1 Unit                |
| `src/components/CalendarTimeline/components/MiniCalendarGrid.tsx`          | 1         | 1 Unit                |
| `src/utils/notifications/index.ts`                                         | 5         | 4 Unit, 1 Integration |
| `convex/habitStrength/updateStrength.ts`                                   | 1         | 1 Integration         |
| `convex/habitStrength/allHabitsStats.ts`                                   | 1         | 1 Edge Case           |
| `convex/*` (additional untested domains)                                   | 1         | 1 Edge Case           |

## Dependencies to Mock

- **`react-native-reanimated`** - Used in `StreakMilestoneCelebration`; mock shared values and animation functions in tests.
- **`react-native` `Alert` / `expo-haptics`** - Used in `ArchivedHabitsModal.hooks` for user alerts and vibration feedback.
- **`requestAnimationFrame`, `cancelAnimationFrame`, `FrameMonitor` timing** - Used in `FrameMonitor`; mock scheduler and deterministic timing source.
- **`convex/react`, `ctx.auth`, `ctx.db`** - Used in Convex modules (`updateStrength`, `allHabitsStats`, and broad Convex file set); mock in a stable Convex test harness.
- **`expo-notifications`-adjacent modules via lazy imports** - `src/utils/notifications/index.ts` delegates to multiple modules; mock those module namespaces per function group.

## Blockers

- **Large Convex surface area remains below-coverage in this report iteration.** Current report and test run captured 0%/low coverage across broad Convex modules; adding reliable backend gaps likely needs test harness stabilization before risk-adjusted expansion.
- **Coverage run had failing suites (`190 failed`, `156 passed`) in prior cycle.** This increases confidence risk for any new backend assertions unless pre-existing suite health is addressed.
