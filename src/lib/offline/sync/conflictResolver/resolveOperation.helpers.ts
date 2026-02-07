/**
 * Resolve Operation Helpers
 *
 * Timeout and event emission utilities for conflict resolution.
 */

import type { CompletionStateChecker, ConflictEventListener } from './types';
import { createConflictEvent } from './helpers';

export async function checkWithTimeout(
  check: CompletionStateChecker,
  habitId: any,
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
  habitId: any,
  date: string,
  resolution: any,
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
