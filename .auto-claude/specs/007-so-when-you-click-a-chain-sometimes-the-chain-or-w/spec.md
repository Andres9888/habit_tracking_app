# Quick Spec: Fix Chain Icon Size Bug on Tap

## Overview
Fix intermittent bug where chain link icons appear small when tapping habit boxes. The issue is caused by an animation race condition in HabitDayToggle where the scale interpolation can get stuck at intermediate values during rapid taps or state updates.

## Workflow Type
**Type**: bugfix

This is a simple bug fix that requires modifying a single animation parameter in one component file.

## Task Scope
### Files to Modify
- `src/components/HabitChainVisualizer/HabitChainVisualizer.tsx` - Fix animation race condition in HabitDayToggle

### Change Details
The chain icon in `HabitDayToggle` uses an animated scale that interpolates from `0.5` to `1.0` based on the `completion` animated value. When users tap habit boxes rapidly or when state updates cause re-renders mid-animation, the icon can get stuck at an intermediate scale (appearing "small").

**Root Cause** (lines 378-396):
```tsx
<Animated.View
  style={{
    opacity: completion,
    transform: [{ scale: completion.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],  // <-- Icon can be stuck at 0.5x
    })}],
  }}
>
  <ChainLinkIcon ... />
</Animated.View>
```

**Fix**: Change the scale `outputRange` from `[0.5, 1]` to `[0.8, 1]` so even during animation glitches, the icon remains visible and reasonably sized.

## Success Criteria
- [ ] Rapid tap habit boxes multiple times - icons should never appear small
- [ ] Toggle habits on/off - animations should be smooth
- [ ] No visual glitches when completing habits
- [ ] Chain link icons maintain minimum 80% scale even during animation interruptions
