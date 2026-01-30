# Offline Habit Completion Sync

**Feature Branch**: `001-offline-habit-sync`
**Created**: 2026-01-30
**Status**: Draft

---

## Overview

Enable offline functionality for the ChainDay habit tracking app. Users should be able to mark habits as complete while offline, with changes automatically syncing when connectivity returns.

---

## User Stories

### US1 - Complete Habits While Offline (P1)

As a user who loses internet connectivity (subway, gym, airplane mode), I want to mark my habits as complete and see immediate visual feedback, so that I can maintain my habit tracking routine without interruption.

**Why P1**: Core user journey. Habit completion is a micro-moment (2-3 seconds) that happens multiple times daily, often in low-connectivity environments.

**Test**: Enable airplane mode → complete habit → verify chain animation plays instantly → restart app → verify completion persists

**Acceptance**:

1. **Given** no connectivity, **When** tap to complete, **Then** marked complete with chain animation within 200ms
2. **Given** completed offline, **When** view habits list, **Then** completions displayed with accurate streaks
3. **Given** completed offline, **When** close and reopen app (still offline), **Then** completions preserved

---

### US2 - Automatic Background Sync on Reconnect (P1)

As a user who has completed habits while offline, I want my completions to automatically sync to the server when I regain connectivity.

**Why P1**: Without sync, offline completions are meaningless long-term. Completes the offline-to-online loop.

**Test**: Complete habits offline → enable WiFi → verify sync within 30s → check Convex dashboard

**Acceptance**:

1. **Given** pending completions and connectivity restored, **When** app detects connection, **Then** sync within 30 seconds
2. **Given** sync fails, **When** system retries, **Then** uses exponential backoff
3. **Given** sync succeeds, **When** user checks habits, **Then** server-calculated values (streak, strength) update

---

### US3 - Visual Sync Status Indicators (P2)

As a user, I want subtle visual indicators showing my connectivity status and sync progress.

**Why P2**: Important for confidence but not blocking core functionality.

**Test**: Observe UI in airplane mode → see offline indicator → reconnect → see sync progress → see synced confirmation

**Acceptance**:

1. **Given** no connectivity, **When** viewing habits, **Then** subtle offline indicator visible
2. **Given** pending completions, **When** viewing habit, **Then** subtle "pending" indicator shows
3. **Given** sync completes, **When** done, **Then** pending indicators disappear, brief "Synced" confirmation

---

### US4 - Graceful Conflict Resolution (P3)

As a user who may have completed habits on multiple devices while both were offline, I want the system to resolve conflicts in my favor.

**Why P3**: Edge case but critical for trust.

**Test**: Complete same habit on two offline devices → bring both online → verify habit stays completed

**Acceptance**:

1. **Given** same habit completed on Device A and B offline, **When** both sync, **Then** remains marked complete (completion wins)
2. **Given** conflict occurs, **When** user notified, **Then** informational only, no action required

---

## Requirements

### Functional

| ID     | Requirement                                                                          |
| ------ | ------------------------------------------------------------------------------------ |
| FR-001 | Store habit completions locally when offline                                         |
| FR-002 | Provide immediate visual feedback (under 200ms) on habit completion                  |
| FR-003 | Persist offline queue across app restarts and device reboots                         |
| FR-004 | Automatically detect connectivity changes and trigger sync on reconnect              |
| FR-005 | Process offline queue in chronological order (FIFO)                                  |
| FR-006 | Implement retry logic with exponential backoff                                       |
| FR-007 | Update local streak/completion counts immediately (optimistic)                       |
| FR-008 | Reconcile local calculations with server-authoritative values after sync             |
| FR-009 | Display subtle, non-blocking indicators for offline status and pending sync          |
| FR-010 | Resolve conflicts by preserving completions (favor "completed" over "not completed") |
| FR-011 | Handle queue sizes of at least 500 operations without performance degradation        |
| FR-012 | Never block main UI thread during sync                                               |

### Non-Functional

| ID      | Requirement                                                          |
| ------- | -------------------------------------------------------------------- |
| NFR-001 | Queue persistence survives app termination and device restart        |
| NFR-002 | Sync completes within 30 seconds of connectivity (queues < 50 items) |
| NFR-003 | Battery impact negligible (no continuous polling when offline)       |

### Key Entities

| Entity             | Description                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Offline Operation  | Single queued mutation: operation ID, habit ID, date, timestamp, type, retry count, status |
| Sync Queue         | Persistent FIFO collection of offline operations with status tracking                      |
| Connectivity State | Network availability boolean + connection type metadata                                    |

---

## Success Criteria

| ID     | Criterion                                                                |
| ------ | ------------------------------------------------------------------------ |
| SC-001 | Habit completion with feedback in under 200ms regardless of connectivity |
| SC-002 | 100% sync success within 60 seconds of connectivity (queues < 50 items)  |
| SC-003 | Zero data loss through restarts, reboots, and updates                    |
| SC-004 | Sync indicator transitions within 2 seconds of state change              |
| SC-005 | No user confusion about save status (reduced support tickets)            |
| SC-006 | App launch time increase ≤100ms when loading offline queue               |

---

## Scope

### In Scope (MVP)

- Habit completion toggling while offline
- Automatic sync on reconnect
- Queue persistence across app restarts
- Basic sync status indicators
- Conflict resolution (completion wins)

### Out of Scope

- Offline habit creation/editing
- Offline template browsing
- Offline settings changes
- Manual sync trigger
- Detailed sync history/audit log

---

## Edge Cases

- **100+ offline completions**: Batch processing without UI blocking
- **Deleted habit on server**: Orphaned completions discarded gracefully
- **App crash during queue write**: Transaction-safe to prevent corruption
- **Auth expiry while offline**: Store locally, prompt re-auth on sync

---

## Assumptions

- Users authenticated before going offline (no offline login)
- Existing `src/lib/optimistic/` infrastructure is stable
- Existing NetworkStatusContext accurately detects connectivity
- AsyncStorage has sufficient capacity (~6MB+)
- Convex mutations are idempotent for safe retry

---

## Tasks

### Phase 1: Setup & Infrastructure

- [ ] T001 Create offline queue types in `src/lib/offline/types.ts`
- [ ] T002 [P] Create queue persistence module in `src/lib/offline/persistence/queueStorage.ts`
- [ ] T003 [P] Create queue persistence tests in `src/lib/offline/persistence/queueStorage.test.ts`
- [ ] T004 Extend optimistic store persistence in `src/lib/optimistic/store/persistence.ts`

### Phase 2: Foundational

- [ ] T005 Create OfflineQueueManager in `src/lib/offline/queueManager/index.ts`
- [ ] T006 [P] Implement FIFO operations in `src/lib/offline/queueManager/operations.ts`
- [ ] T007 [P] Implement status tracking in `src/lib/offline/queueManager/status.ts`
- [ ] T008 Create useOfflineQueue hook in `src/lib/offline/hooks/useOfflineQueue.ts`
- [ ] T009 Wire queue restoration in `src/providers/OfflineProvider.tsx`

### Phase 3: US1 - Offline Completion

- [ ] T010 [US1] Modify useOptimisticToggleMutation for offline queueing in `src/lib/optimistic/hooks/useOptimisticToggleMutation.ts`
- [ ] T011 [US1] Add offline detection in `src/features/habits/hooks/useHabitMutations.ts`
- [ ] T012 [P] [US1] Local streak calculation in `src/lib/offline/calculations/streakCalculator.ts`
- [ ] T013 [P] [US1] Update HabitCard for optimistic+offline state in `src/features/habits/components/HabitCard/HabitCard.tsx`
- [ ] T014 [US1] Chain animation for offline completions in `src/features/habits/components/HabitCard/ChainLink.tsx`
- [ ] T015 [US1] E2E test in `e2e/offline-completion.test.ts`

### Phase 4: US2 - Auto Sync

- [ ] T016 [US2] Sync orchestrator in `src/lib/offline/sync/syncOrchestrator.ts`
- [ ] T017 [P] [US2] Exponential backoff in `src/lib/offline/sync/retryStrategy.ts`
- [ ] T018 [P] [US2] Wire NetworkStatusContext in `src/contexts/NetworkStatusContext/useNetworkSync.ts`
- [ ] T019 [US2] FIFO queue processing in `src/lib/offline/sync/processQueue.ts`
- [ ] T020 [US2] State reconciliation in `src/lib/offline/sync/reconcile.ts`
- [ ] T021 [US2] Orphan cleanup in `src/lib/offline/sync/cleanupOrphans.ts`
- [ ] T022 [US2] E2E test in `e2e/offline-sync.test.ts`

### Phase 5: US3 - Status Indicators

- [ ] T023 [US3] SyncStatusContext in `src/contexts/SyncStatusContext/index.tsx`
- [ ] T024 [P] [US3] OfflineIndicator in `src/components/SyncStatus/OfflineIndicator.tsx`
- [ ] T025 [P] [US3] SyncingIndicator in `src/components/SyncStatus/SyncingIndicator.tsx`
- [ ] T026 [P] [US3] PendingSyncBadge in `src/components/SyncStatus/PendingSyncBadge.tsx`
- [ ] T027 [US3] Integrate OfflineIndicator in `src/screens/HabitsScreen/HabitsScreen.tsx`
- [ ] T028 [US3] Integrate PendingSyncBadge in `src/features/habits/components/HabitCard/HabitCard.tsx`
- [ ] T029 [US3] "Synced" toast in `src/lib/offline/sync/syncOrchestrator.ts`

### Phase 6: US4 - Conflict Resolution

- [ ] T030 [US4] Last-write-wins resolver in `src/lib/offline/sync/conflictResolver.ts`
- [ ] T031 [US4] Conflict detection in `src/lib/offline/sync/processQueue.ts`
- [ ] T032 [P] [US4] ConflictNotification in `src/components/SyncStatus/ConflictNotification.tsx`
- [ ] T033 [US4] E2E test in `e2e/offline-conflict.test.ts`

### Phase 7: Polish

- [ ] T034 Optimize for 500+ operations in `src/lib/offline/queueManager/index.ts`
- [ ] T035 [P] Transaction safety in `src/lib/offline/persistence/queueStorage.ts`
- [ ] T036 [P] Auth expiry handling in `src/lib/offline/sync/authHandler.ts`
- [ ] T037 Performance benchmarks in `src/lib/offline/__tests__/performance.test.ts`
- [ ] T038 Architecture docs in `docs/offline-habit-sync/architecture.md`

---

## Dependencies

```
Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7
                         ↑              ↑              ↑
                         └──────────────┴──────────────┘ (Phase 2 feeds all)
```

---

## Implementation Strategy

**MVP (Phases 1-4)**: 22 tasks delivering core offline + sync
**Enhancement (Phase 5)**: Visual feedback
**Robustness (Phase 6)**: Conflict handling
**Hardening (Phase 7)**: Performance + edge cases

---

## Summary

| Metric             | Count |
| ------------------ | ----- |
| Total Tasks        | 38    |
| MVP Tasks          | 22    |
| Parallelizable [P] | 14    |
| E2E Tests          | 4     |
