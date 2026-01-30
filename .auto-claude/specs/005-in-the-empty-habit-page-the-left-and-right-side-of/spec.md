# fix-empty-habit-button-cutoff

## Overview
in the empty habit page the left and right side of the screen are cutting of the buttons


## Workflow Type
bugfix

## Task Scope
### Files to Modify
- `src/features/habits/components/HabitsEmptyStateMinimal/HabitsEmptyStateMinimal.tsx` - Add `paddingHorizontal` to main container

### Change Details
The `HabitsEmptyStateMinimal` component container (lines 268-277) has `width: '100%'` children but no horizontal padding. This causes:
- Input field to touch screen edges
- CTA button to be cut off on left/right
- Suggestion chips to overflow

**Fix**: Add `paddingHorizontal: 24` (or similar) to the main `Animated.View` container style.

Current container style (line 270-276):
```tsx
{
  alignItems: 'center',
  flex: 1,
  minHeight: '100%',
}
```

Updated container style:
```tsx
{
  alignItems: 'center',
  flex: 1,
  minHeight: '100%',
  paddingHorizontal: 24,
}
```

## Success Criteria
- [ ] Buttons are fully visible on screen edges
- [ ] Input field has proper margins from screen edges
- [ ] Suggestion chips don't overflow
- [ ] Layout looks consistent on different device sizes

## Notes
- The value `24` matches common React Native design patterns for screen padding
- This is consistent with other screens in the app
