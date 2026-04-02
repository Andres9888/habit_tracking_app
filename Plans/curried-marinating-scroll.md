# Plan: Remove immersive empty state, use inline empty state in habit list

## Context

When a user has zero habits, `HabitsListContent.tsx:97-99` short-circuits and renders `HabitsEmptyStateMinimal` — a full-screen immersive onboarding experience (gradient, hero, input, chips, confetti success state). This replaces the normal list UI entirely (no calendar header, no DraggableFlatList).

The goal is to remove this special empty state page and let the habit list page render normally even when empty, using a simple inline `ListEmptyComponent` within the FlatList.

## Approach

### Step 1: Modify `HabitsListContent.tsx` to always render the DraggableFlatList

**File:** `src/features/habits/components/HabitsList/HabitsListContent.tsx`

- Remove the `if (isEmpty) { return ... }` short-circuit (lines 97-99)
- Remove the `listEmptyComponent` useMemo (lines 63-72)
- Remove the `renderHabitsListEmpty` import (line 23)
- Add `ListEmptyComponent` prop to the DraggableFlatList using the existing generic `EmptyState` component with `variant='noHabits'`
- Wire the CTA to `handlers.handleAddHabitPress` (opens full create habit screen)
- Keep the `contentContainerStyle` logic but simplify since we no longer need the isEmpty-specific flexGrow/padding

### Step 2: Remove `renderHabitsListEmpty.tsx`

**File:** `src/features/habits/components/HabitsList/renderHabitsListEmpty.tsx` — delete

### Step 3: Update `HabitsListRenders.tsx` barrel export

**File:** `src/features/habits/components/HabitsList/HabitsListRenders.tsx`

- Remove the `renderHabitsListEmpty` re-export

### Step 4: Clean up `handleSuccessTransitionComplete` chain

The success transition was only triggered by the empty state's `SuccessState` component. With the empty state removed, this callback is dead code.

- **`HabitsListContent.tsx`**: Remove `handleSuccessTransitionComplete` from props destructuring
- **`HabitsList.tsx`**: Remove `handleSuccessTransitionComplete` from `useHabitsListAnimations` call and the prop passed to `HabitsListContent`
- **`HabitsList.types.ts`**: Remove `handleSuccessTransitionComplete` from `HabitsListContentProps`
- **`useHabitsListAnimations.ts`**: Can be deleted entirely (only exposed `handleSuccessTransitionComplete`)
- **`useHabitsListState.ts`**: Remove `isInSuccessCelebration` state (only used by the success celebration flow)
- **`useHabitsListHandlers.ts`**: Remove `state.setIsInSuccessCelebration(true)` from `handleQuickCreateHabit` (line 73), remove `isInSuccessCelebration` from the state destructuring in `useHabitsListEffects` call
- **`useHabitsListEffects.ts`**: Remove `isInSuccessCelebration` from the interface and the condition check

### Step 5: Remove `handleQuickCreateHabit` handler

This was only used by the empty state's inline creation flow. With the empty state removed, quick-create from the list is no longer a flow.

- **`useHabitsListHandlers.ts`**: Remove `handleQuickCreateHabit` function and its return
- Clean up unused imports (`useMutation`, `api.habits.create`, `showCreateError`) if they become orphaned

### Step 6: Delete `HabitsEmptyStateMinimal/` directory

**Directory:** `src/features/habits/components/HabitsEmptyStateMinimal/` (50+ files)

Delete the entire directory. No other code imports from it (only `renderHabitsListEmpty.tsx` did, which is deleted in Step 2).

### Step 7: Delete `HabitsEmptyState.tsx` barrel

**File:** `src/features/habits/components/HabitsEmptyState.tsx` — delete (it only re-exported from `HabitsEmptyStateMinimal`)

## Critical files to modify

| File | Action |
|------|--------|
| `src/features/habits/components/HabitsList/HabitsListContent.tsx` | Edit: remove isEmpty short-circuit, add ListEmptyComponent |
| `src/features/habits/components/HabitsList/HabitsListRenders.tsx` | Edit: remove renderHabitsListEmpty export |
| `src/features/habits/components/HabitsList/HabitsList.tsx` | Edit: remove animation wiring |
| `src/features/habits/components/HabitsList/HabitsList.types.ts` | Edit: remove handleSuccessTransitionComplete |
| `src/features/habits/components/HabitsList/useHabitsListAnimations.ts` | Delete |
| `src/features/habits/components/HabitsList/useHabitsListState.ts` | Edit: remove isInSuccessCelebration state |
| `src/features/habits/components/HabitsList/useHabitsListHandlers.ts` | Edit: remove handleQuickCreateHabit, remove celebration state |
| `src/features/habits/components/HabitsList/useHabitsListEffects.ts` | Edit: remove isInSuccessCelebration |
| `src/features/habits/components/HabitsList/renderHabitsListEmpty.tsx` | Delete |
| `src/features/habits/components/HabitsEmptyStateMinimal/` (entire dir) | Delete |
| `src/features/habits/components/HabitsEmptyState.tsx` | Delete |

## Existing code to reuse

- `src/components/EmptyState/EmptyState.tsx` — generic empty state with `variant='noHabits'` ("Ready to build a new habit?", CTA "Create Your First Habit")
- `handlers.handleAddHabitPress` — already exists, opens the full create habit screen

## Verification

1. Run `npx tsc --noEmit` to verify no type errors from removed props/imports
2. Run `npm run lint` to check for unused imports
3. Run tests: `npx jest --testPathPattern="HabitsList" --no-coverage`
4. Manual verification: with zero habits, the habit list page should show the calendar header + EmptyState inline in the list area
5. Verify creating a habit from the CTA works and the habit appears in the list
