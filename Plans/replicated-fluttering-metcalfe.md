# Improve Archive Workflow — Multi-Action Swipe

## Context

Users swipe left to archive a habit, but this action is not discoverable without onboarding. The swipe just "happens" with no visible affordance until a user accidentally swipes. Additionally, there's no way to delete a habit from the main list — users must navigate into the edit screen's DangerZone to find the delete option. This creates friction for users who made a test habit or want to quickly remove something.

The goal is to make the swipe action self-documenting by revealing labeled action buttons (like iOS Mail), while also exposing Delete as a quick action from the main list.

## Approach: Swipe-to-Reveal Buttons (No Full-Swipe Action)

Replace the current single amber "Archive" panel with two distinct action buttons revealed on swipe left. **No full-swipe trigger** — swipe only reveals the buttons, user must explicitly tap.

```
┌─────────────────────────────┬──────────┬──────────┐
│     Habit Card              │  Delete  │ Archive  │
│                             │   (red)  │ (amber)  │
└─────────────────────────────┴──────────┴──────────┘
                               ← swipe reveals buttons
```

**Behavior:**
- **Swipe left** — reveals both labeled buttons, card stops at button width
- **Tap Archive button** — archives immediately (no undo toast, the tap itself is the confirmation)
- **Tap Delete button** — shows iOS confirmation Alert, then permanently deletes
- **No full-swipe-through** — removed. No auto-trigger on over-swipe
- **No undo toast** — removed. Explicit button tap is intentional enough

## Changes

### 1. Create `DeleteAction` component
**New file:** `src/components/DraggableHabit/DeleteAction.tsx`

Mirror `ArchiveAction.tsx` but with:
- Red background (`#dc2626` light / `#991b1b` dark)
- `Trash2` icon from lucide
- "Delete" label
- Same animated scale/opacity interpolations
- `onPress` prop — calls delete handler

### 2. Refactor `ArchiveAction` → `SwipeActions` (multi-button)
**Modify:** `src/components/DraggableHabit/ArchiveAction.tsx`

Rename to `SwipeActions.tsx`. Render both action buttons in a row:
```
[DeleteAction] [ArchiveAction]
```

Each button is a `Pressable` with its own `onPress` handler. The `dragX` interpolation distributes width across both buttons proportionally.

Add `onArchive` and `onDelete` props so taps on each button call the correct handler.

### 3. Update `DraggableHabitCard` — remove full-swipe, add delete
**Modify:** `src/components/DraggableHabit/DraggableHabitCard.tsx`

- Add `onDelete` prop to `DraggableHabitCardProps`
- Pass both `onArchive` and `onDelete` to `SwipeActions`
- **Remove** `onSwipeableOpen` — no more full-swipe trigger
- Remove `rightThreshold` or set it high to prevent over-swipe snap
- Keep `overshootRight={false}` and increase `friction` if needed

### 4. Update `usePressHandlers` — remove `handleSwipeableOpen`
**Modify:** `src/components/DraggableHabit/usePressHandlers.ts`

- Remove `handleSwipeableOpen` function entirely
- Remove `archiveFlash` animation (no longer needed — archive happens via button tap, not swipe completion)
- Keep `handleLongPress`, `handlePressIn`, `handlePressOut` unchanged

### 5. Add `onDelete` prop through the component chain
**Modify:** `src/components/DraggableHabit/DraggableHabit.tsx` and its types

Pass `onDelete` from the parent habit list down through the orchestrator.

### 6. Create `useHabitDelete` hook
**New file:** `src/features/habits/hooks/useHabitDelete.ts`

Reuse the confirmation pattern from `ArchivedHabitsModal.hooks.ts` (lines 39-69):
- Shows `Alert.alert` confirmation ("Delete Habit" / "This will permanently delete..." / "Delete Forever")
- Calls `api.habits.remove` mutation
- Triggers haptics (heavy on prompt, success on delete, error on failure)

### 7. Simplify `useHabitsArchive` — remove undo toast logic
**Modify:** `src/features/habits/hooks/useHabitsArchive.ts`

- Remove `ArchiveUndoState`, `archiveUndo` state, `handleArchiveUndo`, `dismissArchiveUndo`
- `handleArchive` just does: optimistic update → mutation → confirm/fail
- Simplify the return type

### 8. Remove `ArchiveUndoToast` component
**Delete or deprecate:** `src/components/ArchiveUndoToast/`

No longer needed since there's no undo flow. Also remove references to it in the parent that renders it.

### 9. Wire delete handler in the habit list
**Modify:** `src/features/habits/HabitsApp.tsx` (or wherever `DraggableHabit` is rendered)

- Add `useHabitDelete` hook
- Pass `onDelete` callback down to each `DraggableHabit`

### 10. Update `SwipeActions` archive to call handler directly
The archive action button in `SwipeActions` needs to call `onArchive(habitId)` directly when tapped. This bypasses the old swipe-to-archive flow and calls the same mutation but via explicit tap.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/DraggableHabit/ArchiveAction.tsx` | Rename to `SwipeActions.tsx`, add delete button, add `onArchive`/`onDelete` press handlers |
| `src/components/DraggableHabit/DraggableHabitCard.tsx` | Add `onDelete` prop, remove `onSwipeableOpen`, pass handlers to `SwipeActions` |
| `src/components/DraggableHabit/DraggableHabitCard.types.ts` | Add `onDelete` to props, remove `handleSwipeableOpen` |
| `src/components/DraggableHabit/DraggableHabit.tsx` | Thread `onDelete` through |
| `src/components/DraggableHabit/usePressHandlers.ts` | Remove `handleSwipeableOpen` and `archiveFlash` param |
| `src/features/habits/hooks/useHabitsArchive.ts` | Remove undo toast state and handlers |
| `src/components/ArchiveUndoToast/` | Remove (no longer used) |
| New: `src/components/DraggableHabit/DeleteAction.tsx` | Red delete button component |
| New: `src/features/habits/hooks/useHabitDelete.ts` | Delete-with-confirmation hook |
| `src/features/habits/HabitsApp.tsx` (or parent) | Add `useHabitDelete`, pass `onDelete` to habit cards |
| Parent that renders `ArchiveUndoToast` | Remove toast rendering and related props |

## What Stays the Same

- **Selection mode** — batch archive/delete via `SelectionActionBar` (unchanged)
- **Edit screen DangerZone** — archive/delete buttons still work (unchanged)
- **Optimistic updates** — archive still uses optimistic store for instant UI feedback
- **`archiveFlash` overlay on card** — can be removed or repurposed for button-tap feedback

## Deferred: "Formed Habits" Concept

The user mentioned a possible "formed/completed habit" status but isn't committed yet. This can be added later as:
- A third swipe action button
- A long-press context menu option
- An option in the edit screen

No schema or backend changes needed for the current scope.

## Verification

1. **Swipe left** on a habit card → two buttons visible (Delete red, Archive amber), card stops
2. **Tap Archive button** → habit archives immediately, disappears from list
3. **Tap Delete button** → iOS confirmation alert, "Delete Forever" permanently removes
4. **Over-swipe** → card does NOT fly away or auto-trigger any action
5. **Swipe back / tap elsewhere** → card snaps back to normal position
6. **Selection mode** → batch archive/delete still works unchanged
7. **Edit screen DangerZone** → archive/delete buttons still work unchanged
8. **Dark mode** → both buttons render correctly with dark theme colors
9. **Archived habits modal** → restored habits still work, delete-all still works
