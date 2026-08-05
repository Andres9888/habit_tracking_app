import type { OfflineOperation } from '../../queue';
import {
  buildBatchResult,
  buildResolutionResult,
  createConflictEvent,
} from './helpers';
import type {
  BatchConflictResolutionResult,
  ConflictEventListener,
} from './types';

export function handleBatchError(
  operations: OfflineOperation<'toggleCompletion'>[],
  error: unknown,
  onEvent?: ConflictEventListener
): BatchConflictResolutionResult {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  if (onEvent && operations.length > 0) {
    onEvent(
      createConflictEvent('conflict:error', {
        date: operations[0].payload.date,
        error: error instanceof Error ? error : new Error(errorMessage),
        habitId: operations[0].payload.habitId,
        operationId: 'batch',
      })
    );
  }
  const results = operations.map((op) =>
    buildResolutionResult(
      op.id,
      op.payload,
      undefined,
      'sync',
      `Batch server check failed: ${errorMessage} - proceeding with sync`
    )
  );
  return buildBatchResult(results);
}
