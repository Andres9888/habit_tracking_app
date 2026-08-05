/**
 * Resolve Operations
 *
 * Batch resolution of offline operations using individual server checks.
 */

import type { OfflineOperation } from '../../queue';
import {
  buildBatchResult,
  buildResolutionResult,
  createEmptyBatchResult,
} from './helpers';
import {
  DEFAULT_CONFLICT_RESOLVER_CONFIG,
  resolveOperation,
} from './resolveOperation';
import type {
  BatchConflictResolutionResult,
  CompletionStateChecker,
  ConflictEventListener,
  ConflictResolutionResult,
  ConflictResolverConfig,
} from './types';

/**
 * Resolve multiple operations using individual server state checks
 */
export async function resolveOperations(
  operations: OfflineOperation<'toggleCompletion'>[],
  checkServerState: CompletionStateChecker,
  config: ConflictResolverConfig = {},
  onEvent?: ConflictEventListener
): Promise<BatchConflictResolutionResult> {
  if (operations.length === 0) {
    return createEmptyBatchResult();
  }

  const mergedConfig = { ...DEFAULT_CONFLICT_RESOLVER_CONFIG, ...config };

  if (!mergedConfig.checkServerStateBeforeSync) {
    const results = operations.map((op) =>
      buildResolutionResult(
        op.id,
        op.payload,
        undefined,
        'sync',
        'Server state check disabled - proceeding with sync'
      )
    );
    return buildBatchResult(results);
  }

  const results: ConflictResolutionResult[] = [];
  for (const operation of operations) {
    const result = await resolveOperation(
      operation,
      checkServerState,
      mergedConfig,
      onEvent
    );
    results.push(result);
  }

  return buildBatchResult(results);
}
