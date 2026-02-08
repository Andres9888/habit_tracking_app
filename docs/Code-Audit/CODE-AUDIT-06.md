# Code Audit Phase 06: Readability - Dead Code, Stale Disables, Duplications

**Priority:** MEDIUM-LOW
**Category:** Readability / Code Quality
**Estimated scope:** ~20 files, deletions and cleanup

## Context

The codebase has accumulated dead code from incomplete refactoring, stale ESLint disable comments from successful decomposition, duplicated color constants, and debug/diagnostic code shipped in production. These don't affect runtime behavior but hurt maintainability.

---

## Tasks

- [x] **Remove stale `eslint-disable max-lines` comments from decomposed files.** These files are now within or near the 100-line limit (with blank/comment skipping) and no longer need the disable: (1) `src/screens/auth/hooks/useSignInFlow.ts` line 1 - remove `max-lines-per-function` disable (file is 70 lines). (2) `src/screens/auth/hooks/useSignUpFlow.ts` line 1 - remove `max-lines-per-function` disable (file is 97 lines). (3) `src/components/HabitCard/HabitCard.tsx` lines 1-2 - remove both `max-lines` and `max-lines-per-function` disables (~90 lines of actual code). (4) `src/components/HabitCard/useHabitCard.ts` lines 1-2 - remove both disables. (5) `src/features/habits/hooks/HabitRenderContent.tsx` line 1 - remove `max-lines` disable (~110 total but many blanks/comments). (6) `src/components/DraggableHabit/DraggableHabit.tsx` line 1 - remove `max-lines` disable. After removing each, run `npx eslint <file>` to verify it still passes. If any file actually fails, re-add the disable with a comment explaining why.

  > **Completed:** Removed stale `max-lines-per-function` disables from all 6 files. For `max-lines` disables: successfully removed from `useSignInFlow.ts` and `useSignUpFlow.ts` (both under 100 lines). Re-added `max-lines` disables with explanatory comments on 4 files that still exceed the 100-line limit: `HabitCard.tsx` (104 lines), `useHabitCard.ts` (107 lines), `HabitRenderContent.tsx` (102 lines), `DraggableHabit.tsx` (101 lines). All 6 files pass ESLint with 0 errors.

- [x] **Delete orphaned BinaryHeatmap files from incomplete refactoring.** These files in `src/components/BinaryHeatmap/` are not imported by any production code (superseded by files in `utils/` subdirectory): (1) Delete `gridGeneration.ts` (105 lines, superseded by `utils/grid-generation.ts`). (2) Delete `gridStats.ts` (31 lines, superseded by `utils/calculations.ts`). (3) Delete `formatters.ts` (58 lines, superseded by `utils/formatting.ts`). (4) Delete `accessibility.ts` (not imported anywhere). (5) Delete `animationUtils.ts` (not imported anywhere). Before deleting each, verify with a grep that no file imports from it. Note: `cellHelpers.ts` is still actively imported - do NOT delete it.

  > **Completed:** All 5 orphaned files deleted after grep verification confirmed no production imports: `gridGeneration.ts`, `gridStats.ts`, `formatters.ts`, `accessibility.ts`, `animationUtils.ts`. Note: `gridStats.ts` was only imported by `gridGeneration.ts` (both dead). `cellHelpers.ts` confirmed still actively imported by 4 files (BinaryHeatmapNew.tsx, InlineHeatmapGrid.tsx, GridRow.tsx, BinaryHeatmapGrid.tsx) — not deleted. Barrel export `index.ts` already points to `./utils` (new location). Pre-existing test failures (missing vitest globals) unrelated to this change.

- [x] **Delete dead `useMilestoneCelebrationState.ts` hook.** File `src/features/habits/hooks/useMilestoneCelebrationState.ts` (87 lines) is never imported by any other file. It duplicates `useHabitMilestones.ts` which IS used. Verify with grep that nothing imports it, then delete.

  > **Completed:** File was already deleted in a prior audit phase. Verified: (1) glob finds no file matching `useMilestoneCelebrationState*`, (2) grep confirms zero production imports, (3) existing test `useHabitMilestones.test.ts` line 59-63 asserts the file no longer exists, (4) all 5 tests pass. `useHabitMilestones.ts` remains active and is imported by `useHabitsModalsState.ts`. No code changes needed.

- [ ] **Delete or gate unused CalendarTimeline variants.** (1) `src/components/CalendarTimeline/CalendarTimelineWithPulse.tsx` (287 lines) exports `CalendarTimelineOptionB` which is never imported. (2) `src/components/CalendarTimeline/CalendarTimelineWithEdgeFade.tsx` (232 lines) exports `CalendarTimelineOptionA` which is never imported. Together these are 519 lines of dead code. Verify with grep that neither export is imported anywhere, then delete both files.

- [ ] **Extract duplicated CalendarTimeline color maps to single source of truth.** The same color map (8 properties: `currentDayBackground`, `currentDayText`, `dayBackground`, etc.) is defined inline in 4 places: (1) `CalendarTimelineWithPulse.tsx` lines 80-100 (2) `CalendarTimelineWithEdgeFade.tsx` lines 56-76 (3) `CalendarTimeline/theme.ts` lines 34-55 (4) `CalendarTimeline.styles.ts` lines 8-26. After deleting the unused variants (task above), only `theme.ts` and `CalendarTimeline.styles.ts` should remain. Ensure `CalendarTimeline.styles.ts` imports from `theme.ts` instead of duplicating. If the inline maps in the deleted files were the only duplicates, this task is already resolved by the deletion above.

- [ ] **Gate or remove HapticTest from production.** `src/components/HapticTest.tsx` (262 lines) is a diagnostic tool wired into the production modal system via `HabitsModals.tsx` and `SettingsModalSection.tsx`. Either: (1) Wrap the HapticTestModalSection render in `{__DEV__ && <HapticTestModalSection ... />}` so it only appears in development, OR (2) Remove all references to it from the modal system if it's no longer needed. Also check `useModalVisibilityState.ts` for the `showHapticTest`/`setShowHapticTest` state - remove those too if gating behind `__DEV__`.

- [ ] **Replace placeholder console.log handlers in AnalyticsScreen.** (1) `src/screens/AnalyticsScreen/AnalyticsScreen.hooks.ts` line 38: `handleHabitPress` is just `console.log('Navigate to habit detail:', habitId)` - either implement actual navigation or make it a no-op. (2) Same file line 20: `const isPremiumUser = true` with TODO comment - leave this as-is if premium isn't implemented yet, but ensure the TODO is tracked. (3) `src/screens/AnalyticsScreen/components/ChartSections.tsx` lines 46, 55, 63: Three `console.log` placeholder handlers - replace with no-ops or actual implementations. (4) `src/screens/AnalyticsScreen/components/InsightsSections.tsx` line 30: `console.log('Open archive')` placeholder - replace with no-op or implementation.

- [ ] **Fix `as any` casts in `src/theme/index.ts`.** Lines 25, 32, 39, 46, 53, 60, 67, 74, 81, 88, 95, 102, 109, 116, 123 all use `as any` for `fontWeight` properties. Define a proper type for font weights (e.g., `type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold'`) and use it instead of `as any`. React Native's `TextStyle` expects `fontWeight` to be one of these string literals.
