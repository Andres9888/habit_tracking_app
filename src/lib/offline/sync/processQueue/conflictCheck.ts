/**
 * Conflict Check - US4 Integration
 *
 * Handles conflict detection before syncing operations.
 * Implements US4 (Graceful Conflict Resolution) integration.
 */

import type { OfflineOperation } from '../../queue';
import { resolveOperation } from '../conflictResolver';
import type { QueueProcessorDeps, ProcessSingleOptions } from './types';

/** Result of conflict check */
export interface ConflictCheckResult {
  shouldSync: boolean;
  reason: string;
}

/**
 * Check for conflicts and resolve before syncing (US4)
 */
export async function checkAndResolveConflict(
  operation: OfflineOperation<'toggleCompletion'>,
  deps: QueueProcessorDeps,
  options: ProcessSingleOptions
): Promise<ConflictCheckResult> {
  const { serverStateChecker } = deps;
  const { conflictConfig, callbacks } = options;

  // If no server state checker provided, proceed with sync
  if (!serverStateChecker) {
    return { reason: 'No conflict checker configured', shouldSync: true };
  }

  try {
    const resolution = await resolveOperation(
      operation,
      serverStateChecker,
      conflictConfig,
      callbacks?.onConflict
    );

    if (resolution.resolution === 'skip' || resolution.resolution === 'fail') {
      return { reason: resolution.reason, shouldSync: false };
    }

    return { reason: resolution.reason, shouldSync: true };
  } catch (error) {
    // On conflict check error, proceed with sync (fail-safe)
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return {
      reason: `Conflict check failed: ${msg} - proceeding`,
      shouldSync: true,
    };
  }
}
