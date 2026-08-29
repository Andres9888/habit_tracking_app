import type { OfflineOperation } from '../../queue';
import type { ErrorCategory } from '../../types';
import type {
  ProcessOperationResult,
  ProcessSingleOptions,
  QueueProcessorDeps,
} from './types';

export function handleSyncFailure(
  result: {
    item: { retryContext: { exhausted: boolean } };
    error?: { message?: string; category?: ErrorCategory };
  },
  operation: OfflineOperation,
  deps: QueueProcessorDeps,
  options: ProcessSingleOptions,
  startTime: number
): ProcessOperationResult {
  const { queueManager } = deps;
  const { callbacks } = options;
  const exhausted = result.item.retryContext.exhausted;
  const errorMessage = result.error?.message ?? 'Sync failed';
  queueManager.markFailed(operation.id, errorMessage, result.error?.category, {
    final: exhausted,
  });

  if (exhausted) {
    queueManager.remove(operation.id);
    callbacks?.onFailure?.(operation, errorMessage);
  } else {
    queueManager.markPending(operation.id);
  }

  return {
    durationMs: Date.now() - startTime,
    error: errorMessage,
    operationId: operation.id,
    shouldRetry: !exhausted,
    success: false,
  };
}

export function handleSyncError(
  error: unknown,
  operation: OfflineOperation,
  deps: QueueProcessorDeps,
  options: ProcessSingleOptions,
  startTime: number
): ProcessOperationResult {
  const { queueManager } = deps;
  const { callbacks } = options;
  const errorMessage = error instanceof Error ? error.message : String(error);

  queueManager.markFailed(operation.id, errorMessage, 'unknown');
  queueManager.markPending(operation.id);
  callbacks?.onFailure?.(operation, errorMessage);

  return {
    durationMs: Date.now() - startTime,
    error: errorMessage,
    operationId: operation.id,
    shouldRetry: true,
    success: false,
  };
}
