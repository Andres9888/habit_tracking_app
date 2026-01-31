/**
 * Conflict Resolution Result Builders
 *
 * Helper functions for building batch results and events.
 */

import type {
  BatchConflictResolutionResult,
  ConflictEvent,
  ConflictEventType,
  ConflictResolutionResult,
} from './types';

/** Build a batch result from individual resolution results */
export function buildBatchResult(
  results: ConflictResolutionResult[]
): BatchConflictResolutionResult {
  let syncCount = 0;
  let skipCount = 0;
  let failCount = 0;
  let conflictsDetected = 0;
  let conflictsResolvedByCompletionWins = 0;

  for (const result of results) {
    if (result.hasConflict) {
      conflictsDetected++;
      if (result.resolution === 'skip') {
        conflictsResolvedByCompletionWins++;
      }
    }

    switch (result.resolution) {
      case 'sync': {
        syncCount++;
        break;
      }
      case 'skip': {
        skipCount++;
        break;
      }
      case 'fail': {
        failCount++;
        break;
      }
    }
  }

  return {
    conflictsDetected,
    conflictsResolvedByCompletionWins,
    failCount,
    results,
    skipCount,
    syncCount,
    total: results.length,
  };
}

/** Create a conflict event */
export function createConflictEvent(
  type: ConflictEventType,
  data: Omit<ConflictEvent['data'], 'error'> & { error?: Error }
): ConflictEvent {
  return { data, timestamp: Date.now(), type };
}

/** Create an empty batch result */
export function createEmptyBatchResult(): BatchConflictResolutionResult {
  return {
    conflictsDetected: 0,
    conflictsResolvedByCompletionWins: 0,
    failCount: 0,
    results: [],
    skipCount: 0,
    syncCount: 0,
    total: 0,
  };
}
