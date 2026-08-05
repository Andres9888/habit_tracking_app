/**
 * Batch Resolution Helpers
 */

import type { OfflineOperation } from '../../queue';
import {
  buildBatchResult,
  buildResolutionResult,
  createConflictEvent,
  createHabitDateKey,
  resolveConflict,
} from './helpers';
import type {
  BatchConflictResolutionResult,
  ConflictEventListener,
  ConflictResolutionResult,
  ServerCompletionState,
} from './types';

export { handleBatchError } from './batchErrorHandler';

export function buildResultsFromStates(
  operations: OfflineOperation<'toggleCompletion'>[],
  serverStates: Map<string, boolean>,
  onEvent?: ConflictEventListener
): BatchConflictResolutionResult {
  const results: ConflictResolutionResult[] = [];
  for (const operation of operations) {
    const { habitId, date, toCompleted } = operation.payload;
    const key = createHabitDateKey(habitId, date);
    const serverCompleted = serverStates.get(key);

    if (serverCompleted === undefined) {
      results.push(
        buildResolutionResult(
          operation.id,
          operation.payload,
          undefined,
          'sync',
          'Server state not found - proceeding with sync'
        )
      );
      continue;
    }

    const serverState: ServerCompletionState = {
      date,
      fetchedAt: Date.now(),
      habitId,
      isCompleted: serverCompleted,
    };
    const { resolution, reason } = resolveConflict(
      operation.payload,
      serverState
    );

    if (toCompleted === serverCompleted && onEvent) {
      onEvent(
        createConflictEvent('conflict:detected', {
          date,
          habitId,
          operationId: operation.id,
          reason,
          resolution,
        })
      );
      if (resolution === 'skip') {
        onEvent(
          createConflictEvent('conflict:skip_sync', {
            date,
            habitId,
            operationId: operation.id,
            reason,
            resolution,
          })
        );
      }
    }
    results.push(
      buildResolutionResult(
        operation.id,
        operation.payload,
        serverState,
        resolution,
        reason
      )
    );
  }
  return buildBatchResult(results);
}
