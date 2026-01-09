import type { QueuedSubmission } from '../../hooks/useOfflineQueue';
import { processItem } from './processItem';
import type { ProcessingState, OfflineQueueProcessorProps } from './types';

type ProcessorCallbacks = Pick<
  OfflineQueueProcessorProps,
  | 'onProcessingStart'
  | 'onProcessingComplete'
  | 'onItemProcessed'
  | 'onItemFailed'
>;

interface QueueOperations {
  dequeue: (id: string) => Promise<void>;
  markFailed: (id: string, error: string) => Promise<void>;
}

interface ProcessQueueOptions {
  items: QueuedSubmission[];
  isOnline: boolean;
  mutations: Parameters<typeof processItem>[1];
  callbacks: ProcessorCallbacks;
  operations: QueueOperations;
  updateState: (updates: Partial<ProcessingState>) => void;
}

export async function executeQueueProcessing({
  items,
  isOnline,
  mutations,
  callbacks,
  operations,
  updateState,
}: ProcessQueueOptions): Promise<{
  processedCount: number;
  failedCount: number;
}> {
  callbacks.onProcessingStart?.();

  let processedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!isOnline) break;

    updateState({ currentItem: item, progress: i / items.length });

    try {
      const success = await processItem(item, mutations);
      if (success) {
        await operations.dequeue(item.id);
        processedCount++;
        callbacks.onItemProcessed?.(item);
      } else {
        await operations.markFailed(item.id, 'Processing not supported');
        failedCount++;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      await operations.markFailed(item.id, errorMessage);
      failedCount++;
      callbacks.onItemFailed?.(item, error as Error);
    }
  }

  return { failedCount, processedCount };
}
