# Quick Spec: Fix Multi-Select Bug in Habit Chips

## Overview

Fix a race condition bug in the habit chip selection component where multiple chips can appear selected simultaneously due to animation timing issues. The fix involves moving selection animation logic from render-time to a useEffect hook.

## Workflow Type

bugfix

## Task Scope

**Files to Modify:**
- `src/features/habits/components/HabitsEmptyStateMinimal/SuggestionChips.tsx` - Fix selection animation logic in the Chip component

**Impact:** Low - isolated change to single component's animation timing logic

## Success Criteria

- [ ] Tap chip A → appears selected (green)
- [ ] Tap chip B → chip A deselects, chip B selects
- [ ] Rapid tapping between chips → only one chip selected at any time
- [ ] No console errors or warnings
- [ ] Respects `shouldReduceMotion` accessibility setting

---

## Task

Fix bug where multiple habit chips appear selected simultaneously - only one chip should be selectable at a time.

## Files to Modify
- `src/features/habits/components/HabitsEmptyStateMinimal/SuggestionChips.tsx` - Fix selection animation logic

## Root Cause
In the `Chip` component (lines 107-116), the selection progress animation logic runs during render with a strict equality check:

```javascript
if (
  (isSelected && selectionProgress.value === 0) ||
  (!isSelected && selectionProgress.value === 1)
) {
  selectionProgress.value = withSpring(isSelected ? 1 : 0, ...);
}
```

**Problem**: If a user taps quickly while an animation is in progress (e.g., `selectionProgress` is at 0.7), the condition fails and the previously selected chip doesn't animate back to deselected state.

## Change Details
Move the selection progress update logic into a `useEffect` that properly responds to `isSelected` prop changes, regardless of current animation state:

```javascript
useEffect(() => {
  selectionProgress.value = shouldReduceMotion
    ? isSelected ? 1 : 0
    : withSpring(isSelected ? 1 : 0, SPRING_CONFIGS.chipPress);
}, [isSelected, shouldReduceMotion]);
```

This ensures:
1. Deselection always triggers when `isSelected` becomes false
2. Animation state is properly synchronized with prop changes
3. Rapid tapping works correctly

## Verification
- [ ] Tap chip A → appears selected (green)
- [ ] Tap chip B → chip A deselects, chip B selects
- [ ] Rapid tapping between chips → only one chip selected at any time
- [ ] No console errors or warnings
