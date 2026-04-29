# Plan: Disable Bulk Select / "Remove All" Feature (Temporary)

## Context

The current bulk-selection feature lets a user **long-press the Settings icon** in the BottomActionBar to enter selection mode, which exposes a "Select All" row, a bottom action bar with **Archive** and **permanent Delete** ("hard remove all"), and a confirmation modal.

The user wants this feature gone **"until we have it done"** — i.e. temporarily hidden while it's reworked, not ripped out. The phrase "hard remove all" refers to the permanent batch delete (`batchRemove` mutation, which permanently destroys habits + tracking data).

Per the steering rules (surgical fixes, never gut components), the right move is to **disable the single user-facing entry point** so the entire feature becomes inert — without deleting any of the underlying code that was built intentionally and can be re-enabled later.

## Approach

The whole feature is gated behind one boolean: `selection.isSelectionMode`. Nothing renders or fires unless that flips true. The only thing that flips it true is the `onLongPress` handler on the Settings icon in `BottomActionBar`.

**Remove that one handler binding.** The selection mode can no longer be entered, so:
- `SelectAllRow` never renders (gated on `isSelectionMode` in `renderHabitsListHeader.tsx:64-69`)
- `SelectionActionBar` never renders (gated on `isSelectionMode` in `HabitsApp.tsx:132`)
- `BatchDeleteConfirmModal` never opens (only `selectionActions.showDeleteConfirmation` triggers it, only callable from `SelectionActionBar`)
- `batchRemove` / `batchArchive` mutations never get called from the client

All hooks, components, mutations, and types remain in place for when the feature is "done." Re-enabling is a 2-line revert.

## Changes

### `src/features/habits/components/BottomActionBar/BottomActionBar.tsx`

Remove the long-press wiring on the Settings `Pressable`:

- **Line 56**: delete `accessibilityHint='Long press to select habits'`
- **Line 60**: delete `onLongPress={props.onLongPressSettings}`

The `onLongPressSettings` prop stays in the type and stays plumbed through `useBottomBarProps` → `BottomActionBar` (just unused on this component). This keeps the wiring intact for trivial restoration.

That's the entire surgical change. **Two lines deleted.**

## What is intentionally NOT changed

These all stay exactly as they are, untouched:

- `convex/habits/batchRemove.ts` — backend mutation
- `convex/habits/batchArchive.ts` — backend mutation
- `src/features/habits/hooks/useSelectionMode/*` — selection state hook
- `src/features/habits/hooks/useSelectionMode/useSelectionActions.ts` — batch handlers
- `src/features/habits/components/SelectAllRow.tsx`
- `src/features/habits/components/SelectionActionBar/SelectionActionBar.tsx`
- `src/features/habits/components/BatchDeleteConfirmModal.tsx`
- `src/features/habits/HabitsApp.tsx` — selection wiring still mounted but never activates
- `src/features/habits/components/HabitsList/renderHabitsListHeader.tsx` — `SelectAllRow` render gated on `isSelectionMode`, never true now
- `src/features/habits/components/HabitsAppOverlays.tsx` — `BatchDeleteConfirmModal` render gated on `confirmDeleteVisible`, never true now

These are dormant but ready. Re-enable by restoring the two lines in `BottomActionBar.tsx`.

## Verification

1. Run the app (Expo / React Native dev server).
2. Navigate to the habits screen with at least one habit.
3. **Long-press the Settings (gear) icon** in the bottom bar — confirm nothing happens (no selection mode entered, no "Select All" row appears, no bottom action bar swap).
4. **Tap the Settings icon** — confirm settings still opens normally (regular `onPress` is preserved).
5. Confirm the bottom bar still shows: Settings · Progress ring + FAB · Inspire icon (no visual changes).
6. Run `npx tsc --noEmit` to confirm no type errors from the unused-prop situation.
7. Pre-commit hooks (eslint + prettier) on the changed file.

## Critical files

- `/Users/andres/conductor/workspaces/habit_tracking_app/trenton/src/features/habits/components/BottomActionBar/BottomActionBar.tsx` — the only file edited

## Re-enabling later

When the redesigned feature is ready, restore the two deleted lines in `BottomActionBar.tsx` (or rebind `onLongPress` to whatever the new entry-point gesture is).
