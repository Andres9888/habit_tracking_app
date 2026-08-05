---
type: report
title: Test Implementation Plan - Loop 00001
created: 2026-02-25
tags:
  - test-coverage
  - loop-00001
related:
  - '[[3_EVALUATE]]'
  - '[[LOOP_00001_GAPS]]'
---

# Test Implementation Plan - Loop 00001

## Summary

- **Total Candidates:** 14
- **Auto-Implement (PENDING):** 10 - Est. coverage gain: +8.4%
- **Manual Review:** 3
- **Won't Do:** 1

## Current Coverage: 36.58%

## Target Coverage: 80%

## Estimated Post-Loop Coverage: 44.98%

---

## PENDING - Ready for Auto-Implementation

### TEST-001: App bootstrap side-effect initialization

- **Status:** `PENDING`
- **File:** `index.ts`
- **Gap ID:** GAP-001
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +1.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Render/require `index.ts` with mocked `registerRootComponent` and assert it is called with `App`.
  - Assert import side effects for `react-native-gesture-handler` and `react-native-reanimated` are invoked and do not throw.
  - Verify no duplicate side effects when importing repeatedly.
- **Mocks Needed:** `react-native`, `react-native-gesture-handler`, `react-native-reanimated`

### TEST-002: FrameMonitor lifecycle and sampling controls

- **Status:** `IMPLEMENTED`
- **File:** `src/lib/performance/FrameMonitor.ts`
- **Gap ID:** GAP-004
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +1.0%
- **Test Type:** Unit
- **Implemented In:** Loop 00001
- **Test File:** `tests/performance/FrameMonitor.test.ts`
- **Test Cases Added:** 4
- **Coverage Gain:** +1.0% (estimated)
- **Test Strategy:**
  - Start monitor with controlled timer and assert idempotent guard prevents duplicate RAF scheduling.
  - Feed controlled frame times and assert valid-window samples are recorded.
  - Confirm `stop()` cancels frame loop and clears all counters.
  - Validate reset and window rollover behavior.
- **Mocks Needed:** `requestAnimationFrame`, `cancelAnimationFrame`, timer source

### TEST-003: Calendar mini-grid generation and selection logic

- **Status:** `PENDING`
- **File:** `src/components/CalendarTimeline/components/MiniCalendarGrid.tsx`
- **Gap ID:** GAP-005
- **Importance:** HIGH
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +1.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Render with boundary month dates and verify week array shape.
  - Assert non-current-month day filtering matches previous logic.
  - Validate disabled future dates block `onSelectDate` callbacks.
  - Verify today's dot/today markers and completion dots render for in-range entries.
- **Mocks Needed:** `date-fns`/calendar date provider

### TEST-004: Notification permission wrapper lazy import behavior

- **Status:** `PENDING`
- **File:** `src/utils/notifications/index.ts`
- **Gap ID:** GAP-006
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Integration
- **Test Strategy:**
  - Mock the lazy import module and validate a success path from `ensureNotificationPermissions`.
  - Mock rejection in the dynamic import and verify the promise rejects through wrapper.
  - Validate permission result shape is forwarded unchanged.
- **Mocks Needed:** `./notifications/permissions`, `jest.unstable_mockModule` / module factory

### TEST-005: Notification habit reminder wrappers

- **Status:** `PENDING`
- **File:** `src/utils/notifications/index.ts`
- **Gap ID:** GAP-007
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +0.8%
- **Test Type:** Unit
- **Test Strategy:**
  - Mock `./habitReminders` and assert `cancelHabitReminder` and `scheduleHabitReminder` are delegated with passthrough args.
  - Validate wrapper resolves to imported function result.
- **Mocks Needed:** `src/utils/notifications/habitReminders.ts`

### TEST-006: Letter reminder wrapper coverage

- **Status:** `PENDING`
- **File:** `src/utils/notifications/index.ts`
- **Gap ID:** GAP-008
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +0.6%
- **Test Type:** Unit
- **Test Strategy:**
  - Mock `./letterReminders` and validate cancellation/get/schedule wrappers call correct export.
  - Verify each function forwards arguments in the expected order.
- **Mocks Needed:** `src/utils/notifications/letterReminders.ts`

### TEST-007: Affirmation wrapper delegation

- **Status:** `PENDING`
- **File:** `src/utils/notifications/index.ts`
- **Gap ID:** GAP-009
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +0.6%
- **Test Type:** Unit
- **Test Strategy:**
  - Mock affirmation notification modules and assert all three wrapper functions delegate correctly.
  - Verify rejected wrapper promises propagate and can be caught by callers.
- **Mocks Needed:** `src/utils/notifications/affirmations/*`

### TEST-008: Habit strength mutation auth and branching

- **Status:** `PENDING`
- **File:** `convex/habitStrength/updateStrength.ts`
- **Gap ID:** GAP-010
- **Importance:** CRITICAL
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +1.5%
- **Test Type:** Integration
- **Test Strategy:**
  - Test unauthenticated call returns authorization error.
- Test authenticated create path with valid date and missing existing row.
  - Test update path when an existing tracking row is present.
  - Validate invalid date formatting and metric output errors.
- **Mocks Needed:** Convex test harness (`ctx.auth`, `ctx.db`), date helpers

### TEST-009: Habits strength stats edge behavior

- **Status:** `PENDING`
- **File:** `convex/habitStrength/allHabitsStats.ts`
- **Gap ID:** GAP-011
- **Importance:** MEDIUM
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +0.8%
- **Test Type:** Edge Case
- **Test Strategy:**
  - Assert unauthenticated request returns expected unauthenticated branch.
  - Assert empty habits path returns baseline distribution and zero metrics.
  - Validate min/max and full distribution updates across multiple habit strengths.
- **Mocks Needed:** Convex query test harness (`ctx.auth`, `ctx.db`)

### TEST-010: Notification export contract validation

- **Status:** `IMPLEMENTED`
- **File:** `src/utils/notifications/index.ts`
- **Gap ID:** GAP-013
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Unit
- **Implemented In:** Loop 00001
- **Test File:** `src/utils/__tests__/notifications.test.ts`
- **Test Cases Added:** 3
- **Test Strategy:**
  - Import and assert all documented enum/type/function exports are present.
  - Add guard tests that fail if renamed/removed exports regress.
  - Include smoke test for tree-shaking-safe export shape.
- **Mocks Needed:** None

## PENDING - MANUAL REVIEW

### TEST-011: Milestone celebration reduce-motion and animation branches

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `src/components/StreakMilestoneCelebration/StreakMilestoneCelebration.tsx`
- **Gap ID:** GAP-002
- **Importance:** HIGH
- **Testability:** HARD
- **Reason for Review:** Mixed animation, modal state transitions, reduced-motion branches, and accessibility behavior likely need targeted manual assertions for stability across UI runtimes.
- **Recommended Approach:** Pair component tests with mocked `react-native-reanimated` and snapshot+semantic checks; validate focus order and modal close callback behavior under both visibility modes.
- **Mock Notes:** Reanimated, Modal/Confetti internals, screen reader tree mocks.

### TEST-012: Archived habits hook side-effect and confirmation flows

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.hooks.ts`
- **Gap ID:** GAP-003
- **Importance:** CRITICAL
- **Testability:** HARD
- **Reason for Review:** Requires coordinated hook testing across haptics, alert prompts, DB mutations, and async error branches to avoid false positives from unstable hook state transitions.
- **Recommended Approach:** Add explicit unit tests with controlled Convex hook mocks and staged user confirmation simulations.
- **Mock Notes:** Convex hooks, `Alert`, `expo-haptics`, habit mutations.

### TEST-013: Notification offline/failure integration behavior

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `src/utils/notifications/index.ts`
- **Gap ID:** GAP-014
- **Importance:** HIGH
- **Testability:** HARD
- **Reason for Review:** Offline/failure simulation combines cross-module lazy loading, asynchronous rejection pathways, and runtime environment assumptions.
- **Recommended Approach:** Add targeted integration tests with network/permission failure simulation and verify no unhandled rejections.
- **Mock Notes:** Notification modules, offline flag/state, environment permissions.

## WON'T DO

### TEST-014: Broad Convex surface area coverage baseline

- **Status:** `WON'T DO`
- **File:** `convex/`
- **Gap ID:** GAP-012
- **Importance:** HIGH
- **Testability:** VERY HARD
- **Reason:** Module set is broad and lacks stable test harness coverage patterns for this loop; requires pre-planned backend test infrastructure expansion before meaningful prioritization.

---

## Implementation Order

1. **TEST-010** - Notification export contract validation (+0.5% coverage)
2. **TEST-001** - App bootstrap side-effect initialization (+1.0% coverage)
3. **TEST-004** - Notification permission wrapper behavior (+0.5% coverage)
4. **TEST-002** - FrameMonitor lifecycle and sampling controls (+1.0% coverage)
5. **TEST-005** - Notification habit reminder wrappers (+0.8% coverage)
6. **TEST-008** - Habit strength mutation auth and branching (+1.5% coverage)
7. **TEST-006** - Letter reminder wrapper coverage (+0.6% coverage)
8. **TEST-007** - Affirmation wrapper delegation (+0.6% coverage)
9. **TEST-003** - Calendar mini-grid generation and selection logic (+1.0% coverage)
10. **TEST-009** - Habits strength stats edge behavior (+0.8% coverage)

## Dependencies

- **Group A:** TEST-006, TEST-007, TEST-004 - Shared notification module mock setup and import interception strategy.
- **Group B:** TEST-008, TEST-009 - Shared Convex test fixture setup and identity/auth stubs.
- **Group C:** TEST-001 - Shared app bootstrap environment mocks.
