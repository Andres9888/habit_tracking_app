import { useCallback } from 'react';
import {
  generateOperationId,
  getOfflineQueueManager,
  isNetworkError,
  type OfflineOperationType,
} from '../../offline';
import type {
  OfflineMutationOptions,
  OfflineMutationPayload,
  OfflineMutationResult,
} from './useOfflineMutation.types';

function enqueueOrThrow<T extends OfflineOperationType>(
  type: T,
  payload: OfflineMutationPayload<T>,
  operationId: string
): string {
  const result = getOfflineQueueManager().enqueue(type, payload, {
    operationId,
  });
  if (!result.success || !result.operationId) {
    throw new Error(result.error ?? 'Could not queue offline mutation');
  }
  return result.operationId;
}

export function useOfflineMutation<T extends OfflineOperationType, TResult>(
  type: T,
  serverMutation: (payload: OfflineMutationPayload<T>) => Promise<TResult>,
  options: OfflineMutationOptions<T>
) {
  const { applyOptimistic, confirmOptimistic, failOptimistic, isOnline } =
    options;

  return useCallback(
    async (
      payload: OfflineMutationPayload<T>
    ): Promise<OfflineMutationResult<TResult>> => {
      const operationId = generateOperationId();
      if (!isOnline) {
        const queuedId = enqueueOrThrow(type, payload, operationId);
        applyOptimistic?.(queuedId, payload);
        return { kind: 'queued', operationId: queuedId };
      }

      applyOptimistic?.(operationId, payload);
      try {
        const value = await serverMutation(payload);
        confirmOptimistic?.(operationId);
        return { kind: 'synced', operationId, value };
      } catch (error) {
        if (isNetworkError(error)) {
          try {
            const queuedId = enqueueOrThrow(type, payload, operationId);
            return { kind: 'queued', operationId: queuedId };
          } catch (queueError) {
            const normalizedQueueError =
              queueError instanceof Error
                ? queueError
                : new Error(String(queueError));
            failOptimistic?.(operationId, normalizedQueueError);
            throw queueError;
          }
        }

        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        failOptimistic?.(operationId, normalizedError);
        throw error;
      }
    },
    [
      applyOptimistic,
      confirmOptimistic,
      failOptimistic,
      isOnline,
      serverMutation,
      type,
    ]
  );
}

export type {
  OfflineMutationOptions,
  OfflineMutationPayload,
  OfflineMutationResult,
} from './useOfflineMutation.types';
