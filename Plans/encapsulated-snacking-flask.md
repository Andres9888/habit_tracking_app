# Optimistic + Offline Habit Delete & Archive

## Context

Delete and archive operations currently wait for server confirmation before the habit disappears from the list. The user taps delete/archive and sees a lag while the Convex mutation round-trips. Additionally, neither operation works offline — they fail silently.

The optimistic store already tracks `pendingArchives` but the habit list never reads from it to filter. Delete has no optimistic tracking at all. The offline queue already supports `removeHabit` and `archiveHabit` operation types, but the feature hooks call Convex mutations directly instead of using the offline-aware wrappers.

**Goal**: After the user confirms delete (or taps archive), the habit immediately disappears. The mutation fires in background. If offline or network error, the operation queues for later sync. If it fails for a non-network reason, the habit reappears (rollback).

---

## Changes

### 1. Add `pendingDeletes` to optimistic store types

**`src/lib/optimistic/types.ts`**
- Add `DeleteOperationPayload` interface: `{ habitId: Id<'habits'>; habitName: string }`
- Add `'delete'` to `OperationType` union
- Add `DeleteOperationPayload` to `OperationPayload` union
- Add `delete` case to `TypedOptimisticOperation`
- Add `pendingDeletes: Map<string, boolean>` to `OptimisticStore` interface

### 2. Add `addDelete` store operation

**`src/lib/optimistic/store/operations.ts`**
- Import `DeleteOperationPayload`
- Add `addDelete(payload)` method following exact `addArchive` pattern
- Sets `state.pendingDeletes.set(payload.habitId, true)` (always true — delete is one-directional)

### 3. Add delete state management

**`src/lib/optimistic/store/stateManagement.ts`**
- Import `DeleteOperationPayload`
- Add `case 'delete'` to `clearPendingState` switch
- Add `getPendingDelete(habitId)` getter
- Add `state.pendingDeletes.clear()` in `reset()`

### 4. Update store API interface

**`src/lib/optimistic/store/types.ts`**
- Import `DeleteOperationPayload`
- Add `addDelete(payload: DeleteOperationPayload): string` to `OptimisticStoreAPI`
- Add `getPendingDelete(habitId: Id<'habits'>): boolean | undefined` to `OptimisticStoreAPI`

### 5. Add `pendingDeletes` to store singleton

**`src/lib/optimistic/store/index.ts`**
- Add `pendingDeletes: new Map()` to `state`, initial `snapshot`, and `buildSnapshot`

### 6. Add persistence for `pendingDeletes`

**`src/lib/optimistic/store/persistence.ts`**
- Add `pendingDeletes: [string, boolean][]` to `SerializedOptimisticStore`
- Serialize in `saveOptimisticStore`: `pendingDeletes: [...store.pendingDeletes.entries()]`
- Deserialize in `deserializeStore`: `pendingDeletes: new Map(serialized.pendingDeletes)`
- Make validation backward-compatible: `(!store.pendingDeletes || Array.isArray(store.pendingDeletes))`
- Bump `OPTIMISTIC_STORE_VERSION` to 2
- In `migrateSerializedStore`, add `pendingDeletes: []` for v1 stores

### 7. Create optimistic delete mutation hook (NEW FILE)

**`src/lib/optimistic/hooks/useOptimisticDeleteMutation.ts`** (~50 lines)
- Pattern follows `useOptimisticToggleMutation` (optimistic + offline queue)
- Calls `optimisticStore.addDelete(payload)` immediately
- If offline → `getOfflineQueueManager().enqueue('removeHabit', { habitId })`
- If online → try mutation → on network error, queue → on other error, `fail()` + rethrow

### 8. Add `useOptimisticDelete` state reader hook

**`src/lib/optimistic/hooks/useOptimisticState.ts`**
- Add `useOptimisticDelete(habitId)` — reads `store.pendingDeletes.get(habitId)`

### 9. Update barrel exports

**`src/lib/optimistic/hooks/useOptimisticMutations.ts`** — export `useOptimisticDeleteMutation`
**`src/lib/optimistic/hooks/index.ts`** — export `useOptimisticDelete` + `useOptimisticDeleteMutation`
**`src/lib/optimistic/index.ts`** — export `useOptimisticDeleteMutation`, `useOptimisticDelete`, `DeleteOperationPayload`

### 10. Wire up `useHabitDelete` with optimistic + offline

**`src/features/habits/hooks/useHabitDelete.ts`**
- Import `useOptimisticDeleteMutation` and `useIsOnline`
- Create optimistic delete wrapper: `useOptimisticDeleteMutation(removeHabit, { isOnline })`
- In `onPress` after Alert confirmation: call `optimisticDelete(habitId, habitName)` instead of raw `removeHabit`
- Keep existing haptic + analytics. On error (non-network, re-thrown), keep existing error Alert

### 11. Wire up `useHabitsArchive` with offline fallback

**`src/features/habits/hooks/useHabitsArchive.ts`**
- Import `useIsOnline`, `getOfflineQueueManager`, `isNetworkError`
- Before mutation: if `!isOnline`, queue with `getOfflineQueueManager().enqueue('archiveHabit', { habitId })` and return early (keep optimistic state active)
- In catch: if `isNetworkError(error)`, queue and return (don't call `optimisticStore.fail()`)
- Non-network errors: keep current rollback behavior

### 12. Filter pending deletes/archives from habit list (THE KEY UX CHANGE)

**`src/features/habits/hooks/useHabitsListState.ts`**
- Import `useOptimisticStore`
- After `habitsFromQuery` (line ~116), add `useMemo` filter:
  ```ts
  const optimistic = useOptimisticStore();
  const visibleHabits = useMemo(() => {
    if (optimistic.pendingDeletes.size === 0 && optimistic.pendingArchives.size === 0) {
      return habitsFromQuery;  // fast path
    }
    return habitsFromQuery.filter((h) =>
      !optimistic.pendingDeletes.get(h._id) && !optimistic.pendingArchives.get(h._id)
    );
  }, [habitsFromQuery, optimistic]);
  ```
- Replace `habitsFromQuery` with `visibleHabits` in downstream usages: `habitsById`, `habitsServerStrengthById`, `habitsWithPredictedStrength`

---

## Files Modified (13 existing + 1 new)

| File | Change |
|------|--------|
| `src/lib/optimistic/types.ts` | Add `DeleteOperationPayload`, update unions |
| `src/lib/optimistic/store/operations.ts` | Add `addDelete()` |
| `src/lib/optimistic/store/stateManagement.ts` | Add delete case + `getPendingDelete()` |
| `src/lib/optimistic/store/types.ts` | Add to API interface |
| `src/lib/optimistic/store/index.ts` | Add `pendingDeletes` map |
| `src/lib/optimistic/store/persistence.ts` | Serialize/migrate `pendingDeletes` |
| `src/lib/optimistic/hooks/useOptimisticDeleteMutation.ts` | **NEW** — optimistic + offline delete hook |
| `src/lib/optimistic/hooks/useOptimisticState.ts` | Add `useOptimisticDelete()` |
| `src/lib/optimistic/hooks/useOptimisticMutations.ts` | Export new hook |
| `src/lib/optimistic/hooks/index.ts` | Export new hook + state reader |
| `src/lib/optimistic/index.ts` | Barrel export |
| `src/features/habits/hooks/useHabitDelete.ts` | Use optimistic + offline delete |
| `src/features/habits/hooks/useHabitsArchive.ts` | Add offline queue fallback |
| `src/features/habits/hooks/useHabitsListState.ts` | Filter pending ops from list |

## What's NOT changing (minimal scope)

- `useOfflineHabitMutations.ts` — already supports `removeHabit`/`archiveHabit`
- Offline queue types — already include `removeHabit`/`archiveHabit`
- Sync executor — already handles these operation types
- Convex mutations — no backend changes needed
- Batch delete/archive — out of scope

## Verification

1. **Optimistic delete**: Tap delete → confirm → habit disappears instantly → check Convex dashboard to confirm deletion
2. **Optimistic archive**: Tap archive → habit disappears from active list instantly → appears in archived list after server confirms
3. **Offline delete**: Enable airplane mode → delete habit → habit disappears → disable airplane mode → habit syncs (check Convex logs)
4. **Offline archive**: Same flow as offline delete
5. **Rollback on failure**: Temporarily break the Convex mutation → delete habit → it reappears after failure → error alert shown
6. **Existing tests**: Run `npm test -- --testPathPattern=optimistic` to verify store tests still pass
