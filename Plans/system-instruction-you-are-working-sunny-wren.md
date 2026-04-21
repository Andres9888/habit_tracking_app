# Plan: Show missed-chain icon only on streak breaks

## Context

Today, `HabitChainVisualizer` renders a red dashed border, rose-50 fill, and an `Unlink` icon on **every** past uncompleted day. The user wants this "chain broken" treatment to appear **only at the moment a streak snaps** — i.e., a missed day that directly follows a completed day. Every other missed day (runs of missed days, or missed days before any completion ever existed) should render as a plain empty/planned slot.

Why: the icon loses meaning when it's stamped across long stretches of inactivity. Reserving it for the actual break point keeps it narratively honest — it marks the event of losing a streak, not the ongoing state of not having one.

## Requirements (confirmed with user)

1. **Streak break = missed day immediately preceded by a completed day** (the exact snap point). Preceding day can be in the prior week when connected.
2. **Non-break missed days render as plain empty slots** — no red, no dashed border, no Unlink icon (same look as a future planned day).

## Approach

The `HabitDayToggle` `missed` prop already controls both the styling (red dashed border + rose background) and the `Unlink` icon (`HabitDayToggle.tsx:59–61,81,102–109`). So narrowing the predicate that feeds that prop achieves both requirements in one place.

That predicate lives in `HabitChainVisualizer.hooks.ts:18` as `isMissed`, which is a straight `weekStatus[index] === 'missed'` check. We redefine it as a streak-break check:

```ts
const isStreakBreak = (index: number): boolean => {
  if (weekStatus[index] !== 'missed') return false;
  if (index === 0) return isConnectedToPreviousWeek;
  return weekStatus[index - 1] === 'done';
};
```

`isConnectedToPreviousWeek` is already computed by `getPreviousWeekConnection` (`src/features/habits/hooks/getPreviousWeekConnection.ts:12–28`) as exactly "the day before `weekDateStrings[0]` has status `'done'`", so it's the correct signal for the `index === 0` case. No new data plumbing from Convex or the parent helpers is needed.

We rename `isMissed` → `isStreakBreak` throughout the visualizer's internal API to keep the semantics honest. The prop on `HabitDayToggle` stays named `missed` — at that leaf level the prop's only job is "render the broken-chain treatment", and `missed` still reads correctly there.

## Files to modify

1. **`src/components/HabitChainVisualizer/HabitChainVisualizer.hooks.ts`**
   - Change signature to accept `isConnectedToPreviousWeek: boolean`.
   - Replace `isMissed` with `isStreakBreak` per the logic above.
   - Update returned object key.

2. **`src/components/HabitChainVisualizer/useChainVisualizerState.ts`**
   - Add `isConnectedToPreviousWeek: boolean` to `UseChainVisualizerStateParams`.
   - Pass it into `useHabitChainVisualizerLogic(...)`.
   - Rename `isMissed` → `isStreakBreak` in the destructure and returned object.

3. **`src/components/HabitChainVisualizer/HabitChainVisualizer.tsx`**
   - Pass `isConnectedToPreviousWeek` into `useChainVisualizerState({...})` (the prop is already received at line 16; today it's only used for the cross-week connector).
   - Update the prop forwarded to `ChainDayList` from `isMissed={state.isMissed}` to `isStreakBreak={state.isStreakBreak}`.

4. **`src/components/HabitChainVisualizer/ChainDayList.tsx`**
   - Rename the `isMissed` prop to `isStreakBreak` on the list component and forward it to `ChainDayItem` (replacing the current `missed={isMissed(index)}` call site with `missed={isStreakBreak(index)}`).

5. **`src/components/HabitChainVisualizer/types.ts`**
   - Update the props type for `ChainDayList` to rename `isMissed` → `isStreakBreak`.

The leaf `HabitDayToggle` keeps its `missed` prop name and its current rendering branches — no changes there.

## What NOT to change

- `HabitDayToggle.tsx` styling/icon logic — it's already correct; we're just feeding it a narrower condition.
- `useHabitsTracking.helpers.ts` `computeDateStatusInfo` — global "is this date in the past and uncompleted" is still useful elsewhere (e.g., streak calculations). We narrow only at the visualizer's display layer.
- `ChainConnector` / `DayConnector` — they consume `isCompleted`, not missed state, so they're unaffected.
- Previous-week connection data plumbing — `isConnectedToPreviousWeek` is already on the `HabitChainVisualizer` props; we just use what's already there.

## Verification

1. **Static checks**
   - `bun tsc --noEmit` — confirm the rename compiles cleanly across the visualizer tree.
   - `bun lint` (or `npm run lint`) on the changed files.

2. **Visual / behavioral checks** — open the app (`bun start`) and check the weekly chain on the Today screen:
   - **Single completed day followed by misses**: only the first missed day after the completion shows red dashed + Unlink; subsequent missed days render as plain empty slots. ✅
   - **Week with no completions at all (habit created long ago, not yet started)**: every day renders as plain empty — no red, no icon. ✅
   - **Week connected to previous week (previous week's Sunday was done)**, current Monday missed: Monday shows red + Unlink (the break crosses the week boundary). ✅
   - **Week NOT connected to previous week**, current Monday missed: Monday renders plain empty (no streak existed to break). ✅
   - **Done → Miss → Done → Miss → Miss**: red+icon on the two misses that directly follow a done; no red+icon on the trailing miss of a run. ✅
   - **Today not yet toggled**: still renders as "today" (unchanged — today is never `missed` because `date < today` is false).
   - **Future days**: unchanged — still plain planned slots.

3. **Regression spot-check**: the cross-week `ChainConnector` at week boundaries (which reads `isConnectedToPreviousWeek` + `isCompleted(0)`) continues to render identically — we only added a new consumer of `isConnectedToPreviousWeek`, we didn't change its meaning.
