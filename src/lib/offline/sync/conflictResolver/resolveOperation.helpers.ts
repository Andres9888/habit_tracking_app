/**
 * Resolve Operation Helpers
 *
 * Timeout and event emission utilities for conflict resolution.
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type {
  CompletionStateChecker,
  ConflictEventListener,
  ConflictResolution,
} from './types';
import { createConflictEvent } from './helpers';

export async function checkWithTimeout(
  check: CompletionStateChecker,
  habitId: Id<'habits'>,
  date: string,
  timeout: number
): Promise<boolean | null> {
  return Promise.race([
    check(habitId, date),
    new Promise<null>((_, reject) =>
      setTimeout(
        () => reject(new Error('Server state check timed out')),
        timeout
      )
    ),
  ]);
}

export function emitConflictEvents(
  opId: string,
  habitId: Id<'habits'>,
  date: string,
  resolution: ConflictResolution,
  reason: string,
  onEvent: ConflictEventListener
): void {
  onEvent(
    createConflictEvent('conflict:detected', {
      date,
      habitId,
      operationId: opId,
      reason,
      resolution,
    })
  );
  if (resolution === 'skip')
    onEvent(
      createConflictEvent('conflict:skip_sync', {
        date,
        habitId,
        operationId: opId,
        reason,
        resolution,
      })
    );
}
