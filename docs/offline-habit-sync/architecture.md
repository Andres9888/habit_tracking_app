---
type: architecture
title: Offline habit sync architecture
updated: 2026-08-28
---

# Offline habit sync architecture

This document describes the runtime system. The implementation lives in `src/lib/offline`, `src/lib/optimistic`, `src/providers/OfflineProvider`, and the Convex habit mutations.

## Runtime flow

```text
UI mutation
  -> optimistic store updates the visible habit state
  -> online: call Convex
       -> success: confirm optimistic operation
       -> network error: enqueue the same operation ID
       -> other error: revert and rethrow
  -> offline: enqueue first, then apply the optimistic operation

queue manager
  -> in-memory FIFO queue
  -> serialized snapshot writer
  -> user-scoped secure storage with recovery

sync status provider
  -> sync orchestrator
  -> conflict check
  -> typed executor
  -> Convex mutation
```

## Queued operations

| Operation          | Offline behavior                     | Replay rule                                                                    |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------------ |
| `toggleCompletion` | Queue and update the day immediately | Sends absolute `completed`, so replay is idempotent                            |
| `createHabit`      | Queue and show a temporary habit     | Sends `tempId` as `clientRequestId`; server returns the existing row on replay |
| `archiveHabit`     | Queue and hide the habit             | Repeating archive is harmless                                                  |
| `pauseHabit`       | Queue and render the habit paused    | Repeating pause is harmless                                                    |
| `removeHabit`      | Queue and hide the habit             | Repeating remove is harmless                                                   |
| `updateHabit`      | Executor support only                | UI edits remain online-only until an update overlay exists                     |

Temporary habit IDs start with `temp_habit_`. The habit card blocks toggles and lifecycle actions for those rows. This avoids queuing a dependent operation with an ID the server does not know. FIFO order alone cannot translate a temporary ID to the inserted Convex ID.

## Create idempotency

The client generates one temporary ID per form submission and reuses it when the retry alert runs. Direct and queued creates send that value as `clientRequestId`.

The `habits` table stores the optional key and indexes `[userId, clientRequestId]`. The create mutation applies the rate limit and validates input, then checks that index before inserting. A retry returns the existing habit ID.

The habits list includes `clientRequestId` so optimistic creation reconciliation uses an exact match. It falls back to the older field-and-time match for habits created before this field existed. When a queued create with reminders reaches the server, reconciliation schedules the local reminder under the real habit ID.

## Persistence and restore

Queue storage is scoped to the authenticated Clerk user. The manager writes snapshots through a serialized scheduler. While a write is running, it keeps only the newest requested snapshot.

Restore merges disk operations into current memory. An operation already in memory wins by ID. Persisted operations with status `syncing` become `pending`, because the prior process may have died during the network call.

These rules prevent three data-loss cases:

- A tap during authentication is not overwritten by a late restore.
- Two storage writes cannot finish out of order and leave an older snapshot.
- A process death during sync does not strand an operation forever.

## Sync triggers and failure rules

The orchestrator schedules work when connectivity returns. It also checks on mount and after `queue:restored`, which handles an app that starts online with stored work.

Processing uses FIFO order, exponential backoff, and the circuit breaker. A transient failure returns the operation to `pending`. A final failure emits `operation:failed-final`, reverts the optimistic state, and removes the operation so it cannot consume queue capacity forever.

`SyncStatusProvider` is the only React bridge for sync state and manual retry. The old network-sync hook and the old AsyncStorage queue were removed.

## Background sync

The Expo background task runs no more often than the platform allows, currently requested at a 15 minute interval. It restores the authenticated queue scope and uses the same executor and failure rules as foreground sync.

## Main ownership

- `src/lib/offline/queueManager`: queue state, persistence, restore, and events
- `src/lib/offline/sync`: orchestration, retries, conflict handling, and Convex executor
- `src/lib/optimistic`: immediate UI state and offline mutation wrappers
- `src/providers/OfflineProvider`: auth-scoped restore and optimistic rehydration
- `convex/habits/create.ts`: create idempotency
- `convex/habits/toggle.ts`: absolute completion replay

## Current limits

Habit field updates, reorder, resume, unarchive, and batch mutations remain online-only. The durable queue supports their underlying patterns only where an operation type and optimistic representation exist.
