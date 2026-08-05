/**
 * runOfflineAwareMutation
 *
 * Shared branching for optimistic-store-backed mutations that must survive
 * offline. Generalises the flow proven in useOptimisticToggleMutation:
 *
 * 1. Offline → enqueue immediately, keep optimistic state (swap in the queue
 *    operation id so sync events can confirm/fail it).
 * 2. Online → apply optimistic state, call the server, confirm on success.
 * 3. Network error mid-request → enqueue and re-key the optimistic op.
 * 4. Any other error → roll back the optimistic op and run onError.
 *
 * Callers own their optimistic store choice via the add callbacks; confirm/
 * fail/replace go through the shared optimisticStore.
 *
 * @see docs/offline-habit-sync.md
 */

import { getOfflineQueueManager, isNetworkError } from '../offline';
import type {
  OfflineOperationPayload,
  OfflineOperationType,
} from '../offline';
import { optimisticStore } from './store';

export interface OfflineAwareMutationOptions {
  isOnline: boolean;
  queueType: OfflineOperationType;
  queuePayload: OfflineOperationPayload;
  /** Apply optimistic state, returning the optimistic operation id. */
  addOptimistic: () => string;
  /** Apply optimistic state keyed to a known (queue) operation id. */
  addOptimisticWithId: (operationId: string) => void;
  serverMutation: () => Promise<unknown>;
  /** Handle a non-network failure (e.g. show an alert). */
  onError?: (error: Error) => void;
}

export interface OfflineAwareMutationResult {
  queued: boolean;
  operationId?: string;
}

export async function runOfflineAwareMutation(
  options: OfflineAwareMutationOptions
): Promise<OfflineAwareMutationResult> {
  const {
    isOnline,
    queueType,
    queuePayload,
    addOptimistic,
    addOptimisticWithId,
    serverMutation,
    onError,
  } = options;

  if (!isOnline) {
    const result = getOfflineQueueManager().enqueue(queueType, queuePayload);
    if (result.success && result.operationId) {
      addOptimisticWithId(result.operationId);
    } else {
      addOptimistic();
    }
    return { operationId: result.operationId, queued: result.success };
  }

  const operationId = addOptimistic();
  try {
    await serverMutation();
    optimisticStore.confirm(operationId);
    return { queued: false };
  } catch (error) {
    if (isNetworkError(error)) {
      const result = getOfflineQueueManager().enqueue(queueType, queuePayload);
      if (result.success && result.operationId) {
        optimisticStore.replaceOperationId(operationId, result.operationId);
      }
      return { operationId: result.operationId, queued: result.success };
    }
    optimisticStore.fail(operationId, error as Error);
    onError?.(error as Error);
    return { queued: false };
  }
}
