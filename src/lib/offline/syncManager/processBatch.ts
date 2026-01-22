/**
 * Batch Processing Logic
 */

import type { CircuitBreaker } from '../circuitBreaker';
import type { RetryStrategy, SyncEventType } from '../types';
import type { SyncItem, SyncItemExecutor, BatchResult } from './types';
import { processItem } from './processItem';

export async function processBatch<T>(
  items: SyncItem<T>[],
  executor: SyncItemExecutor<T>,
  circuitBreaker: CircuitBreaker,
  retryStrategy: RetryStrategy,
  emit: (type: SyncEventType, data?: Record<string, unknown>) => void,
  stats: { syncedCount: number; failedCount: number },
  onProgress?: (processed: number, total: number) => void
): Promise<BatchResult<T>> {
  emit('sync:start', { itemCount: items.length });
  const successful: SyncItem<T>[] = [];
  const failed: SyncItem<T>[] = [];
  const skipped: SyncItem<T>[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (
      item.retryContext.nextRetryAt &&
      Date.now() < item.retryContext.nextRetryAt
    ) {
      skipped.push(item);
      continue;
    }
    if (!circuitBreaker.canExecute()) {
      skipped.push(...items.slice(i));
      break;
    }
    const result = await processItem(
      item,
      executor,
      circuitBreaker,
      retryStrategy,
      emit,
      stats
    );
    if (result.success) successful.push(result.item);
    else if (result.item.retryContext.exhausted) failed.push(result.item);
    else skipped.push(result.item);
    onProgress?.(i + 1, items.length);
  }

  emit('sync:complete', {
    failed: failed.length,
    skipped: skipped.length,
    successful: successful.length,
  });
  return { failed, skipped, successful };
}
