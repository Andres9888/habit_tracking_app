/* eslint-disable max-lines */
/**
 * Batch Resolution Helpers
 *
 * Helper functions for batch conflict resolution.
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

/** Build results from server state map */
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

/** Handle batch error with fail-safe sync */
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
