/**
 * useQueueActions - Memoized action callbacks for the offline queue
 */

import { useCallback } from 'react';
import type { ErrorCategory } from '../types';
import type { UseOfflineQueueReturn } from './types';

type Manager = {
  enqueue: (
    type: 'toggleCompletion',
    payload: Parameters<UseOfflineQueueReturn['enqueue']>[0],
    options?: Parameters<UseOfflineQueueReturn['enqueue']>[1]
  ) => ReturnType<UseOfflineQueueReturn['enqueue']>;
  markCompleted: (id: string) => boolean;
  markFailed: (id: string, error: string, category?: ErrorCategory) => boolean;
  clear: () => void;
  subscribe: (
    cb: Parameters<UseOfflineQueueReturn['subscribe']>[0]
  ) => () => void;
};

export function useQueueActions(manager: Manager) {
  const enqueue = useCallback(
    (
      payload: Parameters<UseOfflineQueueReturn['enqueue']>[0],
      opts?: Parameters<UseOfflineQueueReturn['enqueue']>[1]
    ) => manager.enqueue('toggleCompletion', payload, opts),
    [manager]
  );

  const markCompleted = useCallback(
    (operationId: string) => manager.markCompleted(operationId),
    [manager]
  );

  const markFailed = useCallback(
    (operationId: string, error: string, category?: ErrorCategory) =>
      manager.markFailed(operationId, error, category),
    [manager]
  );

  const clear = useCallback(() => manager.clear(), [manager]);

  const subscribe = useCallback(
    (callback: Parameters<UseOfflineQueueReturn['subscribe']>[0]) =>
      manager.subscribe(callback),
    [manager]
  );

  return { clear, enqueue, markCompleted, markFailed, subscribe };
}
