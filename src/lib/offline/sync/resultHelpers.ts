/**
 * Sync Orchestrator Result Helpers
 *
 * Helper functions for creating and processing sync results.
 */

import type { SyncOrchestratorResult } from './types';

/**
 * Create a sync result object
 */
export function createSyncResult(
  initiated: boolean,
  processed: number,
  succeeded: number,
  failed: number,
  skipped: number
): SyncOrchestratorResult {
  return { failed, initiated, processed, skipped, succeeded };
}

/**
 * Create an error result object
 */
export function createErrorResult(error: Error): SyncOrchestratorResult {
  return {
    error,
    failed: 0,
    initiated: false,
    processed: 0,
    skipped: 0,
    succeeded: 0,
  };
}
