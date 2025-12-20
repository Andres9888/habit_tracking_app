# Remove Three Dots Menu Button from Habit Card

## Problem Statement

The habit card currently displays a three-dots menu button (`⋯`) that opens additional actions. This feature is incomplete/unfinished and should be temporarily removed until the full functionality is implemented.

## Current Behavior

In `DraggableHabit.tsx` (lines 501-513), there is a Pressable button that:
- Displays as a circular button with horizontal ellipsis (`⋯`)
- Shows only when `onMorePress` prop is provided
- Triggers `onMorePress(habit)` when tapped
- Has accessibility labels for "Open habit actions"

```tsx
{onMorePress && (
  <Pressable
    accessibilityHint='Open habit actions'
    accessibilityLabel='Open habit actions'
    accessibilityRole='button'
    className='ml-3 h-10 w-10 items-center justify-center rounded-full bg-black/5'
    onPress={() => onMorePress(habit)}
  >
    <Text className='text-[22px] leading-[22px]' style={{ color: colors.primaryText }}>
      ⋯
    </Text>
  </Pressable>
)}
```

## Expected Behavior

- Remove the three-dots button from the UI entirely
- Remove the `onMorePress` prop from `DraggableHabit` component interface
- Clean up any parent components passing `onMorePress`
- Users can still access habit actions via:
  - Long press (quick actions menu)
  - Swipe left (edit/delete actions)

## Affected Files

1. **Primary:** `src/components/DraggableHabit/DraggableHabit.tsx`
   - Remove lines 501-513 (the Pressable button)
   - Remove `onMorePress` from props interface

2. **Secondary:** Any files passing `onMorePress` to DraggableHabit
   - Search for `onMorePress` usage and remove

## Proposed Solution

1. Remove the `onMorePress` prop from `DraggableHabitProps` interface
2. Remove the conditional rendering block for the three-dots button
3. Update any parent components that pass `onMorePress`
4. Run tests to ensure no regressions

## Acceptance Criteria

- [x] Three-dots button no longer visible on habit cards
- [x] `onMorePress` prop removed from DraggableHabit interface
- [x] No TypeScript errors after removal
- [x] Long press and swipe actions still work correctly (existing functionality preserved)
- [x] No visual layout shifts after removal

## Implementation Notes (2025-12-19)

Changes made:
1. **DraggableHabit.tsx**: Removed `onMorePress` from `DraggableHabitProps` interface, removed from destructured props, and removed the conditional rendering block for the three-dots button (Pressable component with `⋯` text)
2. **useHabitRenderItem.tsx**: Removed `handleMorePress` from `UseHabitRenderItemArgs` interface, removed from destructured args, removed from being passed to `DraggableHabit`, and removed from the dependency array
3. **HabitsList.tsx**: Removed `handleMorePress: openQuickActions` from the `useHabitRenderItem` call

The three-dots menu button is now fully removed. Users can still access habit actions via:
- Long press (opens quick actions menu)
- Swipe left (reveals archive action)

## Testing

1. View habit cards on home screen
2. Verify no three-dots button appears
3. Test long press opens quick actions
4. Test swipe left reveals edit/delete buttons
5. Verify card layout looks balanced without the button

## Priority

Low - UI cleanup, feature incomplete

## Future Considerations

When ready to re-implement:
- Design complete quick actions menu
- Consider what actions belong in menu vs swipe
- Ensure consistent UX across all habit card variants
