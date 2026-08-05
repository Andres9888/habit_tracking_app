/**
 * useOfflineQueue Hook
 *
 * React hook for accessing the offline queue state and operations.
 * Uses useSyncExternalStore for efficient React integration.
 *
 * @see docs/offline-habit-sync.md FR-001 (store completions locally)
 */

import { useMemo, useSyncExternalStore } from 'react';
import { getOfflineQueueManager } from '../queueManager';
import type { UseOfflineQueueOptions, UseOfflineQueueReturn } from './types';
import { useQueueActions } from './useQueueActions';

/**
 * Hook to access and interact with the offline queue
 */
export function useOfflineQueue(
  options: UseOfflineQueueOptions = {}
): UseOfflineQueueReturn {
  const manager = options.manager ?? getOfflineQueueManager();

  const state = useSyncExternalStore(
    manager.subscribeToState,
    () => manager.getState(),
    () => manager.getState()
  );

  const stats = useMemo(() => manager.getStats(), [state, manager]);

  const operations = state.operations;
  const hasPendingOperations = useMemo(
    () =>
      operations.some(
        (op) => op.status === 'pending' || op.status === 'syncing'
      ),
    [operations]
  );
  const isEmpty = operations.length === 0;

  const actions = useQueueActions(manager);

  return { hasPendingOperations, isEmpty, operations, stats, ...actions };
}
