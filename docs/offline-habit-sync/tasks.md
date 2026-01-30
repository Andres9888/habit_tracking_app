# Tasks: Offline Habit Completion Sync

**Feature**: Offline Habit Completion Sync
**Spec**: [spec.md](./spec.md)
**Created**: 2026-01-30

---

## Phase 1: Setup & Infrastructure

**Goal**: Establish persistence layer and extend existing optimistic store

- [ ] T001 Create offline queue types in `src/lib/offline/types.ts`
- [ ] T002 [P] Create queue persistence module in `src/lib/offline/persistence/queueStorage.ts`
- [ ] T003 [P] Create queue persistence tests in `src/lib/offline/persistence/queueStorage.test.ts`
- [ ] T004 Extend optimistic store to support persistence in `src/lib/optimistic/store/persistence.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Core queue management that all user stories depend on

- [ ] T005 Create OfflineQueueManager class in `src/lib/offline/queueManager/index.ts`
- [ ] T006 [P] Implement FIFO queue operations (add, peek, remove, clear) in `src/lib/offline/queueManager/operations.ts`
- [ ] T007 [P] Implement queue status tracking (pending/syncing/failed/confirmed) in `src/lib/offline/queueManager/status.ts`
- [ ] T008 Create useOfflineQueue hook in `src/lib/offline/hooks/useOfflineQueue.ts`
- [ ] T009 Wire queue restoration on app startup in `src/providers/OfflineProvider.tsx`

---

## Phase 3: User Story 1 - Complete Habits While Offline (P1)

**Goal**: Users can mark habits complete offline with immediate feedback
**Independent Test**: Enable airplane mode → complete habit → verify chain animation plays instantly → restart app → verify completion persists

- [ ] T010 [US1] Modify useOptimisticToggleMutation to queue operations when offline in `src/lib/optimistic/hooks/useOptimisticToggleMutation.ts`
- [ ] T011 [US1] Add offline detection to toggle flow in `src/features/habits/hooks/useHabitMutations.ts`
- [ ] T012 [P] [US1] Implement local streak calculation for offline completions in `src/lib/offline/calculations/streakCalculator.ts`
- [ ] T013 [P] [US1] Update HabitCard to read from optimistic + offline state in `src/features/habits/components/HabitCard/HabitCard.tsx`
- [ ] T014 [US1] Ensure chain link animation fires for offline completions in `src/features/habits/components/HabitCard/ChainLink.tsx`
- [ ] T015 [US1] Add E2E test for offline habit completion in `e2e/offline-completion.test.ts`

---

## Phase 4: User Story 2 - Automatic Background Sync on Reconnect (P1)

**Goal**: Pending completions auto-sync when connectivity returns
**Independent Test**: Complete habits offline → enable WiFi → verify sync within 30s → check Convex dashboard

- [ ] T016 [US2] Create sync orchestrator in `src/lib/offline/sync/syncOrchestrator.ts`
- [ ] T017 [P] [US2] Implement exponential backoff retry logic in `src/lib/offline/sync/retryStrategy.ts`
- [ ] T018 [P] [US2] Wire NetworkStatusContext to trigger sync on reconnect in `src/contexts/NetworkStatusContext/useNetworkSync.ts`
- [ ] T019 [US2] Process queue items sequentially (FIFO) with error handling in `src/lib/offline/sync/processQueue.ts`
- [ ] T020 [US2] Reconcile local state with server response after sync in `src/lib/offline/sync/reconcile.ts`
- [ ] T021 [US2] Handle orphaned operations (deleted habits) gracefully in `src/lib/offline/sync/cleanupOrphans.ts`
- [ ] T022 [US2] Add E2E test for auto-sync on reconnect in `e2e/offline-sync.test.ts`

---

## Phase 5: User Story 3 - Visual Sync Status Indicators (P2)

**Goal**: Subtle UI indicators for offline state and sync progress
**Independent Test**: Observe UI in airplane mode → see offline indicator → reconnect → see sync progress → see synced confirmation

- [ ] T023 [US3] Create SyncStatusContext in `src/contexts/SyncStatusContext/index.tsx`
- [ ] T024 [P] [US3] Create OfflineIndicator component in `src/components/SyncStatus/OfflineIndicator.tsx`
- [ ] T025 [P] [US3] Create SyncingIndicator component in `src/components/SyncStatus/SyncingIndicator.tsx`
- [ ] T026 [P] [US3] Create PendingSyncBadge for habit cards in `src/components/SyncStatus/PendingSyncBadge.tsx`
- [ ] T027 [US3] Integrate OfflineIndicator into HabitsScreen header in `src/screens/HabitsScreen/HabitsScreen.tsx`
- [ ] T028 [US3] Integrate PendingSyncBadge into HabitCard in `src/features/habits/components/HabitCard/HabitCard.tsx`
- [ ] T029 [US3] Add optional "Synced" toast notification in `src/lib/offline/sync/syncOrchestrator.ts`

---

## Phase 6: User Story 4 - Graceful Conflict Resolution (P3)

**Goal**: Multi-device conflicts resolved automatically, favoring completion
**Independent Test**: Complete same habit on two offline devices → bring both online → verify habit stays completed

- [ ] T030 [US4] Implement last-write-wins conflict resolution in `src/lib/offline/sync/conflictResolver.ts`
- [ ] T031 [US4] Add conflict detection during sync in `src/lib/offline/sync/processQueue.ts`
- [ ] T032 [P] [US4] Create informational conflict notification in `src/components/SyncStatus/ConflictNotification.tsx`
- [ ] T033 [US4] Add E2E test for conflict resolution in `e2e/offline-conflict.test.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Performance optimization, edge cases, and robustness

- [ ] T034 Optimize queue for 500+ operations without UI blocking in `src/lib/offline/queueManager/index.ts`
- [ ] T035 [P] Add transaction safety for queue writes (crash recovery) in `src/lib/offline/persistence/queueStorage.ts`
- [ ] T036 [P] Handle auth expiry during offline period in `src/lib/offline/sync/authHandler.ts`
- [ ] T037 Add performance benchmarks for queue operations in `src/lib/offline/__tests__/performance.test.ts`
- [ ] T038 Update documentation with offline architecture in `docs/offline-habit-sync/architecture.md`

---

## Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ──────────────────────────┐
    ↓                                            │
Phase 3 (US1: Offline Complete) ←────────────────┤
    ↓                                            │
Phase 4 (US2: Auto Sync) ←───────────────────────┤
    ↓                                            │
Phase 5 (US3: Status Indicators) ←───────────────┘
    ↓
Phase 6 (US4: Conflict Resolution)
    ↓
Phase 7 (Polish)
```

**Notes**:

- US1 and US2 are both P1 but US2 depends on US1 being functional
- US3 can be developed in parallel with US1/US2 but integration requires them
- US4 builds on sync infrastructure from US2

---

## Parallel Execution Opportunities

### Within Phase 1:

- T002 (persistence module) ∥ T003 (persistence tests)

### Within Phase 3 (US1):

- T012 (streak calc) ∥ T013 (HabitCard update) ∥ T014 (chain animation)

### Within Phase 4 (US2):

- T017 (retry logic) ∥ T018 (network wiring)

### Within Phase 5 (US3):

- T024 (OfflineIndicator) ∥ T025 (SyncingIndicator) ∥ T026 (PendingSyncBadge)

---

## Implementation Strategy

### MVP (Recommended First Delivery)

Complete Phase 1 + Phase 2 + Phase 3 + Phase 4 (T001-T022)

- **Delivers**: Core offline functionality with auto-sync
- **User Value**: "I can complete habits anywhere, anytime"
- **Excludes**: Visual indicators, conflict resolution (nice-to-haves)

### Incremental Delivery

1. **MVP**: Phases 1-4 (core offline + sync)
2. **Enhancement**: Phase 5 (visual feedback)
3. **Robustness**: Phase 6 (conflict handling)
4. **Hardening**: Phase 7 (performance + edge cases)

---

## Summary

| Metric                 | Count |
| ---------------------- | ----- |
| Total Tasks            | 38    |
| Phase 1 (Setup)        | 4     |
| Phase 2 (Foundational) | 5     |
| Phase 3 (US1)          | 6     |
| Phase 4 (US2)          | 7     |
| Phase 5 (US3)          | 7     |
| Phase 6 (US4)          | 4     |
| Phase 7 (Polish)       | 5     |
| Parallelizable [P]     | 14    |
| E2E Tests              | 4     |
