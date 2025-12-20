# Bug Fix: Remove Fill Animation When Strength Progress Bar Empties

## Problem Statement

When the habit strength drops to 0% (empty), the StrengthProgressBar displays an unwanted animation that fills the entire bar multiple times before settling. This creates a confusing visual experience as users expect the bar to simply animate down to empty, not flash full repeatedly.

## Current Behavior

When strength value transitions to 0 (or very low values):
1. The progress bar animates using `withSpring()`
2. Due to spring physics (damping: 15, stiffness: 100), the animation overshoots
3. This causes the bar to visually "bounce" and appear to fill before emptying
4. The emoji also animates with scale/rotation effects during this transition

## Expected Behavior

When strength drops to 0%:
1. The progress bar should smoothly animate down to empty
2. No overshoot/bounce effect - use a simple easing animation
3. The bar should NOT appear to fill during the emptying animation
4. Emoji animations can still occur for level changes, but should not be jarring

## Affected Component

**File:** `src/components/StrengthProgressBar/StrengthProgressBar.tsx`

**Lines 124-128:**
```typescript
progressWidth.value = withSpring(clampedStrength, {
  damping: 15,
  stiffness: 100,
});
```

## Proposed Solution

Replace spring animation with timing animation when transitioning to low/zero values:

```typescript
// When emptying (going to 0 or very low), use smooth timing instead of spring
if (clampedStrength <= 5) {
  progressWidth.value = withTiming(clampedStrength, {
    duration: 400,
    easing: Easing.out(Easing.cubic),
  });
} else {
  // Normal spring animation for other transitions
  progressWidth.value = withSpring(clampedStrength, {
    damping: 15,
    stiffness: 100,
  });
}
```

## Acceptance Criteria

- [x] Progress bar animates smoothly to 0% without bouncing/filling effect
- [x] No visual flash of full bar when emptying
- [x] Normal spring animation preserved for non-empty transitions
- [x] Existing level-up animations unaffected
- [x] Works correctly with reduce motion accessibility setting

## Implementation Notes (Completed 2025-12-19)

**Changes made to `src/components/StrengthProgressBar/StrengthProgressBar.tsx`:**

1. Added `useReduceMotion` hook import to respect accessibility settings
2. Added `previousStrengthRef` to track previous strength values for detecting emptying transitions
3. Modified the animation logic in `useEffect`:
   - When `reduceMotion` is enabled: immediate value change with no animation
   - When transitioning to ≤5% (and decreasing): uses `withTiming` with 400ms duration and `Easing.out(Easing.cubic)` for smooth, non-bouncing animation
   - For all other transitions: preserves original spring animation (damping: 15, stiffness: 100)
4. Emoji animations are also skipped when `reduceMotion` is enabled

## Testing

1. Create a habit and complete it several times to build strength
2. Skip multiple days to trigger strength decay to 0
3. Observe the progress bar animation - should smoothly decrease without filling
4. Verify normal animations still work when strength increases

## Priority

Medium - UX polish issue, not blocking functionality

## Related Files

- `src/components/StrengthProgressBar/StrengthProgressBar.tsx` (main fix)
- `src/components/HabitCard/HabitCard.tsx` (uses component)
- `src/components/DraggableHabit/DraggableHabit.tsx` (uses component)
