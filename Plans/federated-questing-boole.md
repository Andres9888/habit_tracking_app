# Mass Habit Archive & Delete

## Context

Currently, archiving or deleting habits is one-at-a-time via swipe gestures on individual cards. Users with many habits have no way to bulk-manage them. This feature adds a **selection mode** to the habit home screen, letting users select multiple habits and archive or delete them in one action.

## UX Flow

1. **Enter selection mode** — Long-press the Settings icon in the BottomActionBar. No card pre-selected; user taps cards to select.
2. **Select habits** — Tap cards to toggle selection. A "Select All / Deselect All" toggle appears below the header. Checkboxes animate in on the left side of each card.
3. **Selection action bar** — The `BottomActionBar` swaps to a `SelectionActionBar` showing: `[Cancel]  "N selected"  [Archive] [Delete]`.
4. **Archive** — Batch archives selected habits, shows undo toast ("3 habits archived"), exits selection mode.
5. **Delete** — Shows confirmation modal, then batch deletes, exits selection mode. No undo (too much tracking data to snapshot; confirmation modal is the safeguard).
6. **Cancel** — Clears selection, exits selection mode.
7. **During selection mode** — Drag-to-reorder disabled (`activationDistance: 9999`), swipe-to-archive disabled (`onArchive` suppressed).

## Implementation

### Phase 1: Convex Mutations

**New file: `convex/habits/batchArchive.ts`** (~60 lines)
- `batchArchive({ habitIds })` — loops IDs, auth + ownership check each, patches `archived: true, archivedAt: Date.now()`
- `batchUnarchive({ habitIds })` — reverses batch archive, restores order via `findMaxOrder`
- Pattern: follow `convex/habits/archive.ts` auth/ownership pattern exactly

**New file: `convex/habits/batchRemove.ts`** (~50 lines)
- `batchRemove({ habitIds })` — loops IDs, deletes habit + all tracking records
- Pattern: follow `convex/habits/remove.ts` deletion logic (but no snapshot return)

**Modify: `convex/habits.ts`** — add exports:
```
export { batchArchive, batchUnarchive } from './habits/batchArchive';
export { batchRemove } from './habits/batchRemove';
```

### Phase 2: Selection State Hooks

**New: `src/features/habits/hooks/useSelectionMode/`**

`useSelectionMode.types.ts` (~25 lines):
```ts
interface UseSelectionModeResult {
  isSelectionMode: boolean;
  selectedIds: Set<Id<'habits'>>;
  selectedCount: number;
  isAllSelected: boolean;
  enterSelectionMode: (initialId?: Id<'habits'>) => void;
  exitSelectionMode: () => void;
  toggleSelection: (id: Id<'habits'>) => void;
  selectAll: () => void;
  deselectAll: () => void;
}
```

`useSelectionMode.ts` (~60 lines):
- `useState<boolean>` for mode, `useState<Set<Id>>` for selected IDs
- `enterSelectionMode(initialId?)` — sets mode true, optionally pre-selects
- `toggleSelection(id)` — adds/removes from set
- `selectAll/deselectAll` — based on `habits` array
- Needs `habits: Habit[]` input to derive `isAllSelected`

`useSelectionActions.ts` (~80 lines):
- Calls `useMutation(api.habits.batchArchive)`, `batchUnarchive`, `batchRemove`
- `handleBatchArchive()` — calls mutation, triggers undo toast state, calls `exitSelectionMode()`
- `handleBatchDelete()` — shows confirmation modal state
- `confirmBatchDelete()` — calls mutation, exits selection mode
- Manages batch undo state (stores archived IDs for unarchive)

`index.ts` — barrel re-export

### Phase 3: UI Components

**New: `src/features/habits/components/SelectionActionBar/`**
- `SelectionActionBar.tsx` (~80 lines) — mirrors `BottomActionBar` glass capsule style
  - Reuses: `BlurView`, `useSafeAreaInsets`, same shadow/border constants from `BottomActionBar.styles`
  - Layout: `[X Cancel]  "N selected"  [Archive icon] [Trash icon]`
  - Archive button: amber color, `Archive` icon from lucide
  - Delete button: red color, `Trash2` icon from lucide
- `SelectionActionBar.types.ts` (~15 lines)
- `index.ts`

**New: `src/features/habits/components/BatchDeleteConfirmModal.tsx`** (~60 lines)
- Uses existing `Modal` component pattern (React Native `<Modal>`)
- Content: warning icon, "Delete N habits?", explanation text, [Cancel] [Delete] buttons
- Delete button uses `danger` variant

**New: `src/features/habits/components/SelectAllRow.tsx`** (~50 lines)
- Horizontal row with `Checkbox` (indeterminate when partial selection) + "Select All" label + "N selected" count
- Uses existing `Checkbox` component from `src/components/Checkbox.tsx`

**New: `src/components/DraggableHabit/SelectionOverlay.tsx`** (~40 lines)
- Absolutely positioned checkbox on the left of the card
- Animated entrance via Reanimated `FadeIn`
- Uses existing `Checkbox` component with `variant="primary"`

### Phase 4: Integration (wiring it all together)

**Modify: `src/features/habits/HabitsApp.tsx`**
- Import + call `useSelectionMode(list.habits)` and `useSelectionActions(...)`
- Pass selection props down to `HabitsList`
- Conditional render: `isSelectionMode ? <SelectionActionBar .../> : <BottomActionBar .../>`
- Add `BatchDeleteConfirmModal` and batch `ArchiveUndoToast` to overlays section

**Modify: `src/features/habits/components/HabitsList/HabitsList.types.ts`**
- Add optional selection props to `HabitsListProps`:
  ```ts
  isSelectionMode?: boolean;
  selectedIds?: Set<Id<'habits'>>;
  onToggleSelection?: (id: Id<'habits'>) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  isAllSelected?: boolean;
  selectedCount?: number;
  ```

**Modify: `src/features/habits/components/HabitsList/HabitsListContent.tsx`**
- When `isSelectionMode`, set `activationDistance: 9999` on `DraggableFlatList`
- Thread selection props to `renderItem`

**Modify: `src/features/habits/components/HabitsList/renderHabitsListHeader.tsx`**
- When `isSelectionMode`, render `<SelectAllRow>` below the existing header content

**Modify: `src/features/habits/hooks/useHabitRenderItem.types.ts`**
- Add optional: `isSelectionMode`, `selectedIds`, `onToggleSelection`

**Modify: `src/features/habits/hooks/HabitRenderContent.tsx`**
- When `isSelectionMode`:
  - Pass `isSelected` and `showSelectionOverlay` to `DraggableHabit`
  - Override `onPress` to call `onToggleSelection(item._id)` instead of `handleHabitPress`
  - Set `onArchive={undefined}` (suppress swipe)
  - Set `onLongPress={undefined}` (suppress drag)

**Modify: `src/components/DraggableHabit/types.ts`**
- Add `isSelected?: boolean` and `showSelectionOverlay?: boolean`

**Modify: `src/components/DraggableHabit/DraggableHabit.tsx`**
- Pass `isSelected` and `showSelectionOverlay` through to `DraggableHabitCard`

**Modify: `src/components/DraggableHabit/DraggableHabitCard.tsx`**
- When `showSelectionOverlay`, render `<SelectionOverlay>` positioned to the left of card content
- Add subtle selected state highlight (slight border or background tint)

**Modify: `src/features/habits/components/HabitsAppOverlays.tsx`**
- Add batch `ArchiveUndoToast` (reuses existing `ArchiveUndoToast` component with dynamic message)

## Files Summary

### New Files (11)
| File | Lines | Purpose |
|------|-------|---------|
| `convex/habits/batchArchive.ts` | ~60 | batchArchive + batchUnarchive mutations |
| `convex/habits/batchRemove.ts` | ~50 | batchRemove mutation |
| `src/features/habits/hooks/useSelectionMode/index.ts` | ~5 | barrel |
| `src/features/habits/hooks/useSelectionMode/useSelectionMode.ts` | ~60 | selection state management |
| `src/features/habits/hooks/useSelectionMode/useSelectionMode.types.ts` | ~25 | type definitions |
| `src/features/habits/hooks/useSelectionMode/useSelectionActions.ts` | ~80 | batch action handlers + undo |
| `src/features/habits/components/SelectionActionBar/index.ts` | ~3 | barrel |
| `src/features/habits/components/SelectionActionBar/SelectionActionBar.tsx` | ~80 | floating action bar for selection mode |
| `src/features/habits/components/SelectionActionBar/SelectionActionBar.types.ts` | ~15 | props |
| `src/features/habits/components/BatchDeleteConfirmModal.tsx` | ~60 | confirmation dialog |
| `src/features/habits/components/SelectAllRow.tsx` | ~50 | select all checkbox row |
| `src/components/DraggableHabit/SelectionOverlay.tsx` | ~40 | checkbox overlay on card |

### Modified Files (10)
| File | Change |
|------|--------|
| `convex/habits.ts` | Add 2 export lines |
| `src/features/habits/HabitsApp.tsx` | Wire selection hooks, conditional bar render |
| `src/features/habits/components/HabitsList/HabitsList.types.ts` | Add selection props |
| `src/features/habits/components/HabitsList/HabitsListContent.tsx` | Disable drag in selection mode |
| `src/features/habits/components/HabitsList/renderHabitsListHeader.tsx` | Render SelectAllRow |
| `src/features/habits/hooks/useHabitRenderItem.types.ts` | Add selection props |
| `src/features/habits/hooks/HabitRenderContent.tsx` | Override press/swipe in selection mode |
| `src/components/DraggableHabit/types.ts` | Add isSelected, showSelectionOverlay |
| `src/components/DraggableHabit/DraggableHabit.tsx` | Pass selection props through |
| `src/components/DraggableHabit/DraggableHabitCard.tsx` | Render SelectionOverlay |
| `src/features/habits/components/HabitsAppOverlays.tsx` | Add batch undo toast |

### Reused Existing Components
- `Checkbox` from `src/components/Checkbox.tsx` (with indeterminate state for select-all)
- `ArchiveUndoToast` from `src/components/ArchiveUndoToast/` (for batch undo, dynamic message)
- `BottomActionBar` styles from `src/features/habits/components/BottomActionBar/BottomActionBar.styles.ts` (glass capsule pattern)
- `useHapticFeedback` from `src/hooks/useHapticFeedback.ts`
- `optimisticStore` from `src/lib/optimistic` (for batch optimistic updates)

## Verification

1. **Unit**: Convex mutations work — create test habits, call `batchArchive`, verify `archived: true` on all; call `batchUnarchive`, verify restored; call `batchRemove`, verify deleted with tracking data
2. **Manual test flow**:
   - Long-press a habit card -> selection mode activates, card is selected with checkbox
   - Tap other cards -> checkboxes toggle, count updates in action bar
   - Tap "Select All" -> all habits selected, checkbox shows checkmark
   - Tap Archive -> habits disappear, undo toast shows "N habits archived"
   - Tap Undo -> habits reappear in list
   - Re-enter selection mode, select habits, tap Delete -> confirmation modal appears
   - Confirm delete -> habits permanently removed
   - Tap Cancel in selection mode -> exits cleanly, no state leaks
3. **Edge cases**: select all with 1 habit, archive undo after navigating, selection mode with paused habits
