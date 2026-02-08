# Code Audit Phase 05: Medium Performance - Animations, Timers, Memoization

**Priority:** MEDIUM
**Category:** Performance
**Estimated scope:** ~8 files

## Context

These are medium-impact performance issues: animations running on JS thread, animation loops without cleanup, uncleaned setTimeout calls, and inline closures defeating React.memo.

---

## Tasks

- [x] **Fix `useNativeDriver: false` animations where possible.** Two files use JS-thread animations: (1) `src/components/DailyMomentumMeter/useAnimations.ts` line 32: Progress bar spring animation. (2) `src/features/habits/components/HabitsList/MonetizationHero/useMonetizationAnimations.ts` line 42: Progress bar timing animation. Both animate width/layout properties which can't use native driver with standard Animated API. For each: consider switching to a `transform: [{ scaleX }]` approach with `useNativeDriver: true` (animate scaleX from 0 to 1 with a container of fixed width), OR migrate to Reanimated's `useAnimatedStyle` which can animate layout properties on the UI thread. If the scaleX approach works visually, that's the simpler fix.

  > **Completed:** Switched both progress bars from `width` animation to `transform: [{ scaleX }]` with `useNativeDriver: true`. The animated bars now use `width: '100%'` + `transformOrigin: 'left center'` + `scaleX` interpolation (0→1), running entirely on the native UI thread. Also added cleanup for celebration loops in useAnimations.ts. Tests: 13 new tests passing.

- [x] **Add cleanup to `Animated.loop` calls in `src/components/DailyMomentumMeter/useAnimations.ts`.** Lines 40-91: The celebration, glow, and flame loop animations start when percentage hits 100% but have no cleanup. When percentage changes away from 100, the values are manually set but old loops keep running. Fix: store the `Animated.CompositeAnimation` returned by `Animated.loop()` and call `.stop()` on it in the useEffect cleanup function. Pattern: `const loopRef = Animated.loop(...); loopRef.start(); return () => loopRef.stop();`

  > **Completed:** Already fixed as part of task 1's `useNativeDriver` migration. The celebration `useEffect` (lines 38-105) stores loop references in `celebrationLoop`, `glowLoop`, and `flameLoop` variables, calls `.start()` on each, and returns a cleanup function that calls `.stop()` on all three. The `else` branch resets animated values when percentage leaves 100%. Existing test "should stop loops on cleanup when leaving 100%" validates the behavior. All 7 useAnimations tests pass.

- [x] **Add stop mechanism to `runIconPulseLoop` in `src/components/DraggableHabit/highlightAnimations.ts`.** Lines 56-72: `runIconPulseLoop` starts an infinite `Animated.loop` with no way to stop it. Change the function to return the animation reference so callers can stop it: `export function runIconPulseLoop(iconPulse: Animated.Value): Animated.CompositeAnimation`. Then in the caller, store the return value and call `.stop()` on cleanup.

  > **Completed:** Changed `runIconPulseLoop` to return the `Animated.CompositeAnimation` reference. Updated `useIconPulse.ts` to capture the return value and call `loop.stop()` in the `useEffect` cleanup. Tests: 10 new tests passing (4 for highlightAnimations, 6 for useIconPulse) covering return type, stoppability, loop start/stop on mount/unmount, reduce-motion respect, and condition change cleanup.

- [x] **Clean up `setTimeout` calls that lack cleanup on unmount.** Multiple files have `setTimeout` without cleanup: (1) `src/components/QuickCompleteButton/useQuickCompleteButton.ts` lines 90 and 103: Two timeouts (700ms and 300ms). Store the timeout IDs and clear them in a useEffect cleanup or in the hook's return. (2) `src/screens/AnalyticsScreen/AnalyticsScreen.hooks.ts` line 34: 1000ms fake refresh timeout. Store and clear on unmount. (3) `src/components/HabitCard/gestures/tapGesture.ts` lines 86-88: 300ms timeout. This one is trickier since it's in a gesture handler - use a ref to track the timeout ID and clear it on unmount.

  > **Completed:** Added `useRef`-based timeout tracking and `useEffect` cleanup for all three files: (1) `useQuickCompleteButton.ts`: Added `confettiTimeoutRef` and `toggleTimeoutRef` refs, stored both setTimeout IDs, cleanup useEffect clears both on unmount. (2) `AnalyticsScreen.hooks.ts`: Added `refreshTimeoutRef` ref, stored setTimeout ID, cleanup useEffect clears on unmount. (3) `tapGesture.ts`: Added `toggleTimeoutRef` to `TapGestureOptions` interface, threaded through `UseHabitCardGesturesOptions` types, `useHabitCardGestures.ts`, and `useHabitCard.ts`; ref created in `useHabitCardValues.ts` with clearTimeout in its existing unmount cleanup. Tests: 45 new/updated tests passing (8 for QuickCompleteButton, 7 for AnalyticsScreen, 30 for tapGesture).

- [ ] **Fix inline arrow functions in `.map()` loops for memoized children.** Three files create new function references on every render inside `.map()`: (1) `src/screens/TemplatesScreen/views/BrowseCategoriesTab.tsx` lines 72-73: `onImport` and `onToggle` closures. Use `useCallback` for the handlers and pass stable references. (2) `src/components/StatsNotesModal/HabitStats/HabitSelector.tsx` line 40: `onPress={() => onSelect(habit._id)}`. Consider passing `habitId` as a prop and having the child call `onSelect` with it. (3) `src/components/HabitRankingsList/HabitRankingsList.tsx` line 37: `onPress={() => handleHabitPress(item.id)}`. Same pattern - pass ID as prop.

- [ ] **Memoize `new Date()` calls during render in HeatmapCalendar.** (1) `src/components/HabitCalendarModal/HeatmapCalendar/HeatmapCalendar.tsx` line 13: `const today = new Date()` should be `const today = useMemo(() => new Date(), [])` (or better, receive it as a prop from the parent). (2) `src/components/HabitCalendarModal/useHabitCalendarModal.ts` line 30: `const todayDateString = format(new Date(), 'yyyy-MM-dd')` should be memoized with `useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])` to prevent downstream recomputation.

- [ ] **Prune unbounded snapshots array in `src/lib/performance/MemoryMonitor.ts`.** Line 36: `this.snapshots.push(snapshot)` grows unbounded (every 5 seconds). Add pruning logic: keep only the last N snapshots (e.g., 100). After pushing, check `if (this.snapshots.length > 100) this.snapshots.shift()`. This prevents a slow memory leak in long sessions.
