# Test Implementation Plan - Loop 00001

## Summary

- **Total Candidates:** 24
- **Auto-Implement (PENDING):** 14 - Est. coverage gain: +35.3%
- **Manual Review:** 6
- **Won't Do:** 4

## Current Coverage: 39.72%

## Target Coverage: 80%

## Estimated Post-Loop Coverage: 75.0%

---

## PENDING - Ready for Auto-Implementation

### TEST-001: calculateNewStrength (v2.0 Momentum Formula)

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Test File:** `convex/habitStrength.test.ts`
- **Test Cases Added:** 24 (pre-existing)
- **Coverage Gain:** Already included in baseline 39.72%
- **File:** `convex/habitStrength/momentum.ts`
- **Gap ID:** GAP-004
- **Importance:** CRITICAL
- **Testability:** EASY
- **Est. Coverage Gain:** +2.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test growth on completion with various streak lengths ✅
  - Test decay without completion (with and without streak shield) ✅
  - Test boundary conditions (0 strength, 100 strength) ✅
  - **Add edge cases:** negative currentStrength input, completionsLast7Days > 7 ✅
- **Mocks Needed:** None (pure function)
- **Note:** All test cases were already implemented in existing test file. Verified 24 passing tests covering all required scenarios.

### TEST-002: calculateMomentumStrengthSnapshot Edge Cases

- **Status:** `IMPLEMENTED`
- **Implemented In:** Loop 00001
- **Test File:** `convex/habitStrength.test.ts`
- **Test Cases Added:** 7
- **Coverage Gain:** +1.5% (estimated)
- **File:** `convex/habitStrength/momentum.ts`
- **Gap ID:** GAP-005
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +1.5%
- **Test Type:** Unit
- **Test Strategy:**
  - Test empty tracking array (earliestDateKey null case) ✅
  - Test earliestDate < creationDate branch ✅
  - Test startDate > evaluationDate early return (future creation date) ✅
  - Test tracking with no completions (empty completionDates Set) ✅
  - Test invalid date formats in tracking array ✅
  - Test throughDate defaulting to current date ✅
  - Test filtering only completed entries for completionDates ✅
- **Mocks Needed:** None (pure function with date inputs)
- **Note:** Added 7 edge case tests covering all specified scenarios plus additional boundary conditions.

### TEST-003: calculateStreakFromHistory

- **Status:** `PENDING`
- **File:** `convex/streakUtils.ts`
- **Gap ID:** GAP-024
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +2.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test consecutive days streak counting
  - Test gaps in completion history
  - Test backfill scenarios (past dates added later)
  - Test timezone edge cases (day boundaries)
- **Mocks Needed:** None (pure function)

### TEST-004: logisticBaseline Edge Cases

- **Status:** `PENDING`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-016
- **Importance:** MEDIUM
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Edge Case
- **Test Strategy:**
  - Test day 0 (creation date)
  - Test day 7 (calibration point)
  - Test day 90 (target)
  - Test day 365 (long-term)
- **Mocks Needed:** None (pure function)

### TEST-005: computeCompliance Zero Days

- **Status:** `PENDING`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-017
- **Importance:** MEDIUM
- **Testability:** EASY
- **Est. Coverage Gain:** +0.3%
- **Test Type:** Edge Case
- **Test Strategy:**
  - Test with empty tracking map
  - Test with evaluation date before habit creation
- **Mocks Needed:** None (pure function)

### TEST-006: parseDateKeyToLocalDate Validation

- **Status:** `PENDING`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-006
- **Importance:** MEDIUM
- **Testability:** EASY
- **Est. Coverage Gain:** +0.5%
- **Test Type:** Edge Case
- **Test Strategy:**
  - Test valid date formats (2025-01-15)
  - Test invalid month (2025-13-40)
  - Test malformed strings
- **Mocks Needed:** None (pure function)

### TEST-007: habits CRUD Operations - create.ts

- **Status:** `PENDING`
- **File:** `convex/habits/create.ts`
- **Gap ID:** GAP-001 (part 1)
- **Importance:** CRITICAL
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +2.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test habit creation with valid data
  - Test validation (line 19)
  - Test order calculation (line 23)
  - Test auth requirement
- **Mocks Needed:** Convex ctx (db, auth)

### TEST-008: habits CRUD Operations - toggle.ts

- **Status:** `PENDING`
- **File:** `convex/habits/toggle.ts`
- **Gap ID:** GAP-001 (part 2)
- **Importance:** CRITICAL
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +3.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test auth check (lines 21-23)
  - Test date validation (25-30)
  - Test ownership verification (37-39)
  - Test existing vs new tracking (48-56)
- **Mocks Needed:** Convex ctx (db, auth)

### TEST-009: habits CRUD Operations - update.ts

- **Status:** `PENDING`
- **File:** `convex/habits/update.ts`
- **Gap ID:** GAP-001 (part 3)
- **Importance:** CRITICAL
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +2.5%
- **Test Type:** Unit
- **Test Strategy:**
  - Test auth (14-17, 59-62)
  - Test ownership (26-28, 69-71)
  - Test validation (31, 74)
  - Test updateNotes mutation
- **Mocks Needed:** Convex ctx (db, auth)

### TEST-010: habits CRUD Operations - archive.ts

- **Status:** `PENDING`
- **File:** `convex/habits/archive.ts`
- **Gap ID:** GAP-001 (part 4)
- **Importance:** HIGH
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +4.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test archive mutation with auth and ownership
  - Test unarchive mutation
  - Test deleteAllArchived with cascading deletes (116-128)
- **Mocks Needed:** Convex ctx (db, auth)

### TEST-011: toggleHabit Future Date Validation

- **Status:** `PENDING`
- **File:** `convex/habits/toggle.ts`
- **Gap ID:** GAP-002
- **Importance:** HIGH
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +1.0%
- **Test Type:** Edge Case
- **Test Strategy:**
  - Test with invalid date formats
  - Test with future dates (should reject)
  - Test boundary cases (today, yesterday)
- **Mocks Needed:** Convex ctx (db, auth)

### TEST-012: list Query Authentication Branch

- **Status:** `PENDING`
- **File:** `convex/habits/list.ts`
- **Gap ID:** GAP-019
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +1.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test with mocked ctx.auth returning null identity
  - Verify empty array returned for unauthenticated users
- **Mocks Needed:** Convex ctx (auth only)

### TEST-013: Analytics Overview Stats

- **Status:** `PENDING`
- **File:** `convex/analyticsOverview.ts`
- **Gap ID:** GAP-009 (part 1)
- **Importance:** HIGH
- **Testability:** MEDIUM
- **Est. Coverage Gain:** +3.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test empty habits early return (19-26)
  - Test strength calculation loop (30-44)
  - Test ranking logic (46-62)
- **Mocks Needed:** Convex ctx (db, auth)

### TEST-014: getStreaksForHabit Helper

- **Status:** `PENDING`
- **File:** `convex/analytics.ts`
- **Gap ID:** GAP-010
- **Importance:** HIGH
- **Testability:** EASY
- **Est. Coverage Gain:** +2.0%
- **Test Type:** Unit
- **Test Strategy:**
  - Test consecutive days pattern
  - Test gaps in completion
  - Test "current" streak detection edge cases
- **Mocks Needed:** None (if extractable as pure function)

---

## PENDING - MANUAL REVIEW

### TEST-015: Toast Component

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `src/components/Toast.tsx`
- **Gap ID:** GAP-011
- **Importance:** HIGH
- **Testability:** HARD
- **Reason for Review:** Requires mocking react-native-reanimated shared values and react-native-gesture-handler. Complex animation logic.
- **Recommended Approach:**
  - Start with render tests for each variant
  - Mock Reanimated with jest-preset
  - Test onDismiss callback in isolation
  - Consider extracting animation logic to testable hooks

### TEST-016: SettingsModal Component

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `src/components/SettingsModal/SettingsModal.tsx`
- **Gap ID:** GAP-012
- **Importance:** HIGH
- **Testability:** HARD
- **Reason for Review:** Requires SafeAreaProvider wrapper (known blocker), multiple toggle handlers, navigation to ArchivedHabitsModal.
- **Recommended Approach:**
  - Fix SafeAreaProvider test utility first
  - Test toggle callbacks with mock handlers
  - Verify navigation state changes

### TEST-017: App.tsx Integration

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `App.tsx`
- **Gap ID:** GAP-014
- **Importance:** CRITICAL
- **Testability:** HARD
- **Reason for Review:** 545 lines with multiple providers, complex state, inline functions. Needs refactoring for testability.
- **Recommended Approach:**
  1. Extract `getHabitStatus` and `calculateStreak` to utility files
  2. Create `renderWithProviders` test utility
  3. Mock Clerk, Convex hooks, SecureStore
  4. Smoke test both auth paths

### TEST-018: updateHabitStrength Mutation

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-007
- **Importance:** HIGH
- **Testability:** HARD
- **Reason for Review:** Full integration mutation with date validation, tracking upsert, and strength calculation. Complex mock setup.
- **Recommended Approach:**
  - Create comprehensive mock ctx with db operations
  - Test the full flow with various scenarios

### TEST-019: recalculateHabitStrength Mutation

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `convex/habitStrength.ts`
- **Gap ID:** GAP-008
- **Importance:** MEDIUM
- **Testability:** HARD
- **Reason for Review:** Migration/recovery mutation. Needs habits with various tracking histories.
- **Recommended Approach:**
  - Test with habits that have different tracking patterns
  - Verify historical strength data integrity

### TEST-020: Analytics Queries (Remaining)

- **Status:** `PENDING - MANUAL REVIEW`
- **File:** `convex/analyticsTrend.ts`, `convex/analyticsWeekly.ts`, others
- **Gap ID:** GAP-009 (remaining parts)
- **Importance:** HIGH
- **Testability:** MEDIUM
- **Reason for Review:** Multiple files, each needs mock data setup. Group implementation recommended.
- **Recommended Approach:**
  - Create shared test fixtures for habits and tracking data
  - Test each query independently

---

## WON'T DO

### TEST-021: Template Definitions

- **Status:** `WON'T DO`
- **File:** `convex/templates.ts`
- **Gap ID:** GAP-015
- **Importance:** LOW
- **Testability:** MEDIUM
- **Reason:** 465 lines of mostly static template data. Low bug risk. Coverage gain not worth effort.

### TEST-022: Error Handlers (Habit Not Found)

- **Status:** `WON'T DO`
- **File:** `convex/habits.ts`
- **Gap ID:** GAP-003
- **Importance:** MEDIUM
- **Testability:** EASY
- **Reason:** Simple error throws that are unlikely to break. Other gaps provide more value.

### TEST-023: reorderHabits Empty Array Handling

- **Status:** `WON'T DO`
- **File:** `convex/habits.ts`
- **Gap ID:** GAP-018
- **Importance:** MEDIUM
- **Testability:** EASY
- **Reason:** Defensive edge case for frontend bug scenario. Low likelihood, low impact.

### TEST-024: ChainLinkIcon Render Branches

- **Status:** `WON'T DO`
- **File:** `src/components/ChainLinkIcon.tsx`
- **Gap ID:** GAP-023
- **Importance:** LOW
- **Testability:** EASY
- **Reason:** Purely decorative component with 83% branch coverage already. Low priority.

---

## DEFERRED - Low Priority for 80% Goal

### TEST-025: EmptyState Component

- **Status:** `DEFERRED`
- **File:** `src/components/EmptyState.tsx`
- **Gap ID:** GAP-013
- **Importance:** MEDIUM
- **Testability:** EASY
- **Reason:** Simple render component. Can be done if time permits after hitting 75%.

### TEST-026: BinaryHeatmap Branch Coverage

- **Status:** `DEFERRED`
- **File:** `src/components/BinaryHeatmap/StatsRow.tsx`, `BinaryCell.tsx`
- **Gap ID:** GAP-020, GAP-021
- **Importance:** MEDIUM
- **Testability:** MEDIUM
- **Reason:** Already has 50%+ coverage. Incremental improvement, lower priority.

### TEST-027: RewardCelebrationToast Branches

- **Status:** `DEFERRED`
- **File:** `src/components/RewardCelebrationToast.tsx`
- **Gap ID:** GAP-022
- **Importance:** MEDIUM
- **Testability:** MEDIUM
- **Reason:** Already has 50% branch coverage. Animation testing complexity.

---

## Implementation Order

Recommended sequence based on coverage impact and dependencies:

1. **TEST-001** - calculateNewStrength edge cases (+2.0% coverage) - Pure function, no mocking
2. **TEST-002** - calculateMomentumStrengthSnapshot edge cases (+1.5% coverage) - Pure function
3. **TEST-003** - calculateStreakFromHistory (+2.0% coverage) - Pure function
4. **TEST-004** - logisticBaseline edge cases (+0.5% coverage) - Pure function
5. **TEST-005** - computeCompliance zero days (+0.3% coverage) - Pure function
6. **TEST-006** - parseDateKeyToLocalDate (+0.5% coverage) - Pure function
7. **TEST-014** - getStreaksForHabit (+2.0% coverage) - May be pure function
8. **TEST-012** - list authentication (+1.0% coverage) - Simple mock
9. **TEST-007** - create.ts (+2.0% coverage) - Establishes ctx mock pattern
10. **TEST-008** - toggle.ts (+3.0% coverage) - Critical path
11. **TEST-009** - update.ts (+2.5% coverage) - Uses established pattern
12. **TEST-010** - archive.ts (+4.0% coverage) - Uses established pattern
13. **TEST-011** - toggleHabit edge cases (+1.0% coverage) - Uses established pattern
14. **TEST-013** - Analytics overview (+3.0% coverage) - Uses established pattern

**Total Estimated Gain: ~26% from PENDING tests**
**Plus MANUAL REVIEW tests: ~9% additional**

## Dependencies

Tests that share setup or mocking infrastructure:

- **Group A: Pure Functions (TEST-001 through TEST-006, TEST-014):**
  - No mocking needed
  - Can run independently and in parallel
  - Should implement first to establish baseline

- **Group B: Convex Habits Mutations (TEST-007 through TEST-012):**
  - All need Convex ctx mock with db and auth
  - Create shared mock factory once
  - Implement sequentially starting with create.ts

- **Group C: Analytics Queries (TEST-013, TEST-020):**
  - All need Convex ctx with mock habit/tracking data
  - Share test fixtures

- **Group D: React Native Components (TEST-015, TEST-016):**
  - All need SafeAreaProvider wrapper
  - Some need Reanimated/GestureHandler mocks
  - Address SafeAreaProvider blocker first

- **Group E: Integration Tests (TEST-017):**
  - Needs all providers mocked
  - Depends on Groups B-D infrastructure

## Blockers to Address

Before starting implementation:

1. **SafeAreaProvider Test Utility:** Create wrapper for component tests
2. **Convex Mock Factory:** Create ctx mock with configurable db state
3. **Update Jest Setup:** Add DevMenu mock to fix TurboModule errors
4. **Update Snapshots:** Run `jest -u` after verifying changes

---

_Generated: 2026-01-27_
_Agent: Tests_
_Loop: 00001_
