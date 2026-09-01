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

- [x] T001 Create offline queue types in `src/lib/offline/queue/`
  - Created decomposed module: `types.ts`, `state.ts`, `events.ts`, `connectivity.ts`, `index.ts`
  - All types re-exported via `src/lib/offline/index.ts`
- [x] T002 [P] Create queue persistence module in `src/lib/offline/persistence/queueStorage.ts`
  - Created `queueStorage.ts` with AsyncStorage-based persistence
  - Functions: `saveQueueState()`, `loadQueueState()`, `clearQueueState()`
  - Includes type validation and schema migration support (v1)
  - Exports via `src/lib/offline/persistence/index.ts` and main `src/lib/offline/index.ts`
- [x] T003 [P] Create queue persistence tests in `src/lib/offline/persistence/queueStorage.test.ts`
  - Created 25 comprehensive tests covering save, load, clear operations
  - Tests cover: JSON serialization, validation, migration, error handling, round-trip persistence
  - Edge cases tested: invalid JSON, missing fields, null values, large operations arrays
- [x] T004 Extend optimistic store persistence in `src/lib/optimistic/store/persistence.ts`
  - Created `persistence.ts` with AsyncStorage-based persistence for OptimisticStore
  - Functions: `saveOptimisticStore()`, `loadOptimisticStore()`, `clearOptimisticStore()`
  - Handles Map-to-array serialization for JSON compatibility
  - Includes type validation, version-based migration support (v1)
  - Created 28 comprehensive tests in `persistence.test.ts`

### Phase 2: Foundational

- [x] T005 Create OfflineQueueManager in `src/lib/offline/queueManager/index.ts`
  - Created decomposed module: `index.ts`, `types.ts`, `helpers.ts`, `operations.ts`, `enqueue.ts`, `status.ts`, `statusHelpers.ts`
  - Implemented: `createOfflineQueueManager()`, `getOfflineQueueManager()`, `resetOfflineQueueManager()`
  - API includes: `getState()`, `getStats()`, `enqueue()`, `peek()`, `dequeue()`, `remove()`, `clear()`
  - Status methods: `markSyncing()`, `markCompleted()`, `markFailed()`, `markPending()`
  - Persistence: `restore()`, `persist()` with auto-persist option
  - Event subscription: `subscribe()` for queue events
  - Created 35 comprehensive tests in `queueManager.test.ts`
- [x] T006 [P] Implement FIFO operations in `src/lib/offline/queueManager/operations.ts`
  - Implemented as part of T005
  - FIFO operations: `peek()`, `dequeue()`, `remove()`, `clear()`
  - Enqueue with deduplication (same habit+date replaces existing)
- [x] T007 [P] Implement status tracking in `src/lib/offline/queueManager/status.ts`
  - Implemented as part of T005
  - Status transitions: pending → syncing → completed/failed
  - Completed operations removed from queue automatically
- [x] T008 Create useOfflineQueue hook in `src/lib/offline/hooks/useOfflineQueue.ts`
  - Created decomposed module: `hooks/useOfflineQueue.ts`, `hooks/types.ts`, `hooks/index.ts`
  - Hook provides: `operations`, `stats`, `hasPendingOperations`, `isEmpty`, `enqueue`, `markCompleted`, `markFailed`, `clear`, `subscribe`
  - Uses `useSyncExternalStore` for efficient React integration
  - Added `subscribeToState()` method to OfflineQueueManager for useSyncExternalStore compatibility
  - Created 25 comprehensive tests in `hooks/useOfflineQueue.test.ts`
  - Exports via `src/lib/offline/index.ts`
- [x] T009 Wire queue restoration in `src/providers/OfflineProvider.tsx`
  - Created decomposed module: `types.ts`, `OfflineProvider.tsx`, `useOfflineContext.ts`, `index.ts`
  - Auto-restores offline queue from AsyncStorage on mount
  - Uses ref-based guard to prevent concurrent restoration calls
  - Provides context for restoration state: `isRestored`, `isRestoring`, `restorationError`, `restoreQueue`
  - Implements FR-003 (persist across restarts), SC-003 (zero data loss), SC-006 (≤100ms launch impact)
  - Created 12 comprehensive tests covering auto-restore, error handling, concurrent call prevention

### Phase 3: US1 - Offline Completion

- [x] T010 [US1] Modify useOptimisticToggleMutation for offline queueing in `src/lib/optimistic/hooks/useOptimisticToggleMutation.ts`
  - Added optional `isOnline` parameter via `OptimisticToggleOptions`
  - When offline: queues operation immediately via OfflineQueueManager
  - When online but network error occurs: queues operation for retry
  - Returns `ToggleMutationResult` with `queued` status and optional `offlineOperationId`
  - Decomposed into separate files following codebase pattern: `useOptimisticToggleMutation.ts`, `useOptimisticArchiveMutation.ts`
  - Added 6 new tests for offline queue integration (22 total tests in suite)
- [x] T011 [US1] Add offline detection in `src/features/habits/hooks/useHabitMutations.ts`
  - Added `useIsOnline` hook from NetworkStatusContext to `useHabitMutations`
  - Updated `useHabitsListState` to pass `isOnline` option to `useOptimisticToggleMutation`
  - Updated `useHabitsModalsState` to use optimistic toggle with offline queue support
  - Updated type signatures in `habitsListState.types.ts` and `habitsModalsState.types.ts`
  - Created 20 code verification tests in `useHabitMutations.offlineDetection.test.ts`
- [x] T012 [P] [US1] Local streak calculation in `src/lib/offline/calculations/streakCalculator.ts`
  - Created decomposed module: `types.ts`, `dateHelpers.ts`, `streakCalculator.ts`, `index.ts`
  - Functions: `calculateStreakFromHistory()`, `calculateOfflineStreak()`, `calculateBestStreakFromDates()`, `computeCurrentStreakFromDates()`
  - Helper: `mergeTrackingWithPending()` combines server tracking with offline queue operations
  - Date utilities: `differenceInDays()`, `parseDate()`, `formatDate()`, `getTodayDateKey()`, `isValidDateFormat()`
  - Mirrors server-side logic from `convex/streakUtils/historyCalculation.ts` for parity
  - Implements FR-007 (optimistic local streak updates) and SC-001 (<200ms feedback)
  - Created 38 comprehensive tests in `streakCalculator.test.ts`
  - Exports via `src/lib/offline/index.ts`
- [x] T013 [P] [US1] Update HabitCard for optimistic+offline state in `src/features/habits/components/HabitCard/HabitCard.tsx`
  - Created decomposed module: `hooks/types.ts`, `hooks/useOfflineHabitState.ts`, `hooks/useHabitCardState.ts`, `hooks/index.ts`
  - `useOfflineHabitState`: Merges server state with pending offline operations for accurate completion/streak display
  - `useHabitCardState`: Orchestrates completion and streak state, integrating Convex queries with offline queue
  - Added `offlineSyncEnabled` and `serverTracking` props to `HabitCard.types.ts`
  - Updated `useHabitCard.ts` to use the new hooks, returning `currentStreak`, `bestStreak`, and `hasPendingOfflineOps`
  - Implements FR-007 (optimistic local streak updates) via offline-aware state calculation
  - Created 20 comprehensive tests in `hooks/__tests__/useOfflineHabitState.test.ts`
- [x] T014 [US1] Chain animation for offline completions in `src/components/HabitCard/components/ChainLinkAnimation.tsx`
  - Created `ChainLinkAnimation.tsx` component with Reanimated animated styles
  - Updated `StatusIndicator.tsx` to support chain link display via `completionIcon` prop
  - Added `completionIcon`, `chainScale`, `chainRotate`, `hasPendingOfflineOps` props to `HabitCardContent`
  - Extended `useHabitCardAnimations` to expose `chainScale` and `chainRotate` (aliases to existing checkmark values)
  - Added `CompletionIconType` to `HabitCard.types.ts` with 'chain' | 'checkbox' options
  - Updated jest.setup.js with `Extrapolation` and `Extrapolate` constants for tests
  - Created 12 comprehensive tests in `components/__tests__/ChainLinkAnimation.test.tsx`
  - Implements FR-002 (visual feedback <200ms), SC-001 (instant completion feedback)
- [x] T015 [US1] E2E test in `e2e/offline-completion.test.ts`
  - Created comprehensive E2E/integration test suite in `tests/e2e/offline-completion.e2e.test.ts`
  - Tests cover all US1 acceptance criteria:
    - Immediate feedback (<200ms) verification with performance timing
    - Queue persistence with AsyncStorage (save, restore, corrupted data handling)
    - Accurate streak calculation with pending offline operations
  - Additional coverage for FIFO processing (FR-005), 500+ ops performance (FR-011)
  - Tests optimistic + offline queue integration, rapid toggle sequences, multi-habit handling
  - 23 comprehensive tests passing, all edge cases covered

### Phase 4: US2 - Auto Sync

- [x] T016 [US2] Sync orchestrator in `src/lib/offline/sync/syncOrchestrator.ts`
  - Created decomposed module: `types.ts`, `helpers.ts`, `syncOrchestrator.ts`, `singleton.ts`, `useSyncOrchestrator.ts`, `index.ts`
  - `SyncOrchestrator` class: Coordinates queue processing with network detection and auto-sync on reconnect
  - Features: configurable batch size (default 50), debounced sync scheduling, FIFO processing, event emission
  - `useSyncOrchestrator` hook: React integration with NetworkStatusContext and Convex mutations
  - Auto-registers online callback via `onOnline()` to trigger sync when connectivity restored
  - Implements FR-004 (auto-detect connectivity, trigger sync), FR-005 (FIFO processing)
  - Implements NFR-002 (sync within 30 seconds for queues <50 items)
  - Created 38 comprehensive tests in `__tests__/helpers.test.ts` and `__tests__/syncOrchestrator.test.ts`
  - Exports via `src/lib/offline/index.ts`
- [x] T017 [P] [US2] Exponential backoff in `src/lib/offline/sync/retryStrategy.ts`
  - Created `retryStrategy.ts` with sync-specific exponential backoff configuration
  - Three preset strategies: `SYNC_RETRY_STRATEGY` (default), `FAST_SYNC_RETRY_STRATEGY` (network recovery), `RATE_LIMITED_RETRY_STRATEGY` (429 errors)
  - Functions: `calculateSyncRetryDelay()`, `selectSyncRetryStrategy()`, `shouldRetrySyncOperation()`, `createSyncRetryContext()`, `updateSyncRetryContext()`, `getTimeUntilSyncRetry()`
  - Default: 2s base delay, 2x multiplier, 5 max retries, 30s max delay, 20% jitter
  - Auto-selects appropriate strategy based on error category (network, timeout, rateLimit, server)
  - Implements FR-006 (exponential backoff retry logic)
  - Created 42 comprehensive tests in `__tests__/retryStrategy.test.ts`
  - Exports via `src/lib/offline/sync/index.ts`
- [x] T018 [P] [US2] Wire network state to the sync orchestrator
  - `SyncStatusProvider` is the single React bridge for reconnect sync, status, callbacks, and manual retry.
  - The duplicate network bridge and its tests were removed after the provider absorbed that behavior.
- [x] T019 [US2] FIFO queue processing in `src/lib/offline/sync/processQueue.ts`
  - Created decomposed module: `processQueue/types.ts`, `processQueue/processSingleOperation.ts`, `processQueue/processQueue.ts`, `processQueue/index.ts`
  - `processQueue()`: Processes pending operations in FIFO order (oldest first) with configurable batch size
  - `processQueueUntilEmpty()`: Iteratively processes batches until queue empty or max iterations reached
  - `processSingleOperation()`: Handles individual operation sync with status updates and callbacks
  - Helper functions: `operationToSyncItem()`, `shouldSkipOperation()` (circuit breaker check)
  - Features: progress callbacks, stop-on-first-failure option, duration tracking, aggregated results
  - Implements FR-005 (FIFO processing order) and FR-012 (non-blocking UI)
  - Created 29 comprehensive tests in `__tests__/processQueue.test.ts`
  - Exports via `src/lib/offline/sync/index.ts`
- [x] T020 [US2] State reconciliation in `src/lib/offline/sync/reconcile.ts`
  - Created decomposed module: `reconcile/types.ts`, `reconcile/helpers.ts`, `reconcile/reconciler.ts`, `reconcile/singleton.ts`, `reconcile/useReconciliation.ts`, `reconcile/index.ts`
  - `StateReconciler` class: Tracks synced habits, emits reconciliation events, manages sync timestamps
  - Helper functions: `extractSyncedHabits()`, `updateHabitSyncTimestamps()`, `wasHabitSyncedAfter()`, `buildReconciliationResult()`
  - `useReconciliation` hook: React integration with callbacks for `onReconciled` and `onHabitSynced` events
  - Features: scheduled reconciliation with configurable delay, per-habit sync timestamp tracking, event-driven architecture
  - Implements FR-008 (reconcile local calculations with server-authoritative values after sync)
  - Created 57 comprehensive tests in `__tests__/helpers.test.ts`, `__tests__/reconciler.test.ts`, `__tests__/singleton.test.ts`
  - Exports via `src/lib/offline/sync/index.ts`
- [x] T021 [US2] Orphan cleanup in `src/lib/offline/sync/cleanupOrphans.ts`
  - Created decomposed module: `cleanupOrphans/types.ts`, `cleanupOrphans/helpers.ts`, `cleanupOrphans/cleanupOrphans.ts`, `cleanupOrphans/index.ts`
  - `cleanupOrphans()`: Main function to identify and remove operations referencing deleted habits
  - `createOrphanCleaner()`: Factory for creating reusable cleanup function with pre-configured dependencies
  - Helper functions: `extractUniqueHabitIds()`, `groupOperationsByHabit()`, `findDeletedHabitIds()`, `identifyOrphans()`
  - Features: batch processing (default 100 ops), event emission, callbacks for found/removed orphans, fail-safe error handling
  - Fail-safe: On habitat existence check failure, assumes habit exists (avoids accidental deletion)
  - Implements Edge Case: "Deleted habit on server: Orphaned completions discarded gracefully"
  - Created 36 comprehensive tests in `__tests__/helpers.test.ts`, `__tests__/cleanupOrphans.test.ts`
  - Exports via `src/lib/offline/sync/index.ts`
- [x] T022 [US2] E2E test in `e2e/offline-sync.test.ts`
  - Created comprehensive E2E/integration test suite in `tests/e2e/offline-sync.e2e.test.ts`
  - Tests cover all US2 acceptance criteria:
    - Auto-sync on reconnect (scheduling, debounce, FIFO processing)
    - Exponential backoff retry (strategies, jitter, context tracking, max retries)
    - Server-authoritative reconciliation (sync timestamps, events, reset)
  - Additional coverage: SyncOrchestrator event lifecycle, state management, batch processing
  - Orphan cleanup tests: identify orphans, fail-safe behavior, event emission
  - Integration tests: complete offline-to-online flow, rapid reconnects, persistence
  - Performance tests: 500+ operations (FR-011), non-blocking async
  - Edge cases: empty queue, concurrent calls, multi-date operations
  - 42 comprehensive tests passing

### Phase 5: US3 - Status Indicators

- [x] T023 [US3] SyncStatusContext in `src/contexts/SyncStatusContext/index.tsx`
  - Created decomposed module: `types.ts`, `context.ts`, `defaults.ts`, `SyncStatusProvider.tsx`, `hooks.ts`, `index.ts`
  - `SyncStatusProvider`: Bridges SyncOrchestrator with React, provides sync state to component tree
  - Types: `SyncStatus`, `SyncStatusIndicator` (idle/syncing/success/error), `SyncStatusContextValue`
  - Hooks: `useSyncStatus`, `useSyncStatusState`, `useIsSyncing`, `useHasPendingSync`, `useSyncIndicator`
  - Callback hooks: `useOnSyncStart`, `useOnSyncComplete`, `useOnSyncError` for event registration
  - Implements FR-009 (non-blocking indicators) foundation for UI components
  - Created 26 comprehensive tests in `__tests__/SyncStatusContext.test.tsx`
- [x] T024 [P] [US3] OfflineIndicator in `src/components/SyncStatus/OfflineIndicator.tsx`
  - Created decomposed module: `types.ts`, `styles.ts`, `useOfflineIndicator.ts`, `OfflineIndicator.tsx`, `index.ts`
  - Subtle pill-style indicator with WifiOff icon and "Offline" text
  - Animated fade/slide transitions using Reanimated (200ms duration)
  - Full accessibility: `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, descriptive label
  - Implements FR-009 (subtle, non-blocking indicators) and US3 acceptance criteria 1
  - Created 13 comprehensive tests in `__tests__/OfflineIndicator.test.tsx`
  - Exports via `src/components/SyncStatus/index.ts`
- [x] T025 [P] [US3] SyncingIndicator in `src/components/SyncStatus/SyncingIndicator.tsx`
  - Created decomposed module: `types.ts`, `styles.ts`, `useSyncingIndicator.ts`, `SyncingIndicator.tsx`, `index.ts`
  - Subtle pill-style indicator with RefreshCw spinning icon and "Syncing" text
  - Optional `pendingCount` prop displays count badge when > 0
  - Animated fade/slide transitions (200ms) + continuous rotation animation (1000ms)
  - Full accessibility: dynamic label ("Syncing N changes"), `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`
  - Uses amber color scheme to distinguish from offline (stone) indicator
  - Implements FR-009 (subtle, non-blocking indicators) and US3 acceptance criteria 2
  - Created 22 comprehensive tests in `__tests__/SyncingIndicator.test.tsx`
  - Exports via `src/components/SyncStatus/index.ts`
- [x] T026 [P] [US3] PendingSyncBadge in `src/components/SyncStatus/PendingSyncBadge.tsx`
  - Created decomposed module: `types.ts`, `styles.ts`, `usePendingSyncBadge.ts`, `PendingSyncBadge.tsx`, `index.ts`
  - Small badge indicator with Cloud icon showing habit has pending sync operations
  - Two size variants: 'small' (default, 14px) and 'medium' (18px) for different card layouts
  - Animated scale/fade transitions (150ms) using Reanimated
  - Full accessibility: `accessibilityRole="img"`, hint explaining pending state
  - Uses soft amber color scheme (amber-100 background, amber-300 border, amber-600 icon)
  - Implements FR-009 (subtle, non-blocking indicators) and US3 acceptance criteria 2
  - Created 22 comprehensive tests in `__tests__/PendingSyncBadge.test.tsx`
  - Exports via `src/components/SyncStatus/index.ts`
- [x] T027 [US3] Integrate OfflineIndicator in `src/features/habits/components/HabitsList/HabitsListHeader.tsx`
  - Created `useHabitsListHeaderComputed.ts` hook to extract computed values (keeps component under 100-line limit)
  - Hook handles: offline detection via `useIsOnline()`, completion statistics (memoized), timeline visibility
  - `OfflineIndicator` positioned at top-center using absolute positioning with z-10
  - Full test coverage: 22 code verification tests in `__tests__/HabitsListHeader.offlineIndicator.test.ts`
  - Implements US3 acceptance criteria 1: "Given no connectivity, When viewing habits, Then subtle offline indicator visible"
- [x] T028 [US3] Integrate PendingSyncBadge in `src/components/HabitCard/components/HabitCardContent.tsx`
  - Imported `PendingSyncBadge` from `../../SyncStatus` into `HabitCardContent.tsx`
  - Added badge to `statusContainer` area, positioned before `StatusIndicator`
  - Badge visibility controlled by existing `hasPendingOfflineOps` prop (flows from useHabitCard → HabitCardContent)
  - Badge uses 'small' size variant for subtle, non-intrusive display
  - Full test coverage: 15 comprehensive tests in `__tests__/HabitCardContent.pendingSyncBadge.test.tsx`
  - Implements US3 acceptance criteria 2: "Given pending completions, When viewing habit, Then subtle 'pending' indicator shows"
  - Implements FR-009: Display subtle, non-blocking indicators for pending sync
- [x] T029 [US3] "Synced" toast in `src/components/SyncStatus/SyncedToast/`
  - Created decomposed module: `types.ts`, `styles.ts`, `useSyncedToastAnimations.ts`, `useSyncedToast.ts`, `SyncedToast.tsx`, `index.ts`
  - `SyncedToast`: Brief, auto-dismissing toast with green success theme showing "Synced" confirmation
  - `useSyncedToast`: Hook that bridges SyncStatusContext with toast, listens for sync completion events
  - Animated fade/slide transitions (200ms in, 300ms out) with configurable display duration (default 2s)
  - Optional `syncedCount` prop displays count of synced operations
  - Full accessibility: `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, dynamic label
  - Implements US3 acceptance criteria 3: "Given sync completes, When done, Then pending indicators disappear, brief 'Synced' confirmation"
  - Implements FR-009: Display subtle, non-blocking indicators for sync status
  - Created 41 comprehensive tests in `__tests__/SyncedToast.test.tsx` and `__tests__/useSyncedToast.test.tsx`
  - Exports via `src/components/SyncStatus/index.ts`

### Phase 6: US4 - Conflict Resolution

- [x] T030 [US4] Last-write-wins resolver in `src/lib/offline/sync/conflictResolver.ts`
  - Created decomposed module: `types.ts`, `helpers.ts`, `conflictResolver.ts`, `index.ts`
  - `resolveOperation()`: Resolves single operation against server state with completion-wins strategy
  - `resolveOperations()`: Resolves multiple operations using individual server checks
  - `resolveOperationsBatch()`: Resolves multiple operations using batch server state checker for efficiency
  - Helper functions: `detectConflict()`, `resolveConflict()`, `createHabitDateKey()`, `parseHabitDateKey()`
  - Core resolution logic: SKIP if desired state exists on server, SYNC otherwise (FR-010)
  - Fail-safe behavior: On server check error or timeout, proceed with sync
  - Event emission for conflict monitoring: `conflict:detected`, `conflict:skip_sync`, `conflict:error`
  - Implements US4 (Graceful Conflict Resolution) and FR-010 (completion wins strategy)
  - Created 46 comprehensive tests in `__tests__/helpers.test.ts` and `__tests__/conflictResolver.test.ts`
  - Exports via `src/lib/offline/sync/index.ts`
- [x] T031 [US4] Conflict detection in `src/lib/offline/sync/processQueue.ts`
  - Updated `ProcessOperationResult` type with `conflictResolution` and `skippedDueToConflict` fields
  - Updated `ProcessQueueResult` type with `conflictSkipped` count for aggregated tracking
  - Updated `ProcessQueueConfig` with `conflictConfig`, `onConflict`, and `onConflictSkip` callbacks
  - Updated `QueueProcessorDeps` with optional `serverStateChecker` for conflict detection
  - Integrated `resolveOperation()` from conflictResolver into `processSingleOperation()`
  - Operations matching server state are skipped (marked completed without redundant sync)
  - Fail-safe: On server check error, proceeds with sync to avoid blocking
  - Implements US4 (Graceful Conflict Resolution) integration into queue processing pipeline
  - Created 26 comprehensive tests in `__tests__/processSingleOperation.conflict.test.ts` and `__tests__/processQueue.conflict.test.ts`
- [x] T032 [P] [US4] ConflictNotification in `src/components/SyncStatus/ConflictNotification.tsx`
  - Created decomposed module: `types.ts`, `styles.ts`, `useConflictNotificationAnimations.ts`, `useConflictNotification.ts`, `ConflictNotification.tsx`, `index.ts`
  - `ConflictNotification`: Brief, auto-dismissing toast with amber theme showing "Conflict resolved" message
  - `useConflictNotification`: Hook for managing notification visibility and conflict count
  - Animated fade/slide transitions (200ms in, 300ms out) with configurable display duration (default 3s)
  - Uses GitMerge icon to visually indicate merge/resolution concept
  - Optional `conflictCount` prop displays count of resolved conflicts
  - Full accessibility: `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, dynamic label
  - Uses amber color scheme (amber-50 bg, amber-300 border, amber-600 icon) for informational warning
  - Implements US4 acceptance criteria 2: "Given conflict occurs, When user notified, Then informational only, no action required"
  - Implements FR-009: Display subtle, non-blocking indicators for sync status
  - Created 38 comprehensive tests in `__tests__/ConflictNotification.test.tsx` and `__tests__/useConflictNotification.test.tsx`
  - Exports via `src/components/SyncStatus/index.ts`
- [x] T033 [US4] E2E test in `e2e/offline-conflict.test.ts`
  - Created comprehensive E2E/integration test suite in `tests/e2e/offline-conflict.e2e.test.ts`
  - Tests cover all US4 acceptance criteria:
    - AC1: Multi-device completion scenarios (completion wins strategy FR-010)
    - AC2: Informational-only conflict notifications (no user action required)
  - Core tests: conflict resolution for complete/uncomplete operations, three-device scenarios, mixed states
  - Configuration tests: default config validation, server check disable, timeout handling
  - Batch resolution tests: individual checker, batch checker, missing state handling, error recovery
  - Queue integration tests: conflict detection in processQueue, onConflict/onConflictSkip callbacks
  - Real-world scenarios: Device A online + B offline, stale completions, partial sync, rapid toggles
  - Fail-safe behavior: unreachable server, null responses, intermittent network issues
  - Performance tests: 100+ operations efficiently, batch vs individual checker comparison
  - Edge cases: empty array, duplicate habit+date, metadata preservation
  - 34 comprehensive tests passing

### Phase 7: Polish

- [x] T034 Optimize for 500+ operations in `src/lib/offline/queueManager/index.ts`
  - Created `optimized.ts` module with Map-based indexing for O(1) lookups
  - Helper functions: `buildOperationIndex()`, `findOperationIndexOptimized()`, `hasDuplicateOptimized()`
  - Batch operations: `markCompletedBatch()`, `markFailedBatch()`, `markSyncingBatch()`, `peekBatch()`, `removeBatch()`
  - Extended `QueueEvent` type with batch event types: `queue:batch_completed`, `queue:batch_failed`, `queue:batch_syncing`, `queue:batch_removed`
  - Created 23 comprehensive tests in `__tests__/optimized.test.ts` covering performance benchmarks
  - Performance verified: 500 ops enqueue <2ms avg, batch complete 500 ops <50ms, peekBatch <5ms
  - Implements FR-011 (handle 500+ operations without performance degradation)
- [x] T035 [P] Transaction safety in `src/lib/offline/persistence/queueStorage.ts`
  - Created decomposed module: `transactionSafety.ts`, `transactionWrite.ts`, `queueStorageHelpers.ts`
  - `transactionSafeWrite()`: Two-phase commit pattern (pending key → main key → cleanup)
  - `recoverTransaction()`: Recovers valid pending writes on app startup
  - `calculateChecksum()`/`verifyChecksum()`: Integrity verification for stored data
  - `createEnvelope()`: Wraps data with checksum, timestamp, and version metadata
  - `saveQueueState()` now uses transaction-safe writes; added `saveQueueStateUnsafe()` for non-critical paths
  - `loadQueueState()` checks for pending recovery before normal load
  - `clearQueueState()` cleans up transaction artifacts (pending/backup keys)
  - Implements Edge Case: "App crash during queue write: Transaction-safe to prevent corruption"
  - Created 84 comprehensive tests across 4 test files
- [x] T036 [P] Auth expiry handling in `src/lib/offline/sync/authHandler.ts`
  - Created decomposed module: `types.ts`, `helpers.ts`, `authHandler.ts`, `singleton.ts`, `useAuthHandler.ts`, `useAuthHandler.types.ts`, `index.ts`
  - `createAuthHandler()`: Factory for creating auth handler with configurable deps and config
  - `AuthHandlerAPI`: Methods for `handleAuthError()`, `attemptRefresh()`, `notifyAuthRestored()`, `recordBlockedOperation()`
  - Helper functions: `isAuthError()`, `isTokenExpiredError()`, `requiresUserAction()`, `getSuggestedAction()`, `shouldPauseSync()`
  - `useAuthHandler`: React hook that integrates with Clerk's `useAuth()` for automatic token refresh
  - Event types: `auth:expired`, `auth:refreshed`, `auth:refresh_failed`, `auth:required`, `auth:restored`
  - Features: auto-pause sync on auth error, auto-resume on re-auth, configurable max failures, notification delay
  - Implements Edge Case: "Auth expiry while offline: Store locally, prompt re-auth on sync"
  - Created 67 comprehensive tests in `__tests__/helpers.test.ts`, `__tests__/authHandler.test.ts`, `__tests__/singleton.test.ts`
  - Exports via `src/lib/offline/sync/exports/functions.ts` and `src/lib/offline/sync/exports/types.ts`
- [x] T037 Performance benchmarks in `src/lib/offline/__tests__/performance.test.ts`
  - Created comprehensive benchmark suite validating FR-011 (500+ operations) and SC-001 (<200ms feedback)
  - Queue Manager benchmarks: enqueue (100/500/1000 ops), batch operations (markCompleted/Failed/Syncing/Remove)
  - Index building benchmarks: 500/1000/5000 operations with timing assertions
  - Streak calculation benchmarks: mergeTrackingWithPending, calculateStreakFromHistory, calculateOfflineStreak
  - Persistence benchmarks: saveQueueState and loadQueueState with various queue sizes (SC-006)
  - Combined workflow benchmarks: complete habit + calculate streak, rapid toggle sequences
  - Sync workflow benchmarks: batch processing with mixed success/failure results
  - Memory/stress tests: 2000 operations, FIFO ordering under stress, index rebuild efficiency
  - Summary benchmarks: explicit validation of FR-011 and SC-001 requirements with console output
  - 40 comprehensive tests covering all performance-critical paths
- [x] T038 Architecture docs in `docs/offline-habit-sync/architecture.md`
  - Created comprehensive architecture document covering all offline sync subsystems
  - Documented: directory structure, core data flow (enqueue → sync → reconcile), key types
  - Detailed subsystem descriptions: Queue Manager, Persistence Layer, Sync Orchestrator, Conflict Resolution
  - Included: error classification, retry strategy, circuit breaker, React integration
  - Added data flow diagram, design decisions, requirements mapping, performance characteristics
  - Documented edge case handling and future considerations

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
