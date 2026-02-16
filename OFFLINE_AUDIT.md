# Offline Resilience Audit - Chain Day App
**Date:** 2026-02-15  
**Branch:** fix/offline-resilience

## Executive Summary

Chain Day has **solid offline infrastructure** already in place:
- ✅ Network status detection (`NetworkStatusContext`)
- ✅ Offline queue manager with AsyncStorage persistence
- ✅ Optimistic updates for habit toggles
- ✅ Sync orchestrator with retry logic
- ✅ Visual indicators (OfflineIndicator, SyncingIndicator, SyncedToast)

However, there are **critical gaps** that need immediate attention.

---

## Audit Findings

### 1. ✅ Habit Toggle (Completions) - **WORKING**
**Can users toggle habits offline?**
- **Status:** ✅ **YES** - Optimistic updates + offline queue
- **Code:** `useOptimisticToggleMutation` handles offline gracefully
- **Flow:**
  1. User toggles → Optimistic store updates immediately
  2. If offline → Queues operation via `OfflineQueueManager`
  3. When online → `SyncOrchestrator` processes queue
- **Evidence:** `src/lib/optimistic/hooks/useOptimisticToggleMutation.ts`

### 2. ✅ Online Reconnection Sync - **WORKING**
**Does data sync when coming back online?**
- **Status:** ✅ **YES** - Auto-sync with 30s debounce
- **Code:** `useNetworkSync` + `SyncOrchestrator`
- **Flow:**
  1. Network reconnect detected
  2. Waits `DEFAULT_RECONNECT_DELAY_MS` for stability
  3. Triggers batch sync of queued operations
- **Evidence:** `src/contexts/NetworkStatusContext/useNetworkSync.ts`
- **Tests:** `tests/e2e/offline-sync.e2e.test.ts`

### 3. ⚠️ Screens Without Internet - **PARTIAL**
**Do any screens crash/blank without internet?**
- **Status:** ⚠️ **NEEDS VERIFICATION**
- **Findings:**
  - Most screens use Convex queries which handle offline gracefully
  - `HabitsPageSkeleton` shown during initial load
  - **Gap:** No explicit error boundary for network failures in create/edit modals
  - **Gap:** Archive/Settings screens not tested offline

### 4. ✅ AsyncStorage Fallbacks - **WORKING**
**Are critical data stored locally?**
- **Status:** ✅ **YES**
- **Storage:**
  - Offline queue: `@chainday/offline-queue`
  - Queue state persists via `queueStorage.ts`
  - Convex handles its own caching
- **Evidence:** `src/lib/offline/persistence/queueStorage.ts`

### 5. ✅ Offline Status Indicator - **WORKING**
**Is there a visual indicator for offline status?**
- **Status:** ✅ **YES**
- **Components:**
  - `<OfflineIndicator>` in HabitsListHeader (top of screen)
  - `<SyncingIndicator>` shows pending sync count
  - `<SyncedToast>` confirms successful sync
- **Evidence:** 
  - `src/features/habits/components/HabitsList/HabitsListHeader.tsx`
  - `src/components/SyncStatus/`

### 6. ❌ Create Habit While Offline - **BROKEN**
**What happens if they create a habit while offline?**
- **Status:** ❌ **FAILS** - No offline support
- **Problem:**
  - `useCreateHabitHandlers` directly calls Convex `createHabit` mutation
  - No queue integration
  - No optimistic creation
  - Will throw network error if offline
- **Impact:** **CRITICAL** - Users can't create habits offline
- **Evidence:** `src/components/CreateHabitModal/hooks/useCreateHabitHandlers.ts:95-107`
- **Fix Required:** ✅

### 7. ⚠️ Conflict Resolution - **PARTIAL**
**What if they toggle on phone A and phone B?**
- **Status:** ⚠️ **NEEDS IMPROVEMENT**
- **Current:**
  - Optimistic store handles local conflicts (duplicate toggle detection)
  - `StateReconciler` reconciles server responses
  - **Gap:** No explicit last-write-wins timestamp strategy
  - **Gap:** No conflict UI/toast when server overwrites local state
- **Evidence:**
  - `src/lib/offline/sync/reconcile/StateReconciler.ts`
  - `src/lib/offline/queueManager/enqueue.ts` (duplicate detection)

---

## Critical Gaps to Fix

### Priority 1: Create Habit Offline Support
- **Problem:** Habit creation fails offline
- **Solution:**
  1. Add `createHabit` operation type to offline queue
  2. Create optimistic habit creation (local-first ID generation)
  3. Reconcile server-assigned ID on sync
  4. Update `useCreateHabitHandlers` to check `isOnline`

### Priority 2: Edit Habit Offline Support
- **Problem:** Similar to create — direct mutation without offline handling
- **Solution:** Add `updateHabit` operation to queue

### Priority 3: Archive/Pause/Remove Offline Support
- **Problem:** These mutations bypass offline queue
- **Solution:** Add operation types for all mutations

### Priority 4: Conflict Resolution UX
- **Problem:** Users don't know when server overwrites their changes
- **Solution:** Add toast notification when reconciliation overrides local state

### Priority 5: Error Handling for Failed Operations
- **Problem:** No UI feedback for permanently failed operations
- **Solution:** Add "Sync Failed" banner with retry/discard options

---

## Testing Gaps

### E2E Tests Needed
1. ✅ Toggle offline → reconnect → verify sync _(exists)_
2. ❌ Create habit offline → reconnect → verify creation
3. ❌ Edit habit offline → reconnect → verify update
4. ❌ Multi-device conflict resolution (same habit, different changes)
5. ❌ Offline → create 10 habits → reconnect → batch sync
6. ❌ Network flake during mutation (starts online, drops mid-request)

---

## Recommendations

### Immediate Actions (This PR)
1. ✅ Add offline support for habit creation
2. ✅ Add offline support for habit editing
3. ✅ Add offline support for archive/pause/remove
4. ✅ Add conflict resolution toast
5. ✅ Add comprehensive E2E tests

### Future Enhancements (Later PRs)
1. Optimistic reordering (drag-drop offline)
2. Offline-first habit templates
3. Conflict resolution modal (choose local vs server)
4. Offline analytics queue
5. Service worker for web version

---

## Architecture Strengths

**What's Working Well:**
- Clean separation of concerns (queue → sync → reconciliation)
- Type-safe operation payloads
- Comprehensive retry strategy (exponential backoff, rate limiting)
- Circuit breaker pattern for repeated failures
- Event-driven architecture (subscriptions for UI updates)

**Code Quality:**
- Well-tested core (`queueManager.test.ts`, `offline-sync.e2e.test.ts`)
- Clear documentation (`docs/offline-habit-sync.md`)
- Functional React patterns (hooks, contexts)

---

## Next Steps

1. Implement fixes for Priority 1-3 gaps
2. Add E2E tests for offline create/edit
3. Manual QA on physical device (airplane mode testing)
4. Create PR with before/after videos
5. Add to release notes as "Offline Mode Improvements"
