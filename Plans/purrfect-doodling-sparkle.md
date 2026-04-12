# Visual Redesign: Archived Habits Page

## Context

The archived habits page currently uses a compact, utilitarian row layout (`CompactHabitRow`) -- small icon, name, date, and tiny resume/delete buttons. Meanwhile, a richer set of components (`AnimatedHabitCard`, `StatsSummaryBar`, `ArchiveSelectionBar`, `DangerZoneFooter`) were built previously but never wired into the main component. These show habit stats (strength, streaks, completions), animated entrance, batch selection with a floating action bar, and a danger zone for bulk deletion.

**Goal:** Wire up the existing unused components to transform the archive page from a plain list into a polished, feature-rich experience. No new features or components to design -- just connecting existing pieces.

## What Changes Visually

| Before (CompactHabitRow) | After (AnimatedHabitCard) |
|---|---|
| Small 44px row with tiny buttons | Full-width card with p-6 padding |
| Icon + name + date only | Icon + name + date + strength/streak/completions badges |
| Inline "Resume" pill + trash icon | Full-width "Resume This Habit" button + "or delete permanently" text link with inline confirmation |
| No selection mode | Long-press reveals checkboxes + floating batch action bar |
| No summary bar | "X archived habits" summary bar with Select toggle |
| No danger zone | Dashed-border "Delete All Archived" footer |

---

## Implementation Steps

### Step 1: Extract delete handlers from hooks (100-line compliance)

**File:** `ArchivedHabitsModal.hooks.ts` (currently 116 lines -- over limit)

**New file:** `useArchiveDeleteActions.ts` (~50 lines)
- Move `handlePermanentDelete` and `handleDeleteAll` into this new hook
- Accepts `removeHabit`, `deleteAllArchivedMutation`, `archivedHabits` as params
- Returns `{ handlePermanentDelete, handleDeleteAll }`

`ArchivedHabitsModal.hooks.ts` delegates to it internally. Return value unchanged.

### Step 2: Extract ActionButtons sub-components (100-line compliance)

**File:** `components/ActionButtons.tsx` (currently 149 lines -- over limit)

**New file:** `components/ActionButtonParts.tsx` (~85 lines)
- Move `ResumeButton`, `LimitReachedButtons`, `DeleteConfirmRow` here
- `ActionButtons.tsx` imports from it, drops to ~45 lines

### Step 3: Trim AnimatedHabitCard and ArchiveSelectionBar

- `AnimatedHabitCard.tsx` (107 lines) -- inline `CARD_SHADOW` alias, tighten whitespace -> ~97 lines
- `ArchiveSelectionBar.tsx` (109 lines) -- compress StyleSheet block -> ~97 lines

### Step 4: Create composed state hook

**New file:** `useArchivedHabitsModalState.ts` (~40 lines)

Composes all hooks into a single return object:
```ts
useArchivedHabitsModalLogic()   // data + mutations
useArchiveSelection()            // selection state
useArchiveSelectionActions(...)  // batch action wiring
useReduceMotion()                // accessibility
```

Returns flat object with everything the component needs.

### Step 5: Update barrel exports

**File:** `components/index.ts`

Add exports for: `AnimatedHabitCard`, `StatsSummaryBar`, `ArchiveSelectionBar`, `DangerZoneFooter`

### Step 6: Rewrite ArchivedHabitsModal.tsx (the core change)

Replace the current simple FlatList-of-CompactHabitRow with:

1. **Single state hook call:** `const state = useArchivedHabitsModalState()`
2. **FlatList renderItem:** `AnimatedHabitCard` with all props (habit, index, reducedMotion, selectionMode, isSelected, hasReachedLimit, onRestore, onDelete, onToggleSelect, onUpgradePress)
3. **ListHeaderComponent:** `StatsSummaryBar` (habit count, selection toggle)
4. **ListFooterComponent:** `DangerZoneFooter` (delete all, only when not in selection mode)
5. **FlatList extraData:** `[selectionMode, selectedIds]` to trigger re-renders
6. **Floating overlay:** `ArchiveSelectionBar` positioned absolute at bottom, visible only in selection mode
7. **Keep:** ModalHeader, EmptyState, LoadingState unchanged

Target: ~80 lines.

---

## Files Modified

| File | Change |
|---|---|
| `ArchivedHabitsModal.tsx` | Full rewrite to use AnimatedHabitCard + selection + footer |
| `ArchivedHabitsModal.hooks.ts` | Extract delete actions to new file |
| `components/index.ts` | Add 4 exports |
| `components/ActionButtons.tsx` | Extract sub-components |
| `components/AnimatedHabitCard.tsx` | Minor whitespace trim |
| `components/ArchiveSelectionBar.tsx` | Minor whitespace trim |

## New Files

| File | Purpose | ~Lines |
|---|---|---|
| `useArchiveDeleteActions.ts` | Extracted delete handlers | ~50 |
| `useArchivedHabitsModalState.ts` | Composed state hook | ~40 |
| `components/ActionButtonParts.tsx` | Extracted button sub-components | ~85 |

## Files NOT Changed

All existing hooks and sub-components remain untouched:
- `useArchiveSelection.ts`, `useArchiveSelectionActions.ts`, `useBatchArchiveActions.ts`
- `AnimatedHabitCard.hooks.ts`, `useCardAnimatedStyles.ts`
- `HabitCardHeader.tsx`, `HabitStatsBadges.tsx`, `SelectionCheckbox.tsx`
- `EmptyState.tsx`, `ModalHeader.tsx`, `LoadingState.tsx`
- `types.ts`, `utils.ts`

## Deferred

- `StrengthBackground` -- exists but AnimatedHabitCard doesn't use it yet (enhancement)
- `SectionDivider` -- no grouping logic to wire it into (future feature)
- `CompactHabitRow` -- becomes dead code, keep for now, remove in cleanup PR

## Verification

1. **Build:** `npx expo start` -- no TypeScript or import errors
2. **Lint:** `npm run lint:max-lines` -- all modified/new files under 100 lines
3. **Visual:** Open Settings -> Archived Habits and verify:
   - Cards show emoji icon, name, archive date, strength badge, streak badge, completions badge
   - "Resume This Habit" full-width green button works
   - "or delete permanently" text link shows inline confirmation
   - Summary bar shows count with "Select" toggle
   - Selection mode shows checkboxes, hides per-card actions, shows floating bar
   - Batch restore/delete from floating bar works
   - DangerZoneFooter appears at bottom when 2+ habits archived
   - Empty state still shows correctly
   - Loading skeleton still shows correctly
4. **Accessibility:** Verify `reducedMotion` disables card entrance animations
