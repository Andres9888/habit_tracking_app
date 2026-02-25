---
type: report
title: Test Coverage - Loop 00001 Baseline
created: 2026-02-25
tags:
  - test-coverage
  - baseline-metrics
related:
  - '[[Auto Run Docs/development/test-coverage/1_ANALYZE|1_ANALYZE]]'
---

# Coverage Report - Loop 00001

## Summary

- **Overall Line Coverage:** 36.6%
- **Target:** 80%
- **Gap to Target:** 43.4%
- **Test Framework:** Jest 29.7.0 (`jest-expo` preset)
- **Coverage Command Used:** `node -r /tmp/jest-minimatch-shim.js ./node_modules/jest/bin/jest.js --coverage`
- **Total Test Files:** 346
- **Total Test Cases:** 6590

## Coverage by Module

| Module  | Lines  | Branches | Functions | Status     |
| ------- | ------ | -------- | --------- | ---------- |
| src     | 41.06% | 33.45%   | 36.29%    | NEEDS WORK |
| convex  | 7.22%  | 7.60%    | 6.57%     | NEEDS WORK |
| website | 0.00%  | 0.00%    | 0.00%     | NEEDS WORK |

## Lowest Coverage Files

Files with line coverage below 50% (highest priority shown):

1. **index.ts** - 0.00% line / 0.00% branch / 0.00% func
   - Entry/bootstrap file with no direct assertions in coverage run
   - Important to validate bootstrapping paths and startup behavior
2. **src/components/StreakMilestoneCelebration/StreakMilestoneCelebration.tsx** - 1.96% line / 0.00% branch / 0.00% func
   - Celebration UI path is core user feedback and currently barely exercised
3. **src/components/ArchivedHabitsModal/ArchivedHabitsModal.hooks.ts** - 2.70% line / 0.00% branch / 0.00% func
   - Hook logic under modal flow should be covered by state-transition tests
4. **src/lib/performance/FrameMonitor.ts** - 2.70% line / 0.00% branch / 0.00% func
   - Performance monitor logic is critical for regression visibility
5. **src/components/CalendarTimeline/components/MiniCalendarGrid.tsx** - 4.17% line / 0.00% branch / 0.00% func
   - Calendar interaction surface is user-visible and currently undercovered
6. **src/utils/notifications/index.ts** - 5.00% line / 0.00% branch / 10.00% func
   - Core notification pathway with low exercise risk coverage
7. **convex/habitStrength/updateStrength.ts** - 3.03% line / 0.00% branch / 0.00% func
   - Backend strength mutation path affects progression calculations
8. **convex/habitStrength/allHabitsStats.ts** - 4.17% line / 0.00% branch / 0.00% func
   - Data aggregation backend path remains effectively untested in this pass

Numerous additional `convex/**` files are also at 0% because this run focused on existing suite health issues that interrupted stable execution, so line-level collection was incomplete.

## Existing Test Patterns

### Test Location

- [x] Tests alongside source files
- [x] Tests in dedicated test directories
- [x] Tests follow naming convention: `*.test.ts`, `*.test.tsx`, and `*.spec.ts(x)`
- [ ] Other: e2e/integration/unit/performance split exists, but no separate fixture catalog directory was detected.

### Mocking Patterns

- Centralized runtime mocking is defined in `jest.setup.js`.
- High-use mocks include Expo modules, Clerk, Convex hooks, gesture handler, reanimated, notifications, and `react-native` dependencies.
- Additional manual mocks live in `__mocks__`.

### Fixture Patterns

- No dedicated fixture factory package is consistently used.
- Most tests define lightweight inline fixtures inside each test file.
- A few contract/integration tests read component source via `fs.readFileSync` for interface assertions.

## Recommendations

### Quick Wins (Easy to test, high impact)

1. `src/contexts/__tests__/NetworkStatusContext.test.tsx` currently fails consistently (`NetInfo` mock assertions). Fixing this mock mismatch will unlock a large chunk of passing suite without adding production code.
2. Stabilize tests for `HabitsList` contract expectations in `src/features/habits/tests/HabitsList.dayTapToggle.test.tsx` (missing path file assumptions and brittle regex assertions).
3. Resolve failing snapshot mismatch count (`17` snapshots in `22` suites), then rerun coverage to capture post-fix deltas.

### Requires Setup (Need mocking infrastructure)

1. Run a clean pass focused on failing test infrastructure (`jest.setup.js` and `__mocks__`) before adding new suite expansion.
2. Add a small fixture utility folder for reusable domain objects if test churn continues across contract tests.

### Skip for Now (Low priority or too complex)

1. Deep coverage expansion of `convex/**` modules until suite bootstrap and mock-layer reliability is stable.
2. Full UI interaction snapshots for every new journey while the baseline run has known environment-level failures.
