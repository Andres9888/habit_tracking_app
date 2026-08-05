/**
 * Item Processing Logic
 */

import { classifyError, getDisplayMessage } from '../errorClassifier';
import type { CircuitBreaker } from '../circuitBreaker';
import { createRetryContext, updateRetryContext } from '../retryStrategy';
import type { RetryStrategy, SyncEventType } from '../types';
import type { SyncItem, SyncItemExecutor, SyncResult } from './types';

export async function processItem<T>(
  item: SyncItem<T>,
  executor: SyncItemExecutor<T>,
  circuitBreaker: CircuitBreaker,
  retryStrategy: RetryStrategy,
  emit: (type: SyncEventType, data?: Record<string, unknown>) => void,
  stats: { syncedCount: number; failedCount: number }
): Promise<SyncResult<T>> {
  if (!circuitBreaker.canExecute()) {
    emit('sync:item:skipped', { itemId: item.id, reason: 'circuit_open' });
    return { item, success: false };
  }

  try {
    await executor(item);
    circuitBreaker.recordSuccess();
    stats.syncedCount++;
    emit('sync:item:success', { itemId: item.id, type: item.type });
    return {
      item: { ...item, retryContext: createRetryContext() },
      success: true,
    };
  } catch (error) {
    const classified = classifyError(error);
    const newRetryContext = updateRetryContext(
      item.retryContext,
      classified,
      retryStrategy
    );
    circuitBreaker.recordFailure(classified);
    if (newRetryContext.exhausted || !classified.isRetryable)
      stats.failedCount++;
    emit('sync:item:failed', {
      category: classified.category,
      displayMessage: getDisplayMessage(error),
      error: classified.message,
      exhausted: newRetryContext.exhausted,
      itemId: item.id,
      retryable: classified.isRetryable,
    });
    return {
      error: classified,
      item: { ...item, retryContext: newRetryContext },
      success: false,
    };
  }
}
