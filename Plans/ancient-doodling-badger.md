# Fix: Allow 1-Character Habit Names in Edit Screen

## Context

PR #1236 (merged) allowed 1-character habit names by updating validators and the Create modal, but **missed the Edit screen entirely**. Users can create a habit named "X" but cannot save when editing it — the Save button stays disabled and a misleading "At least 2 characters required" error appears.

## Changes (2 surgical edits)

### 1. `src/screens/HabitEditScreen/HabitEditScreen.tsx` (line 85)

```diff
- canSave={state.habitName.trim().length >= 2}
+ canSave={state.habitName.trim().length > 0}
```

Matches the pattern already used in `CreateHabitModal/ModalHeader/ModalHeader.tsx:21`.

### 2. `src/screens/HabitEditScreen/NameInputSection.tsx` (lines 71-73)

Remove the "At least 2 characters required" error text:

```diff
  {habitName.length}/50 characters
- {habitName.length > 0 && habitName.trim().length < 2
-   ? ' · At least 2 characters required'
-   : ''}
```

The Edit screen always loads with an existing habit name, so the empty-state error is not a realistic scenario. The disabled Save button already guards against it.

## Git Strategy

1. `git checkout main && git pull origin main`
2. `git checkout -b fix/edit-screen-1char-habit`
3. Make both edits
4. Commit: `fix: allow 1-character habit names in Edit screen`
5. Push and create PR targeting `main`

## Verification

- Open the Edit screen for any habit
- Clear the name, type a single character → Save button should enable
- Character counter still shows correctly
- No "At least 2 characters required" error appears
