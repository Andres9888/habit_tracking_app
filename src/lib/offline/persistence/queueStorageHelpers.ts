/**
 * Queue Storage Helper Functions
 *
 * Internal helpers for queue state validation, migration, and defaults.
 */

import type { OfflineQueueState } from '../queue';
import { DEFAULT_QUEUE_STATE, OFFLINE_QUEUE_VERSION } from '../queue';

/**
 * Create a new default queue state with proper timestamps
 */
export function createDefaultState(): OfflineQueueState {
  const now = Date.now();
  return {
    ...DEFAULT_QUEUE_STATE,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Type guard to validate persisted queue state structure
 */
export function isValidQueueState(value: unknown): value is OfflineQueueState {
  if (!value || typeof value !== 'object') return false;

  const state = value as Record<string, unknown>;

  return (
    typeof state.version === 'number' &&
    Array.isArray(state.operations) &&
    typeof state.createdAt === 'number' &&
    typeof state.updatedAt === 'number'
  );
}

/**
 * Migrate queue state from older versions
 * Currently just returns the state as-is since we're at v1
 */
export function migrateQueueState(state: OfflineQueueState): OfflineQueueState {
  // Future migrations would be handled here
  // For now, just update the version and return
  return {
    ...state,
    updatedAt: Date.now(),
    version: OFFLINE_QUEUE_VERSION,
  };
}
