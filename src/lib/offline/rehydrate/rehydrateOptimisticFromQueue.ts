import { optimisticHabitCreationStore } from '../../../features/habits/hooks/optimisticHabitCreationStore';
import { optimisticHabitUpdateStore } from '../../../features/habits/hooks/optimisticHabitUpdateStore';
import { optimisticStore } from '../../optimistic/store';
import type { OfflineOperation, QueueEvent } from '../queue';
import type { OfflineQueueManagerAPI } from '../queueManager';
import { rehydrateOperation } from './rehydrateOperation';

export function rehydrateOptimisticFromQueue(
  operations: OfflineOperation[]
): void {
  for (const operation of operations) rehydrateOperation(operation);
}

export function syncOptimisticFromQueueEvent(
  event: QueueEvent,
  _manager: OfflineQueueManagerAPI
): void {
  if (event.operation && event.type === 'operation:updated') {
    rehydrateOperation(event.operation);
  } else if (event.operationId && event.type === 'operation:synced') {
    optimisticStore.confirm(event.operationId);
    // Creates live in a separate store; confirming lets its TTL eviction path
    // run once the server habit lands (covers reconcile matchKey misses).
    optimisticHabitCreationStore.confirm(event.operationId);
    optimisticHabitUpdateStore.confirm(event.operationId);
  } else if (event.operationId && event.type === 'operation:failed-final') {
    optimisticStore.fail(
      event.operationId,
      new Error(event.error ?? 'Sync failed')
    );
    // Drop the ghost optimistic record so a permanently-failed create/edit
    // stops rendering instead of lingering forever.
    optimisticHabitCreationStore.fail(event.operationId);
    optimisticHabitUpdateStore.fail(event.operationId);
  }
}
