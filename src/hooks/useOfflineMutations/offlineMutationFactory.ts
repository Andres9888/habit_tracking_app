/**
 * offlineMutationFactory - Creates offline-aware mutations with consistent patterns
 *
 * Eliminates duplicate logic for:
 * - Offline queueing
 * - Online execution with fallback
 * - Error handling and network error detection
 *
 * @example
 * ```typescript
 * const createHabit = createOfflineMutation(
 *   useMutation(api.habits.create),
 *   'createHabit',
 *   (args) => ({ tempId: generateTempId() })  // optional optimistic metadata
 * );
 * ```
 */

import type { ConvexMutation } from 'convex/react';
import { getOfflineQueueManager, isNetworkError } from '../../lib/offline';

export interface MutationResult<T = any> {
  /** Whether operation was queued for offline sync */
  queued: boolean;
  /** ID of offline queue operation (if queued) */
  offlineOperationId?: string;
  /** Server result (if executed immediately) */
  result?: T;
  /** Optional metadata for optimistic updates */
  metadata?: Record<string, any>;
}

/**
 * Creates an offline-aware mutation that automatically handles queuing
 * @param mutation The Convex mutation function
 * @param operationName Name of the operation for queue
 * @param isOnline Current online status
 * @param getMetadata Optional function to extract metadata for optimistic updates
 */
export function createOfflineMutation<Args, Result>(
  mutation: ConvexMutation<Args, Result>,
  operationName: string,
  isOnline: boolean,
  getMetadata?: (args: Args) => Record<string, any>
) {
  const queueManager = getOfflineQueueManager();

  return async (args: Args): Promise<MutationResult<Result>> => {
    const metadata = getMetadata?.(args);

    // If offline, queue immediately
    if (!isOnline) {
      const queueResult = queueManager.enqueue(operationName, args);
      return {
        queued: queueResult.success,
        offlineOperationId: queueResult.operationId,
        metadata,
      };
    }

    // Try online execution
    try {
      const result = await mutation(args);
      return { queued: false, result, metadata };
    } catch (error) {
      // Network error during execution → queue it
      if (isNetworkError(error)) {
        const queueResult = queueManager.enqueue(operationName, args);
        return {
          queued: queueResult.success,
          offlineOperationId: queueResult.operationId,
          metadata,
        };
      }
      // Non-network error → propagate
      throw error;
    }
  };
}
