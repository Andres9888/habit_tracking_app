# Test Gaps - Loop 00001

## Summary

- **Total Gaps Found:** 24
- **By Type:** 14 Unit, 6 Integration, 4 Edge Cases
- **By Priority:** 6 Critical, 10 High, 8 Medium
- **Current Overall Coverage:** 39.72%
- **Target Coverage:** 80%

**Note (Updated 2026-01-27):** The codebase has been decomposed into smaller files following the project's ≤100 line rule. The `convex/habits.ts` file is now a barrel export that re-exports from decomposed modules in `convex/habits/`. Similarly, `convex/habitStrength.ts` is a barrel export from `convex/habitStrength/`. Test targets should reference the actual implementation files.

## Gap List

### GAP-001: convex/habits/\* - All CRUD Operations (Decomposed)

- **File:** `convex/habits/` directory (barrel: `convex/habits.ts`)
- **Implementation Files:**
  - `convex/habits/create.ts` (49 lines)
  - `convex/habits/toggle.ts` (100 lines)
  - `convex/habits/update.ts` (82 lines)
  - `convex/habits/archive.ts` (135 lines)
  - `convex/habits/pause.ts`
  - `convex/habits/remove.ts`
  - `convex/habits/reorder.ts`
  - `convex/habits/get.ts`, `convex/habits/list.ts`, `convex/habits/getTracking.ts`, `convex/habits/stats.ts`
- **Type:** Unit
- **Priority:** Critical
- **Description:** The habits module has been decomposed but all files have 0% coverage. Each file contains focused mutations/queries including `create`, `update`, `archive`, `unarchive`, `pause`, `resume`, `reorderHabits`, `remove`, `restore`, `get`, `list`, `listArchived`, `deleteAllArchived`, `listPaused`, `toggleHabit`, `getTracking`, and `getStats`.
- **Current Coverage:** 0% total (~500 lines across files)
- **Why It Matters:** Core habit CRUD operations affect every user interaction. These are the most critical business logic functions in the app. Bugs here corrupt user data or break the main user flow.
- **Test Approach:** Create unit tests with mocked Convex context. Test each mutation handler in isolation with fixture data.
- **Key Untested Functions:**
  - `toggle.ts:toggleHabit` - Auth check (lines 21-23), date validation (25-30), ownership (37-39), existing vs new tracking (48-56)
  - `create.ts:create` - Validation (line 19), order calculation (line 23)
  - `update.ts:update/updateNotes` - Auth (14-17, 59-62), ownership (26-28, 69-71), validation (31, 74)
  - `archive.ts:archive/unarchive/deleteAllArchived` - Auth, ownership, cascading deletes (116-128)

### GAP-002: convex/habits.ts - toggleHabit Future Date Validation

- **File:** `convex/habits.ts`
- **Location:** Lines 744-762
- **Type:** Edge Case
- **Priority:** High
- **Description:** The `toggleHabit` function validates date format and prevents future dates, but these branches are untested.
- **Current Coverage:** 0%
- **Why It Matters:** Invalid date handling could allow data corruption or confusing error messages.
- **Test Approach:** Test with invalid date formats, future dates, and boundary cases (today, yesterday).

### GAP-003: convex/habits.ts - Error Handlers (Habit Not Found)

- **File:** `convex/habits.ts`
- **Location:** Lines 148-151, 168-171, 203-206, 230-233, 294-296
- **Type:** Edge Case
- **Priority:** Medium
- **Description:** Multiple functions throw "Habit not found" errors but these catch paths are not tested.
- **Current Coverage:** 0%
- **Why It Matters:** Error handling paths should return proper error messages and not crash the app.
- **Test Approach:** Call mutations with non-existent habit IDs and verify error messages.

### GAP-004: convex/habitStrength/momentum.ts - calculateNewStrength (v2.0 Momentum Formula)

- **File:** `convex/habitStrength/momentum.ts` (barrel: `convex/habitStrength.ts`)
- **Location:** Lines 22-37
- **Type:** Unit
- **Priority:** Critical (PARTIALLY RESOLVED)
- **Description:** The v2.0 momentum-based strength formula `calculateNewStrength` now HAS tests in `convex/habitStrength.test.ts`. Tests cover growth on completion, decay with streak shield, boundary conditions. The legacy `calculateHabitStrength` in `legacyFormula.ts` also has extensive tests.
- **Current Coverage:** ~70% (tests exist in habitStrength.test.ts, lines 22-304)
- **Remaining Gaps:**
  - Edge case: negative currentStrength input (clamped to 0)
  - Edge case: completionsLast7Days > 7 (clamped)
- **Why It Matters:** This is the ACTUAL formula used when users toggle habits.
- **Test Approach:** Existing tests are comprehensive. Add edge cases for input clamping.

### GAP-005: convex/habitStrength/momentum.ts - calculateMomentumStrengthSnapshot

- **File:** `convex/habitStrength/momentum.ts` (barrel: `convex/habitStrength.ts`)
- **Location:** Lines 40-114
- **Type:** Unit
- **Priority:** High (PARTIALLY RESOLVED)
- **Description:** The day-by-day momentum simulation function HAS tests in `convex/habitStrength.test.ts` (lines 347-384). Tests cover decay between completions and backfilled dates.
- **Current Coverage:** ~60%
- **Remaining Gaps:**
  - Line 59-62: `earliestDateKey` null case (empty tracking array)
  - Lines 64-67: earliestDate < creationDate branch
  - Lines 69-76: startDate > evaluationDate early return (future creation date)
  - Lines 78-80: tracking with no completions (empty completionDates Set)
- **Why It Matters:** Incorrect snapshot calculations would show wrong strength levels to users.
- **Test Approach:** Add tests for empty tracking, future creation date, no completions scenarios.

### GAP-006: convex/habitStrength.ts - parseDateKeyToLocalDate Validation

- **File:** `convex/habitStrength.ts`
- **Location:** Lines 158-177
- **Type:** Edge Case
- **Priority:** Medium
- **Description:** Date parsing with validation for invalid dates (e.g., 2025-13-40) is untested.
- **Current Coverage:** 0%
- **Why It Matters:** Invalid dates could cause crashes or incorrect strength calculations.
- **Test Approach:** Test with valid dates, invalid month/day values, malformed strings.

### GAP-007: convex/habitStrength.ts - updateHabitStrength Mutation

- **File:** `convex/habitStrength.ts`
- **Location:** Lines 607-720
- **Type:** Integration
- **Priority:** High
- **Description:** The Convex mutation that updates habit strength is untested. It includes date validation, tracking record upsert, and strength calculation.
- **Current Coverage:** 0%
- **Why It Matters:** This is the API endpoint that frontends call. Bugs here affect real user data.
- **Test Approach:** Mock Convex context and test the full mutation flow.

### GAP-008: convex/habitStrength.ts - recalculateHabitStrength Mutation

- **File:** `convex/habitStrength.ts`
- **Location:** Lines 727-789
- **Type:** Integration
- **Priority:** Medium
- **Description:** The recalculation mutation for initializing strength on existing habits is untested.
- **Current Coverage:** 0%
- **Why It Matters:** Used for migrations and data recovery. Incorrect recalculation could corrupt historical strength data.
- **Test Approach:** Test with habits that have various tracking histories.

### GAP-009: convex/analytics\*.ts - All Analytics Queries (Decomposed)

- **Files:**
  - `convex/analytics.ts` (barrel export, 31 lines)
  - `convex/analyticsOverview.ts` (89 lines) - `getOverviewStats`
  - `convex/analyticsTrend.ts` (54 lines) - `get30DayTrend`
  - `convex/analyticsWeekly.ts` (77 lines) - `getWeeklyInsights`, `generateWeeklyInsights`
  - `convex/analyticsCompliance.ts` - `getComplianceData`
  - `convex/analyticsDistribution.ts` - `getStrengthDistribution`
  - `convex/analytics/weeklyHelpers.ts` - Helper functions
- **Type:** Unit
- **Priority:** High
- **Description:** All 6 analytics queries are untested. Each file is focused but has no coverage.
- **Current Coverage:** 0% (~300 lines total)
- **Why It Matters:** Analytics drive the dashboard visualizations. Wrong data could mislead users about their progress.
- **Test Approach:** Create tests with mock habit and tracking data, verify correct aggregation and calculations.
- **Key Untested Functions:**
  - `analyticsOverview.ts:getOverviewStats` - Empty habits early return (19-26), strength calculation loop (30-44), ranking (46-62)
  - `analyticsTrend.ts:get30DayTrend` - Date iteration (33-50), completion rate calculation (41-44)
  - `analyticsWeekly.ts:getWeeklyInsights` - Week date calculation (26-28), habit change categorization (54-55)

### GAP-010: convex/analytics.ts - getStreaksForHabit Helper

- **File:** `convex/analytics.ts`
- **Location:** Lines 20-77
- **Type:** Unit
- **Priority:** High
- **Description:** The streak calculation helper function is untested. Contains complex date logic for current/longest streak.
- **Current Coverage:** 0%
- **Why It Matters:** Incorrect streaks would undermine user motivation and trust.
- **Test Approach:** Test with various completion patterns: consecutive days, gaps, edge cases around "current" detection.

### GAP-011: src/components/Toast.tsx - All Functionality

- **File:** `src/components/Toast.tsx`
- **Location:** Lines 1-328
- **Type:** Unit
- **Priority:** High
- **Description:** The Toast component has 0% coverage. Includes animation logic, gesture handling (swipe to dismiss), auto-dismiss timer, and multiple variants.
- **Current Coverage:** 0%
- **Why It Matters:** Toast is critical UI feedback for habit completion, errors, and undo prompts. Broken toasts degrade UX significantly.
- **Test Approach:** Test rendering of each variant, auto-dismiss behavior, onDismiss callback, undo action handling. May need to mock Reanimated and Gesture Handler.

### GAP-012: src/components/SettingsModal/SettingsModal.tsx - All Functionality

- **File:** `src/components/SettingsModal/SettingsModal.tsx`
- **Location:** Lines 1-218
- **Type:** Unit
- **Priority:** High
- **Description:** SettingsModal has 0% coverage. Includes toggle handlers for multiple settings, view switching to ArchivedHabitsModal, and theme-based styling.
- **Current Coverage:** 0%
- **Why It Matters:** Settings control visual preferences and habit management features. Broken settings would frustrate users.
- **Test Approach:** Wrap in SafeAreaProvider (known issue), test toggle callbacks, test navigation to archived habits view.

### GAP-013: src/components/EmptyState.tsx

- **File:** `src/components/EmptyState.tsx`
- **Location:** Full file
- **Type:** Unit
- **Priority:** Medium
- **Description:** EmptyState component is completely untested.
- **Current Coverage:** 0%
- **Why It Matters:** Empty states are shown when users have no habits. First-time user experience depends on this.
- **Test Approach:** Simple render test, verify CTA button callback.

### GAP-014: App.tsx - Main Entry Point

- **File:** `App.tsx`
- **Location:** Lines 1-545
- **Type:** Integration
- **Priority:** Critical
- **Description:** Main app entry point has 0% coverage. Contains provider setup (Clerk, Convex, Paper, SafeArea, GestureHandler, Sentry), HabitsApp component with extensive state management, theme logic, and date calculations.
- **Current Coverage:** 0% (545 lines - significantly larger than previously noted)
- **Why It Matters:** If the app fails to initialize properly, nothing works. Contains critical logic:
  - Lines 79-234: `HabitsApp` component with all state hooks and callbacks
  - Lines 101-132: High contrast theme calculation (memoized)
  - Lines 135-146: Week date calculation (memoized)
  - Lines 197-214: `getHabitStatus` function with timezone-aware date parsing
  - Lines 406-431: `calculateStreak` inline function
  - Lines 504-523: Clerk-less development path
- **Test Approach:**
  1. Create `renderWithProviders` test utility wrapping all providers
  2. Mock Clerk, Convex hooks, SecureStore
  3. Smoke test both auth paths (with/without Clerk key)
  4. Extract `getHabitStatus` and `calculateStreak` to testable utilities

### GAP-015: convex/templates.ts - Template Definitions

- **File:** `convex/templates.ts`
- **Location:** Lines 1-465
- **Type:** Unit
- **Priority:** Low
- **Description:** Template system has 0% coverage. Contains template definitions and CRUD operations.
- **Current Coverage:** 0% (465 lines - largest uncovered file)
- **Why It Matters:** Templates are mostly static data with low bug risk. Lower priority.
- **Test Approach:** Test CRUD operations if time permits. Template data itself is static and stable.

### GAP-016: convex/habitStrength.ts - logisticBaseline Edge Cases

- **File:** `convex/habitStrength.ts`
- **Location:** Lines 304-315
- **Type:** Edge Case
- **Priority:** Medium
- **Description:** The logistic baseline function has edge case branches for daysSinceCreation >= 90 and LOGISTIC_TARGET_VALUE === 0 that are untested.
- **Current Coverage:** Partial (45% overall file)
- **Why It Matters:** Baseline calculations affect early habit strength display.
- **Test Approach:** Test with day 0, day 7 (calibration point), day 90 (target), day 365 (long-term).

### GAP-017: convex/habitStrength.ts - computeCompliance Zero Days

- **File:** `convex/habitStrength.ts`
- **Location:** Lines 352-358
- **Type:** Edge Case
- **Priority:** Medium
- **Description:** The compliance calculation returns 0% when daysConsidered is 0, but this branch is untested.
- **Current Coverage:** Partial
- **Why It Matters:** Edge case for brand new habits with no tracking data.
- **Test Approach:** Test with empty tracking map and evaluation date before habit creation.

### GAP-018: convex/habits.ts - reorderHabits Empty Array Handling

- **File:** `convex/habits.ts`
- **Location:** Lines 256-260
- **Type:** Edge Case
- **Priority:** Medium
- **Description:** The reorderHabits function has early return for empty arrays that is untested.
- **Current Coverage:** 0%
- **Why It Matters:** Could cause issues if called with empty data from frontend bugs.
- **Test Approach:** Call with empty array, verify early return behavior.

### GAP-019: convex/habits.ts - list Query Authentication Branch

- **File:** `convex/habits.ts`
- **Location:** Lines 476-480
- **Type:** Unit
- **Priority:** High
- **Description:** The list query returns empty array for unauthenticated users. This auth branch is untested.
- **Current Coverage:** 0%
- **Why It Matters:** Security: unauthorized users should not see any habits.
- **Test Approach:** Test with mocked ctx.auth returning null identity.

### GAP-020: BinaryHeatmap/StatsRow.tsx - Untested Branches

- **File:** `src/components/BinaryHeatmap/StatsRow.tsx`
- **Location:** Various branches
- **Type:** Unit
- **Priority:** Medium
- **Description:** StatsRow has 85% line coverage but only 53% branch coverage. Several conditional paths untested.
- **Current Coverage:** 53% branches
- **Why It Matters:** Stats display affects user perception of progress.
- **Test Approach:** Identify specific untested branches and add targeted tests.

### GAP-021: BinaryHeatmap/BinaryCell.tsx - Untested Branches

- **File:** `src/components/BinaryHeatmap/BinaryCell.tsx`
- **Location:** Various branches
- **Type:** Unit
- **Priority:** Medium
- **Description:** BinaryCell has 79% line but 63% branch and only 50% function coverage.
- **Current Coverage:** 63% branches, 50% functions
- **Why It Matters:** Cells are the core interaction point for habit tracking.
- **Test Approach:** Test onPress/onLongPress handlers, disabled state, different cell states.

### GAP-022: RewardCelebrationToast.tsx - Partial Coverage

- **File:** `src/components/RewardCelebrationToast.tsx`
- **Location:** Conditional branches
- **Type:** Unit
- **Priority:** Medium
- **Description:** Has 55% line and 50% branch coverage. Animation and conditional rendering paths untested.
- **Current Coverage:** 50% branches
- **Why It Matters:** Celebrations provide positive reinforcement for habit completion.
- **Test Approach:** Test different reward types, animation triggers.

### GAP-023: ChainLinkIcon.tsx - Render Branches

- **File:** `src/components/ChainLinkIcon.tsx`
- **Location:** Conditional rendering
- **Type:** Unit
- **Priority:** Low
- **Description:** Has 50% line coverage but 83% branch coverage. Some render paths untested.
- **Current Coverage:** 50% lines
- **Why It Matters:** Visual indicator for habit chains. Lower priority decorative component.
- **Test Approach:** Test different prop combinations for all render paths.

### GAP-024: convex/streakUtils.ts - calculateStreakFromHistory

- **File:** `convex/streakUtils.ts`
- **Location:** Full file
- **Type:** Unit
- **Priority:** High
- **Description:** Streak calculation utility used by toggleHabit. Needs comprehensive testing for various date patterns.
- **Current Coverage:** Unknown (not in coverage report)
- **Why It Matters:** Streaks are a core motivation feature. Wrong streaks break user trust.
- **Test Approach:** Test consecutive days, gaps, backfill scenarios, timezone edge cases.

## Gaps by File

Quick reference of which files have the most gaps:

| File                            | Gap Count | Types          | Priority |
| ------------------------------- | --------- | -------------- | -------- |
| `convex/habits.ts`              | 5         | 4 Unit, 1 Edge | Critical |
| `convex/habitStrength.ts`       | 5         | 3 Unit, 2 Edge | Critical |
| `convex/analytics.ts`           | 2         | 2 Unit         | High     |
| `src/components/Toast.tsx`      | 1         | 1 Unit         | High     |
| `src/components/SettingsModal/` | 1         | 1 Unit         | High     |
| `BinaryHeatmap/*`               | 2         | 2 Unit         | Medium   |
| `App.tsx`                       | 1         | 1 Integration  | Critical |
| Other                           | 7         | Various        | Various  |

## Dependencies to Mock

List of external dependencies that will need mocking:

- **Convex Context (ctx.db, ctx.auth)** - Used in all convex/\*.ts files. Mock strategy: Create mock context factory with configurable db state and auth identity.
- **react-native-reanimated** - Used in Toast.tsx and animation components. Mock strategy: Use jest-preset from reanimated or mock shared values.
- **react-native-gesture-handler** - Used in Toast.tsx. Mock strategy: Mock GestureDetector and Gesture.Pan().
- **react-native-safe-area-context** - Used in SettingsModal, Toast. Mock strategy: Provide mock SafeAreaProvider wrapper in test utils.
- **@clerk/clerk-expo** - Auth provider. Mock strategy: Mock useAuth hook with configurable identity.
- **lucide-react-native** - Icons in SettingsModal. Mock strategy: Mock as simple View components.

## Blockers

Code that may need attention before testing:

- **SafeAreaProvider Missing in Tests** - Several component tests fail because they're not wrapped in SafeAreaProvider. Fix: Update test utils to include SafeAreaProvider wrapper.
- **TurboModule Registry Errors** - DevMenu module not found in test environment. Fix: Add mock for DevMenu in jest.setup.js.
- **Snapshot Mismatches** - 12 snapshots need updating. Fix: Run `jest -u` to update after verifying changes are intentional.
- **Convex Test Infrastructure** - No established pattern for testing Convex mutations/queries. Recommendation: Create a test helper that mocks ctx object with in-memory database simulation.

## Recommended Testing Order

Based on impact and difficulty:

1. **Phase 1 - Quick Wins (Target: 50% coverage)**
   - GAP-004: calculateNewStrength (pure function, no mocking)
   - GAP-005: calculateMomentumStrengthSnapshot (pure function)
   - GAP-024: streakUtils (pure function)
   - GAP-016, GAP-017: habitStrength edge cases

2. **Phase 2 - Backend Functions (Target: 60% coverage)**
   - GAP-001: habits.ts CRUD operations (need mock ctx)
   - GAP-007, GAP-008: habitStrength mutations
   - GAP-009, GAP-010: analytics queries

3. **Phase 3 - UI Components (Target: 70% coverage)**
   - GAP-012: SettingsModal (fix SafeAreaProvider first)
   - GAP-011: Toast component
   - GAP-020, GAP-021, GAP-022: Improve partial coverage

4. **Phase 4 - Integration (Target: 80% coverage)**
   - GAP-014: App.tsx smoke test
   - GAP-002, GAP-003, GAP-018: Edge cases and error handling

---

_Generated: 2026-01-08_
_Updated: 2026-01-27_
_Agent: Tests_
_Loop: 00001_

## Update Notes (2026-01-27)

- Discovered codebase has been decomposed following ≤100 line rule
- `convex/habits.ts` is now barrel export from `convex/habits/` directory
- `convex/habitStrength.ts` is now barrel export from `convex/habitStrength/` directory
- `convex/analytics.ts` is now barrel export with separate files for each query
- Updated GAP-001, GAP-004, GAP-005, GAP-009, GAP-014 with actual file locations
- Note: Tests exist for momentum formula (`habitStrength.test.ts`) - coverage better than 0%
- App.tsx is 545 lines (not 123) - needs extraction of inline functions for testability
