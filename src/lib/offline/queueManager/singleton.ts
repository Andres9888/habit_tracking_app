/**
 * Offline Queue Manager Singleton
 *
 * Provides singleton access to the default queue manager instance.
 */

import type { OfflineQueueManagerAPI } from './types';
import { createOfflineQueueManager } from './createManager';

let defaultInstance: OfflineQueueManagerAPI | null = null;

export function getOfflineQueueManager(): OfflineQueueManagerAPI {
  if (!defaultInstance) {
    defaultInstance = createOfflineQueueManager();
  }
  return defaultInstance;
}

export function resetOfflineQueueManager(): void {
  defaultInstance = null;
}
