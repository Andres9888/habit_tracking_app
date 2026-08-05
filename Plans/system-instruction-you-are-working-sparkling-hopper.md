# Fix: Habit chain cells render color/border without icon

## Context

User reports an intermittent visual glitch in the daily habit chain cells: sometimes a completed (brown) cell renders without its chain‑link icon, and sometimes a missed (dashed‑red) cell renders without its broken‑link icon or border. The screenshot the user attached is a healthy reference render — the actual glitch happens randomly on a real device, not in that frame.

The chain cells live in `src/components/HabitChainVisualizer/`. Each cell is a `HabitDayToggle` whose icon visibility is driven by a JS `Animated.Value` called `completion` that controls opacity (and scale) with `useNativeDriver: true`. The cell shell is a Reanimated `View` whose `backgroundColor`/`borderColor` come from `useAnimatedStyle`, while `borderStyle`/`borderWidth` come from a static inline style object.

This split — JS Animated for the icon, Reanimated for the shell — is the source of the issue. Native‑driver opacity animations on `Animated.Value` are known to silently drop frames or fail to sync to the native side when:
- A cell mounts mid‑scroll inside a virtualized list and the native animation queue is overloaded.
- The parent has `overflow: 'hidden' + transform: scale` (which it does, lines 83–89 of `HabitDayToggle.tsx`), creating a compositing layer that occasionally detaches the child opacity.
- An animation gets interrupted by re‑render and the cleanup callback runs after the next animation has already started.

The existing code has a 300 ms `setTimeout` safety net (`useHabitDayToggleAnimations.ts:102‑106`) that calls `completion.setValue(targetValue)` — but it only runs on transitions, not on initial mount of an already‑completed cell, which is the common case after navigating back to the home screen.

## Goal

Make the chain icon's visibility robust to native‑driver dropouts without removing the entrance/exit animations users like.

## Approach (surgical)

Two targeted edits to existing files. No new components, no architectural changes.

### Edit 1 — `useHabitDayToggleAnimations.ts`

File: `src/components/HabitChainVisualizer/useHabitDayToggleAnimations.ts`

Goal: guarantee the native side of `completion` matches the prop on initial mount, even when the cell mounts while the JS thread is busy.

- Inside the existing `useLayoutEffect` (lines 32‑36), in addition to `completion.setValue(completed ? 1 : 0)`, also kick a zero‑duration native‑driver `Animated.timing` so the native side commits the value:
  ```ts
  Animated.timing(completion, {
    toValue: completed ? 1 : 0,
    duration: 0,
    useNativeDriver: true,
  }).start();
  ```
  This is the documented workaround for the JS↔native desync where `setValue` alone doesn't always propagate to the native compositor.

### Edit 2 — `AnimatedCompletionIcon.tsx`

File: `src/components/HabitChainVisualizer/AnimatedCompletionIcon.tsx`

Goal: provide a non‑animated fallback so that even if the animated opacity layer fails, the icon is visible whenever the cell is supposed to be completed.

- Accept an additional `completed: boolean` prop (already available at the call site in `HabitDayToggleContent.tsx:45‑50`).
- When `completed === true`, render a static (non‑animated) copy of the icon at full opacity behind the existing animated copy. The animated copy still does the scale/opacity entrance; the static copy guarantees pixels exist on screen even if the native driver drops the frame.
- When `completed === false` (transitioning out), only render the animated copy so the fade‑out still plays.

Implementation sketch:
```tsx
return (
  <>
    {completed ? (
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none" className="items-center justify-center">
        {completionIcon === 'checkbox'
          ? <Check color={resolvedColor} size={iconSizes.medium} strokeWidth={2.5} />
          : <ChainLinkIcon color={resolvedColor} size={iconSizes.medium} variant="stroke" />}
      </View>
    ) : null}
    <Animated.View style={{ opacity: completion, transform: [{ scale: completion.interpolate(...) }] }}>
      {/* existing animated icon */}
    </Animated.View>
  </>
);
```

This adds one `View + Icon` per completed cell — negligible cost vs. eliminating an intermittent visual bug.

### Pass `completed` through

`HabitDayToggleContent.tsx` (lines 21‑52) needs to forward the existing `completed` prop down to `AnimatedCompletionIcon`. It currently doesn't receive `completed` either — add it to the `Props` interface and pass through from `HabitDayToggle.tsx` (line 94, the `<HabitDayToggleContent ...>` call already has `completed` in scope from props).

### Why this fixes both reported symptoms

1. **Completed cell with no chain icon** — Edit 2 guarantees the icon pixels regardless of animated value state. Edit 1 prevents the desync from happening in the first place. Belt + suspenders.
2. **Missed cell with no broken‑link icon** — The `<Unlink>` icon in `HabitDayToggleContent.tsx:42` already renders unconditionally with no animation, so this case shouldn't occur from rendering logic. If it still happens after Edit 1+2 land, the cause is at the data layer (the `missed` prop flickering true→false→true), which needs a separate investigation with logging. Note this in the PR description.
3. **Missed cell missing the dashed border** — Same data‑layer caveat. The `borderStyle: 'dashed'` is a static style on the outer frame and shouldn't disappear from rendering alone.

## Critical files

- `src/components/HabitChainVisualizer/useHabitDayToggleAnimations.ts` — Edit 1
- `src/components/HabitChainVisualizer/AnimatedCompletionIcon.tsx` — Edit 2 (signature + render)
- `src/components/HabitChainVisualizer/HabitDayToggleContent.tsx` — pass `completed` through
- `src/components/HabitChainVisualizer/HabitDayToggle.tsx` — pass `completed` to content (already has it in scope, just add to JSX prop)

## Verification

End‑to‑end:
1. `npm run lint` and `npx tsc --noEmit` pass.
2. Run the app on iOS simulator (or device). Navigate to home screen.
3. Scroll the habit list rapidly; cells with completed days must always show their chain‑link icons. Repeat 20× — no dropped icons.
4. Toggle a habit complete from a fresh empty state — entrance animation still plays (icon scales from 0.5→1, fades 0→1).
5. Toggle a completed day off — exit animation still plays (icon fades 0→1 → 0).
6. Background the app, foreground it, navigate back — completed cells render icons immediately on mount, no missing icons.
7. Existing tests in `src/components/HabitChainVisualizer/__tests__/HabitChainVisualizer.test.tsx` continue to pass.

## Out of scope

- Any rewrite of the JS Animated → Reanimated migration for the icon layer. That's a larger refactor; the surgical fix above addresses the user‑visible glitch without it.
- Investigating the data‑layer `missed` prop flicker (deferred unless symptom persists after this fix).
