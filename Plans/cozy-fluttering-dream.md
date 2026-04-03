# Plan: Overlay Edit Screen on Top of Detail Screen

## Context

When tapping "Edit Habit" from the habit detail screen, the current flow is:
1. Detail modal slides DOWN (closes via native `animationType='slide'`)
2. Edit modal slides UP (opens via custom Reanimated bottom sheet)

This creates a jarring two-step animation. The fix: **don't close the detail modal when opening edit**. The edit sheet slides up on top of the still-visible detail, creating a natural layered feel.

**Cancel/Save** returns to the detail screen. **Delete/Archive** closes both modals (habit no longer exists).

## Changes

### 1. Remove `closeHabitDetail()` from onEdit handler

**File:** `src/features/habits/components/HabitsModals/CalendarAndDetailModals.tsx` (lines 71-74)

```tsx
// Before:
onEdit={(habit) => {
  closeHabitDetail();
  openEditHabit(habit);
}}

// After:
onEdit={(habit) => {
  openEditHabit(habit);
}}
```

### 2. Add `onHabitRemoved` callback for destructive actions

When a habit is deleted or archived from the edit screen, both modals must close. Currently `onClose` is called for ALL exit paths (cancel, save, delete, archive). We need a separate path for destructive actions.

**File:** `src/screens/HabitEditScreen/types.ts`
- Add `onHabitRemoved?: () => void` to `HabitEditScreenProps`

**File:** `src/screens/HabitEditScreen/useHabitEditScreen.ts` (lines 54-60)
- Accept `onHabitRemoved` in props
- Pass it to `useHabitActions` as the success callback instead of `onClose`

```tsx
// Before:
const { handleDelete, handleArchive } = useHabitActions({
  habitId,
  onSuccess: () => { triggerSelection(); onClose(); },
});

// After:
const { handleDelete, handleArchive } = useHabitActions({
  habitId,
  onSuccess: () => { triggerSelection(); (onHabitRemoved ?? onClose)(); },
});
```

**File:** `src/screens/HabitEditScreen/HabitEditScreen.tsx`
- Thread `onHabitRemoved` from props to `useHabitEditScreen`

### 3. Wire up `onHabitRemoved` in parent

**File:** `src/features/habits/components/HabitsModals/CalendarAndDetailModals.tsx`

```tsx
<HabitEditScreen
  habitId={habitToEdit?._id ?? null}
  visible={showEditScreen}
  onClose={closeEditScreen}
  onHabitRemoved={() => {
    closeEditScreen();
    closeHabitDetail();
  }}
  onOpenCueEditor={openMotivationFromEdit}
  onOpenVisionBoard={openMotivationFromEdit}
/>
```

### 4. Simplify `openMotivationFromEdit`

**File:** `src/features/habits/components/HabitsModals/CalendarAndDetailModals.tsx` (lines 36-39)

Detail is already open underneath, so we just close edit and switch the tab:

```tsx
const openMotivationFromEdit = () => {
  closeEditScreen();
  if (habitToEdit) openHabitDetail(habitToEdit, 'motivation');
};
```

This already works as-is — `openHabitDetail` sets the tab even if detail is already visible. No change needed.

## Files Modified

| File | Change |
|------|--------|
| `src/features/habits/components/HabitsModals/CalendarAndDetailModals.tsx` | Remove `closeHabitDetail()` from onEdit, add `onHabitRemoved` prop |
| `src/screens/HabitEditScreen/types.ts` | Add `onHabitRemoved` to props type |
| `src/screens/HabitEditScreen/useHabitEditScreen.ts` | Accept & thread `onHabitRemoved` |
| `src/screens/HabitEditScreen/HabitEditScreen.tsx` | Thread `onHabitRemoved` prop |

## Verification

1. **Detail → Edit**: Tap "Edit Habit" — edit sheet slides up on top of detail (no close-then-open)
2. **Edit → Cancel**: Tap Cancel or swipe down — edit dismisses, detail is visible underneath
3. **Edit → Save**: Save changes — edit dismisses, detail shows with updated data (Convex reactivity)
4. **Edit → Delete**: Delete habit, confirm — both modals close, back to habit list
5. **Edit → Archive**: Archive habit — both modals close, back to habit list
6. **Edit → Motivation**: Tap "Cue Editor" — edit closes, detail switches to motivation tab
7. **Android back button**: Should dismiss edit screen (topmost modal receives the event)
