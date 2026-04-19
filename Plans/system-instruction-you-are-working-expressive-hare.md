# Performance Review — Habit Tracking App

## Context

You asked for a performance review of the app. I audited the hot render paths (home screen habits list, streak calculation, context providers, list virtualization, and animation wiring) and verified each finding by reading the source. This document is a **findings + prioritized fix plan** — nothing is changed yet. You pick which items to proceed with.

Scope: React Native / Expo app, Convex backend, Reanimated + `react-native-draggable-flatlist` for the main list.

---

## Findings (verified, ranked by impact)

### HIGH IMPACT

#### 1. `DraggableFlatList` has no virtualization tuning
**Location:** `src/features/habits/components/HabitsList/HabitsListContent.tsx:86-118`

Missing: `getItemLayout`, `windowSize`, `maxToRenderPerBatch`, `initialNumToRender`, `removeClippedSubviews`. For users with 20+ habits this means every row mounts upfront and offscreen rows stay measured.

**Also:** `ListHeaderComponent` wraps `listHeaderComponent` in a new `<View>` with an inline `style={{ marginHorizontal: ... }}` (line 89-98) every render, which defeats the `useMemo` on `listHeaderComponent` two lines up.

**Fix:** Add `getItemLayout` (HabitCard has a known height), set `windowSize={7}`, `maxToRenderPerBatch={6}`, `initialNumToRender={8}`, `removeClippedSubviews` (Android only). Pull the wrapper `<View>` out into a memoized component so the header identity is stable.

---

#### 2. Streak `.sort()` on every `computeCurrentStreakFromDates` call
**Location:** `src/utils/streak.ts:52-55`

```ts
const latestCompleted = [...completedDates]
  .filter((date) => date <= todayString)
  .sort()
  .pop();
```

Runs once per habit whenever tracking data changes (via `buildStreakByHabit` in `useHabitsTracking.helpers.ts:54-63`). Needlessly O(n log n) — we only need the max eligible date, which is O(n).

**Fix:** Replace with a single-pass max:
```ts
let latestCompleted: string | undefined;
for (const d of completedDates) {
  if (d <= todayString && (!latestCompleted || d > latestCompleted)) {
    latestCompleted = d;
  }
}
```
For users with months of history and dozens of habits, this is the single biggest win in pure CPU terms per tracking update.

---

#### 3. `useHabitsTracking` recomputes **all habits' streaks** on any single toggle
**Location:** `src/features/habits/hooks/useHabitsTracking.ts:25-31`

`pendingToggles` changing (1 toggle) invalidates `completedDatesByHabit` for all habits, which invalidates `streakByHabit` for all habits. Every `getStreak` consumer downstream then re-renders.

**Fix:** Make `buildStreakByHabit` return a map where entries for unaffected habits keep stable identity (i.e., reuse previous streak values if a habit's completed-dates set is reference-equal). Or: maintain `streakByHabit` in a ref + only patch changed habit IDs. Pairs well with fix #2.

---

### MEDIUM IMPACT

#### 4. Known 1000+ line components never memoize derived work
CLAUDE.md already flags `HabitsEmptyState.tsx` (1,094), `FullsizeTemplatePreview.tsx` (1,047), `TodaysFocusCard.tsx` (991) for the readability initiative. Perf-wise, these files each contain multi-branch JSX with inline `.map()` renders and inline style objects. Decomposing them (already planned for readability) will also let us add `React.memo` at the sub-component boundary.

**Fix:** No new work — piggyback perf wins on the existing decomposition plan. (Don't tackle here unless you want to.)

---

#### 5. `TodaysFocusCard` `LinearGradient` receives potentially-unstable `gradientColors`
**Location:** `src/components/ProgressSectionConsolidated/TodaysFocusCard/TodaysFocusCard.tsx:58`

`config.gradientColors` comes from `useFocusState(props)`. If `useFocusState` rebuilds `config` each render (needs confirmation), `LinearGradient` does internal diff work every render even though visually nothing changes.

**Fix:** Verify `useFocusState` returns stable `config` via `useMemo` keyed on the focus state key only. Also memoize the `{ x, y }` `start`/`end` objects on lines 59-60 (these allocate each render).

---

#### 6. `useHabitsSorting` calls `toLowerCase()` inside every comparator
**Location:** `src/features/habits/hooks/useHabitsSorting.ts:36,44,67`

`.sort()` comparator invokes `.toLowerCase()` on both operands per comparison — O(n log n) string allocations on every sort-mode change or habit list change.

**Fix:** Precompute a `lowerName` field once when building the sort array, or use `localeCompare` with `{ sensitivity: 'base' }` which avoids allocations.

---

#### 7. `HabitsListContent` `contentContainerStyle` memoized but inner `<View style={{ marginHorizontal: ... }}>` is not
Already noted in #1, calling out separately because the inline style wrapper is the root cause of header re-renders, not the list props. Fix at the same time.

---

### LOW IMPACT (worth doing, small wins)

#### 8. `useStickyHeader` creates unused derived value
**Location:** `src/features/habits/components/HabitsList/useStickyHeader.ts:33`

`useDerivedValue(() => 0)` — dead code. Tiny overhead but it's a worklet scheduled every frame for no reason.

**Fix:** Remove `stickyProgress` entirely unless sticky-threshold behavior is intended.

---

#### 9. `useNativeDriver: false` in `CompletionRing`
**Location:** `src/components/CalendarTimeline/components/CompletionRing.tsx`

The only file using JS-driven animation. Likely animating `width`/`height` or a layout prop that can't run natively.

**Fix:** Verify the animated prop; if it's opacity/transform, switch to `useNativeDriver: true` or Reanimated `useSharedValue`.

---

#### 10. `SettingsContent` re-renders every section on any toggle
**Location:** `src/components/SettingsModal/SettingsContent.tsx:72-366`

Known long file; sections are not individually memoized, so toggling "Show week numbers" re-renders notifications, appearance, etc.

**Fix:** Extract each `<SettingsSection>` usage into a `React.memo`'d child component that only subscribes to its own setting. Low frequency (modal only), so deprioritize.

---

## Explicitly not issues (so we don't chase them)

- **`useHeaderStats`** (`HabitsList/useHeaderStats.ts`): already fully `useMemo`'d. No fix needed.
- **`SyncStatusProvider` / `NetworkStatusProvider` context value**: callbacks are `useCallback([])` and status is the real driver. Splitting contexts would churn code for negligible gain.
- **`HabitCard` inline style array**: component is `React.memo`'d, inline styles only evaluate when props change. Leave it.

---

## Recommended execution order

If you want to do all of it, pick this order — each step is independently shippable:

1. **Fix #2** (streak sort → max) — one file, 5 lines, measurable win. *~15 min.*
2. **Fix #1** (FlatList virtualization) — one file, need to measure HabitCard height. *~30 min.*
3. **Fix #3** (streak incremental update) — cross-file, needs care. *~1 hr.*
4. **Fix #6** (sorting toLowerCase) — one file. *~15 min.*
5. **Fix #5** (TodaysFocusCard stability) — requires reading `useFocusState.ts` first.
6. **Fix #8** (dead derived value) — one-line delete.
7. **Fix #9** (CompletionRing native driver) — needs inspection.
8. **Fix #10** (SettingsContent sections) — do alongside the readability decomposition.

---

## Verification plan (for whichever fixes we implement)

- **Before/after React DevTools Profiler** snapshot of the home screen: toggle one habit, count rendered components and total commit time.
- **FlatList scroll test**: seed 50 habits (use an existing dev seed or mock), scroll fast, watch for blank rows / JS thread stalls in Flipper or React Native DevTools.
- **Streak math**: run the existing test suites — `src/utils/__tests__/streak.test.ts` and `streak.enhanced.test.ts` must stay green. Add one test case confirming the new O(n) path returns the same result as the old `.sort().pop()` path for a scrambled input.
- **Sort test**: `useHabitsSorting` has no obvious test file; spot-check manually by toggling sort modes with a realistic list.

---

## Critical files referenced

- `src/utils/streak.ts`
- `src/features/habits/hooks/useHabitsTracking.ts`
- `src/features/habits/hooks/useHabitsTracking.helpers.ts`
- `src/features/habits/components/HabitsList/HabitsListContent.tsx`
- `src/features/habits/components/HabitsList/useStickyHeader.ts`
- `src/features/habits/hooks/useHabitsSorting.ts`
- `src/components/ProgressSectionConsolidated/TodaysFocusCard/TodaysFocusCard.tsx`
- `src/components/CalendarTimeline/components/CompletionRing.tsx`
- `src/components/SettingsModal/SettingsContent.tsx`

---

## Next step

Tell me which findings to implement. Default recommendation: do #2, #1, #6, #8 in one PR (small, high-ROI, low-risk), then tackle #3 and #5 in a follow-up.
