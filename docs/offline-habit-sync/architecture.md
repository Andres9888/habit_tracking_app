---
type: architecture
title: Offline Habit Sync Architecture
created: 2026-01-31
tags:
  - offline-sync
  - architecture
  - habit-tracking
  - queue-management
related:
  - '[[offline-habit-sync]]'
---

# Offline Habit Sync Architecture

This document describes the architecture of the offline sync module for the ChainDay habit tracking app.

## Overview

The offline sync module enables users to complete habits while offline, with automatic synchronization when connectivity returns. The system provides:

- **Instant feedback** (<200ms) regardless of connectivity
- **Zero data loss** through app restarts and device reboots
- **Automatic background sync** on reconnect
- **Graceful conflict resolution** (completion wins)
- **Performance at scale** (500+ operations without degradation)

---

## Directory Structure

```
src/lib/offline/
├── queue/                    # Queue types and data model
│   ├── types.ts             # OfflineOperation, OfflineQueueState
│   ├── state.ts             # State initialization
│   ├── events.ts            # Event types
│   ├── connectivity.ts      # Connectivity state types
│   └── index.ts             # Re-exports
│
├── queueManager/            # Queue management and operations
│   ├── index.ts             # createOfflineQueueManager, singleton
│   ├── types.ts             # OfflineQueueManagerAPI
│   ├── helpers.ts           # ID generation, deduplication
│   ├── operations.ts        # peek, dequeue, remove, clear
│   ├── enqueue.ts           # enqueue with deduplication
│   ├── status.ts            # markSyncing, markCompleted, markFailed
│   ├── statusHelpers.ts     # Status transition utilities
│   └── optimized/           # Batch operations for 500+ items
│       ├── buildIndex.ts    # Map-based O(1) indexing
│       ├── batchOperations.ts
│       └── index.ts
│
├── persistence/             # Storage layer with transaction safety
│   ├── queueStorage.ts      # saveQueueState, loadQueueState
│   ├── transactionWrite.ts  # 3-phase commit implementation
│   ├── transactionSafety.ts # Checksum, recovery
│   ├── queueStorageHelpers.ts # Migration, validation
│   └── index.ts
│
├── sync/                    # Sync orchestration and processing
│   ├── SyncOrchestrator/    # Main orchestration engine
│   │   ├── types.ts
│   │   ├── helpers.ts
│   │   ├── syncOrchestrator.ts
│   │   ├── singleton.ts
│   │   ├── useSyncOrchestrator.ts
│   │   └── index.ts
│   │
│   ├── processQueue/        # FIFO queue processing
│   │   ├── types.ts
│   │   ├── processSingleOperation.ts
│   │   ├── processQueue.ts
│   │   └── index.ts
│   │
│   ├── conflictResolver/    # Conflict detection and resolution
│   │   ├── types.ts
│   │   ├── helpers.ts
│   │   ├── conflictResolver.ts
│   │   └── index.ts
│   │
│   ├── reconcile/           # Server state reconciliation
│   │   ├── types.ts
│   │   ├── helpers.ts
│   │   ├── reconciler.ts
│   │   ├── singleton.ts
│   │   ├── useReconciliation.ts
│   │   └── index.ts
│   │
│   ├── cleanupOrphans/      # Orphaned operation cleanup
│   │   ├── types.ts
│   │   ├── helpers.ts
│   │   ├── cleanupOrphans.ts
│   │   └── index.ts
│   │
│   ├── authHandler/         # Auth expiry handling
│   │   ├── types.ts
│   │   ├── helpers.ts
│   │   ├── authHandler.ts
│   │   ├── singleton.ts
│   │   ├── useAuthHandler.ts
│   │   └── index.ts
│   │
│   └── retryStrategy.ts     # Exponential backoff configuration
│
├── syncManager/             # Lower-level sync execution
│   ├── types.ts
│   ├── createSyncManager.ts
│   └── index.ts
│
├── circuitBreaker/          # Resilience pattern
│   ├── types.ts
│   ├── circuitBreaker.ts
│   └── index.ts
│
├── retryStrategy/           # Retry logic and backoff
│   ├── types.ts
│   ├── calculateDelay.ts
│   └── index.ts
│
├── errorClassifier/         # Error categorization
│   ├── types.ts
│   ├── classify.ts
│   └── index.ts
│
├── calculations/            # Offline streak calculations
│   ├── types.ts
│   ├── dateHelpers.ts
│   ├── streakCalculator.ts
│   └── index.ts
│
├── hooks/                   # React hooks
│   ├── types.ts
│   ├── useOfflineQueue.ts
│   └── index.ts
│
└── index.ts                 # Public API re-exports
```

---

## Core Data Flow

### 1. Enqueue Phase (User Action)

```
User taps to complete habit
        ↓
useOfflineQueue.enqueue()
        ↓
OfflineQueueManager adds operation to queue
        ↓
Auto-persist to AsyncStorage
        ↓
Emit 'queue:operation:added' event
        ↓
UI updates instantly (<200ms)
```

### 2. Sync Phase (Network Restored)

```
NetworkStatusProvider detects online
        ↓
SyncOrchestrator.scheduleSync() (debounced 1s)
        ↓
Precondition checks pass
        ↓
processQueue() starts FIFO processing
        ↓
For each pending operation:
  ├─ Conflict resolution (check server state)
  ├─ Circuit breaker check
  ├─ Mark as 'syncing'
  ├─ Execute mutation with retry
  └─ Mark completed/failed
        ↓
Emit 'sync:completed' event
```

### 3. Reconciliation Phase

```
Sync completes successfully
        ↓
StateReconciler tracks synced habits
        ↓
Emits 'habit:synced' events
        ↓
Components refresh with server-authoritative data
```

---

## Key Types

### OfflineOperation

```typescript
interface OfflineOperation {
  id: string; // op_{timestamp}_{random}
  type: 'toggleCompletion';
  payload: {
    habitId: Id<'habits'>;
    date: string; // YYYY-MM-DD
    toCompleted: boolean;
  };
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  createdAt: number;
  lastAttemptAt?: number;
  retryCount: number;
  lastError?: string;
  lastErrorCategory?: ErrorCategory;
}
```

### OfflineQueueState

```typescript
interface OfflineQueueState {
  version: number; // Schema version for migrations
  createdAt: number;
  updatedAt: number;
  lastSyncCompletedAt?: number;
  operations: OfflineOperation[];
}
```

### SyncOrchestratorResult

```typescript
interface SyncOrchestratorResult {
  initiated: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number; // Skipped due to conflict resolution
  error?: Error;
}
```

---

## Subsystem Details

### Queue Manager

**Responsibilities:**

- FIFO queue state management (FR-005)
- Operation status tracking (pending → syncing → completed/failed)
- Batch operations for 500+ items (FR-011)
- Event emission for state changes
- React integration via `useSyncExternalStore`

**API:**

```typescript
interface OfflineQueueManagerAPI {
  // State
  getState(): OfflineQueueState;
  getStats(): { pending; failed; completed; total };

  // FIFO Operations
  enqueue(type, payload): QueueOperationResult;
  peek(): OfflineOperation | undefined;
  dequeue(): OfflineOperation | undefined;
  remove(id): boolean;
  clear(): void;

  // Status Updates
  markSyncing(id): boolean;
  markCompleted(id): boolean;
  markFailed(id, error, category?): boolean;

  // Batch Operations (optimized for 500+ items)
  markCompletedBatch(ids): BatchStatusResult;
  peekBatch(count): OfflineOperation[];
  removeBatch(ids): BatchStatusResult;

  // Persistence
  restore(): Promise<void>;
  persist(): Promise<void>;

  // Subscription
  subscribe(callback): () => void;
}
```

### Persistence Layer

**Transaction-Safe Storage Pattern:**

Uses 3-phase commit to prevent corruption during app crashes:

```
Phase 1: Write to pending key with checksum
  storage[key_pending] = { state, checksum, timestamp }

Phase 2: Write to main key
  storage[key] = { state, checksum, timestamp }

Phase 3: Cleanup (commit complete)
  delete storage[key_pending]
```

**Recovery on App Restart:**

```
1. Check if key_pending exists (interrupted transaction)
2. If exists: validate checksum, recover from backup
3. Load main key with validation
4. Return empty state if corrupted (fail safe)
```

### Sync Orchestrator

**Responsibilities:**

- Coordinate queue manager with sync execution
- Detect network transitions via NetworkStatusProvider
- Debounce sync attempts (prevents rapid-fire)
- Enforce minimum sync intervals
- Manage preconditions

**Precondition Checks:**

1. Executor function must be set (Convex mutation)
2. Circuit breaker must not be open
3. Minimum sync interval must have elapsed
4. Queue must have pending operations

### Conflict Resolution (US4)

**Strategy: Completion Wins (FR-010)**

When syncing an offline operation:

1. Check current server state for the habit+date
2. If operation wants to complete and server already completed → skip
3. If operation wants to uncomplete and server already uncompleted → skip
4. Otherwise → proceed with sync

```typescript
// Skip scenarios (no actual change needed)
Offline: toCompleted=true  + Server: completed=true  → SKIP
Offline: toCompleted=false + Server: completed=false → SKIP

// Sync scenarios (actual change needed)
Offline: toCompleted=true  + Server: completed=false → SYNC
Offline: toCompleted=false + Server: completed=true  → SYNC
```

**Fail-Safe Behavior:**

- Server check timeout → proceed with sync
- Server unavailable → proceed with sync
- Never block sync due to conflict check failure

### Error Classification

**Categories:**

```typescript
type ErrorCategory =
  | 'network' // No connectivity - retryable
  | 'timeout' // Request timeout - retryable with backoff
  | 'server' // 5xx errors - retryable with backoff
  | 'rateLimit' // 429 - retryable with longer delay
  | 'auth' // 401/403 - needs user action
  | 'validation' // 400/422 - data issue, not retryable
  | 'notFound' // 404 - not retryable
  | 'conflict' // 409 - may need resolution
  | 'unknown'; // Unknown - retryable with caution
```

### Retry Strategy

**Exponential Backoff with Jitter:**

```
delay = min(baseDelay × (multiplier ^ attempt), maxDelay)
delay = delay × (0.5 + random × jitterFactor)
```

**Default Configuration:**

- Max retries: 5
- Base delay: 1000ms
- Max delay: 30000ms
- Jitter factor: 0.3
- Multiplier: 2

**Adaptive Strategies:**

- Rate limit → 3× multiplier, 5s baseline
- Server error → 2.5× multiplier, max 3 retries
- Timeout → Extra 2 retries allowed

### Circuit Breaker

**3-State Pattern:**

```
CLOSED ──failures──→ OPEN ──timeout──→ HALF-OPEN ──success──→ CLOSED
                                            │
                                          failure
                                            ↓
                                          OPEN
```

**Configuration:**

- Failure threshold: 5
- Reset timeout: 30s
- Success threshold: 1 (to close from half-open)

---

## React Integration

### OfflineProvider

Restores queue from storage on app launch:

```typescript
export function OfflineProvider({ children, skipAutoRestore }) {
  useEffect(() => {
    if (!skipAutoRestore) {
      getOfflineQueueManager().restore();
    }
  }, []);
  // ...
}
```

### SyncStatusProvider

Exposes sync status to components:

```typescript
const { status, triggerSync } = useSyncStatus();
// status: { isSyncing, pendingCount, lastSyncAt, indicator }
// indicator: 'idle' | 'syncing' | 'success' | 'error'
```

### Hooks

**useOfflineQueue** - Access queue state:

```typescript
const { operations, stats, hasPendingOperations, enqueue, markCompleted } =
  useOfflineQueue();
```

**useSyncOrchestrator** - Control sync:

```typescript
const { state, triggerSync, subscribe } = useSyncOrchestrator();
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                              │
│                 (Toggle Habit Completion)                         │
└─────────────────────────────┬────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   useOfflineQueue.enqueue()                       │
│                                                                   │
│  • Creates OfflineOperation with unique ID                        │
│  • Deduplicates (same habit+date replaces existing)               │
│  • Persists to AsyncStorage with transaction safety               │
│  • Emits 'queue:operation:added' event                            │
└─────────────────────────────┬────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│               NETWORK STATUS DETECTION                            │
│              (NetworkStatusProvider)                              │
│                                                                   │
│  • Monitors connectivity via NetInfo                              │
│  • Calls onOnline callbacks when connected                        │
└─────────────────────────────┬────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│               SyncOrchestrator.scheduleSync()                     │
│                                                                   │
│  • Debounces (1s default)                                         │
│  • Checks preconditions                                           │
│  • Emits 'sync:started' event                                     │
└─────────────────────────────┬────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    processQueue()                                 │
│                                                                   │
│  For each pending operation (FIFO order):                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 1. Conflict Resolution                                      │   │
│  │    • Check server state for habit+date                      │   │
│  │    • Skip if already matches (completion wins)              │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ 2. Circuit Breaker Check                                    │   │
│  │    • Can execute? (closed or half-open)                     │   │
│  │    • If open → skip for now                                 │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ 3. Execute Mutation                                         │   │
│  │    • Mark as 'syncing'                                      │   │
│  │    • Call Convex mutation with retry                        │   │
│  │    • Classify errors on failure                             │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ 4. Update Status                                            │   │
│  │    • Success → mark 'completed', remove from queue          │   │
│  │    • Retryable failure → mark 'pending', schedule retry     │   │
│  │    • Permanent failure → mark 'failed'                      │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                      RECONCILIATION                               │
│                    (StateReconciler)                              │
│                                                                   │
│  • Tracks synced habits with timestamps                           │
│  • Emits 'habit:synced' events                                    │
│  • Components refresh with server-authoritative data              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Design Decisions

### 1. FIFO Queue Processing (FR-005)

- Ensures deterministic operation order
- Simple to reason about and debug
- No complex dependency resolution needed

### 2. Completion Wins Strategy (US4, FR-010)

- Prevents duplicate toggles
- Handles multi-device race conditions gracefully
- Defers to completion state as source of truth

### 3. Transaction-Safe Persistence (FR-003)

- 3-phase commit prevents corruption during crashes
- Automatic recovery on startup
- Guarantees zero data loss (SC-003)

### 4. Optimized Batch Operations (FR-011)

- Map-based indexing for O(1) lookups
- Handles 500+ operations efficiently
- Reduces memory allocation during bulk updates

### 5. Circuit Breaker Pattern

- Prevents cascade failures during outages
- Automatic recovery after timeout
- Configurable per error category

### 6. useSyncExternalStore for React

- Efficient subscription without context overhead
- Minimal re-renders
- Compatible with concurrent React features

---

## Requirements Mapping

| Requirement                          | Implementation                    | Location                           |
| ------------------------------------ | --------------------------------- | ---------------------------------- |
| **FR-001** Store completions locally | Queue manager with AsyncStorage   | `queueManager/`, `persistence/`    |
| **FR-002** Feedback under 200ms      | Optimistic UI + instant queue add | `hooks/useOfflineQueue.ts`         |
| **FR-003** Persist across restarts   | Transaction-safe persistence      | `persistence/transactionWrite.ts`  |
| **FR-004** Auto-detect connectivity  | NetworkStatusProvider integration | `SyncOrchestrator/`                |
| **FR-005** FIFO processing           | processQueue with oldest-first    | `sync/processQueue/`               |
| **FR-006** Exponential backoff       | Retry strategy with jitter        | `sync/retryStrategy.ts`            |
| **FR-007** Optimistic streak updates | Local streak calculation          | `calculations/streakCalculator.ts` |
| **FR-008** Reconcile with server     | StateReconciler                   | `sync/reconcile/`                  |
| **FR-009** Non-blocking indicators   | SyncStatusContext + components    | `contexts/SyncStatusContext/`      |
| **FR-010** Completion wins           | Conflict resolver                 | `sync/conflictResolver/`           |
| **FR-011** Handle 500+ operations    | Optimized batch ops               | `queueManager/optimized/`          |
| **FR-012** Non-blocking sync         | Async processing                  | Throughout                         |

---

## Testing

**Test Coverage:**

- 800+ tests across the offline module
- Unit tests for each subsystem
- Integration tests for data flow
- E2E tests for user scenarios
- Performance benchmarks for FR-011 compliance

**Key Test Files:**

- `queueManager.test.ts` - Queue operations
- `queueManager/optimized.test.ts` - Batch performance
- `transactionSafety.test.ts` - Crash recovery
- `processQueue.conflict.test.ts` - Conflict resolution
- `performance.test.ts` - FR-011/SC-001 validation

---

## Performance Characteristics

| Operation            | Complexity              | Benchmark          |
| -------------------- | ----------------------- | ------------------ |
| Enqueue              | O(n) dedup check        | <2ms avg           |
| Peek                 | O(n) find first pending | <1ms               |
| Batch complete 500   | O(k) with index         | <50ms              |
| Persist to storage   | O(n) serialize          | <100ms for 500 ops |
| Restore from storage | O(n) deserialize        | <100ms (SC-006)    |

---

## Edge Case Handling

| Edge Case                 | Solution                              |
| ------------------------- | ------------------------------------- |
| App crash during write    | Transaction-safe 3-phase commit       |
| Deleted habit on server   | Orphan cleanup removes operations     |
| Auth expiry while offline | Store locally, prompt re-auth on sync |
| 100+ offline completions  | Batch processing without UI blocking  |
| Network flapping          | Debounced sync, minimum interval      |
| Rapid toggle same habit   | Deduplication replaces existing op    |

---

## Future Considerations

1. **Offline habit creation** - Currently out of scope
2. **Manual sync trigger** - Could add user-initiated sync
3. **Sync history/audit log** - For debugging and transparency
4. **Selective sync** - Sync specific habits first
5. **Background sync** - When app is backgrounded
