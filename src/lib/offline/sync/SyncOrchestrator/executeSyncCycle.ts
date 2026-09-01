/**
 * Adapts the shared queue processor to the orchestrator result contract.
 */

import type { OfflineQueueManagerAPI } from '../../queueManager';
import type { OfflineSyncManager } from '../../syncManager';
import type {
  SyncExecutor,
  SyncOrchestratorResult,
  SyncProgressCallback,
} from '../types';
import { createSyncResult } from '../resultHelpers';
import { processQueue } from '../processQueue';

interface ExecuteSyncParams {
  batchSize: number;
  queueManager: OfflineQueueManagerAPI;
  syncManager: OfflineSyncManager;
  executor: SyncExecutor;
  onProgress?: SyncProgressCallback;
}

export async function executeSyncCycle({
  batchSize,
  queueManager,
  syncManager,
  executor,
  onProgress,
}: ExecuteSyncParams): Promise<SyncOrchestratorResult> {
  const result = await processQueue(
    { executor, queueManager, syncManager },
    {
      batchSize,
      onProgress: (processed, total) => {
        if (processed > 0) onProgress?.(processed, total);
      },
    }
  );

  return createSyncResult(
    true,
    result.total,
    result.succeeded,
    result.failed,
    result.skipped
  );
}
