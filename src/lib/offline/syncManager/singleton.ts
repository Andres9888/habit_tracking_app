/**
 * Sync Manager Singleton
 */

import { OfflineSyncManager } from './OfflineSyncManager';
import type { OfflineSyncManagerConfig } from './types';

/** Singleton instance */
let defaultManager: OfflineSyncManager | null = null;

/**
 * Get or create the default sync manager instance
 */
export function getOfflineSyncManager(
  config?: OfflineSyncManagerConfig
): OfflineSyncManager {
  if (!defaultManager) {
    defaultManager = new OfflineSyncManager(config);
  }
  return defaultManager;
}

/**
 * Reset the default sync manager (for testing)
 */
export function resetOfflineSyncManager(): void {
  defaultManager = null;
}
