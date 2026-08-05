# Coverage Report - Loop 00001

## Summary

- **Overall Line Coverage:** 39.72%
- **Target:** 80%
- **Gap to Target:** 40.28%
- **Test Framework:** Jest v29.7.0 with jest-expo v54.0.16
- **Coverage Command Used:** `npx jest --coverage --coverageReporters="text" --coverageReporters="json-summary"`
- **Total Test Files:** 285
- **Total Test Cases:** 4,856
- **Passing Tests:** 4,052
- **Failing Tests:** 801 (mostly due to mock/setup issues, not logic failures)
- **Skipped Tests:** 3

## Detailed Coverage Metrics

| Metric     | Covered | Total  | Percentage |
| ---------- | ------- | ------ | ---------- |
| Lines      | 6,585   | 16,578 | 39.72%     |
| Statements | 6,932   | 17,769 | 39.01%     |
| Functions  | 1,462   | 4,139  | 35.32%     |
| Branches   | 4,148   | 10,459 | 39.65%     |

## Coverage by Module

### Components with Good Coverage (>70%)

| Module                              | Lines | Branches | Functions | Status |
| ----------------------------------- | ----- | -------- | --------- | ------ |
| BinaryHeatmap/HeatmapLegend.tsx     | 100%  | 100%     | 100%      | OK     |
| BinaryHeatmap/HeatmapTooltip.tsx    | 100%  | 100%     | 100%      | OK     |
| BinaryHeatmap/MonthLabelsRow.tsx    | 100%  | 83%      | 100%      | OK     |
| BinaryHeatmap/TimeRangeToggle.tsx   | 100%  | 75%      | 100%      | OK     |
| BinaryHeatmap/BinaryHeatmapGrid.tsx | 97%   | 94%      | 88%       | OK     |
| BinaryHeatmap/StatsRow.tsx          | 85%   | 53%      | 67%       | OK     |
| BinaryHeatmap/BinaryCell.tsx        | 79%   | 63%      | 50%       | OK     |
| FullsizeTemplatePreview.tsx         | 93%   | 78%      | 37%       | OK     |
| UnsavedChangesAlert.tsx             | 100%  | 100%     | 100%      | OK     |
| DraftRecoveryBanner.tsx             | 100%  | 100%     | 100%      | OK     |
| OfflinePendingBanner.tsx            | 83%   | 83%      | 92%       | OK     |
| Card.tsx                            | 100%  | 100%     | 100%      | OK     |

### Components with Moderate Coverage (30-70%)

| Module                     | Lines | Branches | Functions | Status     |
| -------------------------- | ----- | -------- | --------- | ---------- |
| ChainLinkIcon.tsx          | 50%   | 83%      | 100%      | NEEDS WORK |
| RewardCelebrationToast.tsx | 55%   | 50%      | 57%       | NEEDS WORK |
| convex/habitStrength.ts    | 45%   | 35%      | 47%       | NEEDS WORK |

### Modules with No Coverage (0%)

These are critical modules that need testing:

| Module                              | Lines          | Why Important                             |
| ----------------------------------- | -------------- | ----------------------------------------- |
| App.tsx                             | 0% (123 lines) | Main app entry - critical for integration |
| convex/habits.ts                    | 0% (217 lines) | Core habit CRUD operations                |
| convex/affirmations.ts              | 0% (160 lines) | Motivation feature backend                |
| convex/analytics.ts                 | 0% (146 lines) | Analytics tracking                        |
| convex/templates.ts                 | 0% (465 lines) | Template system - largest file            |
| convex/voiceNotes.ts                | 0% (135 lines) | Voice notes feature                       |
| convex/letters.ts                   | 0% (117 lines) | Letters feature                           |
| convex/visionBoardImages.ts         | 0% (95 lines)  | Vision board                              |
| src/components/SettingsModal/\*.tsx | 0%             | User settings                             |
| src/components/EmptyState.tsx       | 0%             | UI component                              |
| src/components/Toast.tsx            | 0%             | Critical UI feedback                      |

## Lowest Coverage Files

Files with coverage below 50% that are good testing candidates:

1. **convex/templates.ts** - 0% line coverage (465 lines)
   - Contains all template definitions and CRUD operations
   - High impact - templates are core to the app's value proposition
   - Pure functions that should be easy to test

2. **convex/habits.ts** - 0% line coverage (217 lines)
   - Core habit creation, update, delete, and toggle operations
   - Critical business logic
   - Affects most user interactions

3. **convex/analytics.ts** - 0% line coverage (146 lines)
   - Analytics tracking and aggregation
   - Contains complex date/time logic
   - Important for business metrics

4. **App.tsx** - 0% line coverage (123 lines)
   - Main application entry point
   - Provider setup and routing
   - Integration test candidate

5. **src/components/SettingsModal/SettingsModal.tsx** - 0% line coverage
   - User settings management
   - Toggle switches and state management
   - User-facing critical feature

6. **convex/habitStrength.ts** - 45% line coverage (231 lines)
   - Partially tested but branches at 35%
   - Complex strength calculation algorithm
   - Core gamification feature

## Existing Test Patterns

### Test Location

- [x] Tests in dedicated `__tests__` directories within component folders
- [x] Tests in dedicated `tests` directories within component folders
- [x] Some tests alongside source files (e.g., `convex/*.test.ts`)
- [x] Root-level `__tests__` folder for cross-cutting concerns
- [x] Separate `tests/integration/` directory for integration tests

### Naming Convention

- Pattern: `{ComponentName}.test.tsx` or `{functionName}.test.ts`
- Snapshot tests: `{ComponentName}.snapshot.test.tsx`
- Integration tests: `{feature}-acceptance.test.tsx`

### Mocking Patterns

- **React Native modules**: Mocked via `jest.setup.js` and `jest.mock()`
- **Convex hooks**: Mocked with `jest.mock('@/lib/convex')` returning stub data
- **Navigation**: Mocked via `@react-navigation/native` mock
- **Animations**: Reanimated and gesture-handler properly mocked
- **Expo modules**: Using `jest-expo` preset for automatic mocking

### Fixture Patterns

- **Inline mock data**: Most tests define mock data inline
- **Factory pattern**: Some tests use factory functions for complex objects
- **Test utilities**: Located in `src/test-utils/` for render helpers

## Test Health Issues

Several tests are failing due to infrastructure issues (not logic bugs):

1. **SafeAreaProvider missing** - Some tests don't wrap components in SafeAreaProvider
2. **TurboModule registry errors** - DevMenu module not found in test environment
3. **Snapshot mismatches** - 12 snapshots need updating
4. **Voice notes acceptance tests** - Premium gating UI changed

## Recommendations

### Quick Wins (Easy to test, high impact)

1. **BinaryHeatmap/utils.ts** - Already has tests, add edge cases
   - Pure utility functions
   - No mocking required
   - High reuse across components

2. **convex/habitStrength.ts** - Already at 45%, boost to 80%
   - Core algorithm already partially tested
   - Add edge case tests for strength calculations
   - Test decay and recovery scenarios

3. **src/components/CreateHabitModal/** - Has good test structure
   - Expand existing tests
   - Add validation edge cases
   - Test error states

### Requires Setup (Need mocking infrastructure)

1. **convex/habits.ts** - Need Convex test helpers
   - Requires mocking Convex mutation/query context
   - Set up test database fixtures
   - Test optimistic updates

2. **App.tsx** - Need integration test setup
   - Requires full provider tree
   - Mock navigation container
   - Test deep linking

3. **SettingsModal** - SafeAreaProvider wrapper needed
   - Fix existing failing test first
   - Add toggle interaction tests
   - Test persistence

### Skip for Now (Low priority or too complex)

1. **convex/templates.ts** - Static data, low bug risk
   - Contains template definitions (mostly static)
   - Changes infrequently
   - Lower ROI for testing effort

2. **Animation components** - Hard to test reliably
   - MilestoneCelebration.tsx
   - ChainLinkVisualizer.tsx
   - Reanimated timing issues

3. **Debug/test utilities**
   - DebugHabitStrength.tsx
   - HapticTest.tsx
   - Not production code

## Next Steps for Test Coverage

1. **Fix test infrastructure issues first** (priority)
   - Add SafeAreaProvider wrapper to test utilities
   - Fix TurboModule registry mocking
   - Update outdated snapshots

2. **Target high-impact modules**
   - convex/habitStrength.ts → 80%
   - convex/habits.ts → 60%
   - BinaryHeatmap components → 90%

3. **Set up Convex testing helpers**
   - Create test context providers
   - Mock mutation/query handlers
   - Enable backend function unit tests

## Coverage Trend Target

| Milestone | Target Coverage | Focus Areas                        |
| --------- | --------------- | ---------------------------------- |
| Current   | 39.72%          | Baseline                           |
| Phase 1   | 50%             | Fix infrastructure, existing tests |
| Phase 2   | 60%             | Convex backend functions           |
| Phase 3   | 70%             | Component integration tests        |
| Phase 4   | 80%             | Edge cases and error handling      |
