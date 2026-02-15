/**
 * Sync Orchestrator Singleton
 *
 * Provides a singleton instance of the SyncOrchestrator for app-wide use.
 * Lazily creates the orchestrator on first access.
 */

import type { SyncOrchestratorConfig } from './types';
import { SyncOrchestrator } from './SyncOrchestrator';
import { getOfflineQueueManager } from '../queueManager';
import { getOfflineSyncManager } from '../syncManager';

let instance: SyncOrchestrator | null = null;

/**
 * Get the singleton SyncOrchestrator instance
 *
 * @param config - Optional configuration (only used on first call)
 * @returns The SyncOrchestrator singleton
 */
export function getSyncOrchestrator(
  config?: SyncOrchestratorConfig
): SyncOrchestrator {
  if (!instance) {
    instance = new SyncOrchestrator(
      getOfflineQueueManager(),
      getOfflineSyncManager(),
      config
    );
  }
  return instance;
}

/**
 * Reset the singleton (for testing)
 */
export function resetSyncOrchestrator(): void {
  if (instance) {
    instance.stop();
    instance = null;
  }
}

/**
 * Create a new SyncOrchestrator with custom dependencies (for testing)
 */
export { SyncOrchestrator } from './SyncOrchestrator';
