/**
 * Conflict Resolution Logic
 *
 * Pure functions for conflict detection and resolution.
 * Implements FR-010: completion wins strategy.
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type { ToggleCompletionPayload } from '../../queue';
import type {
  ConflictResolution,
  ConflictResolutionResult,
  ServerCompletionState,
} from './types';

/**
 * Create a unique key for a habit+date combination
 */
export function createHabitDateKey(
  habitId: Id<'habits'>,
  date: string
): string {
  return `${habitId}:${date}`;
}

/**
 * Parse a habit+date key back into components
 */
export function parseHabitDateKey(key: string): {
  habitId: string;
  date: string;
} {
  const [habitId = '', date = ''] = key.split(':');
  return { date, habitId };
}

/**
 * Determine if there is a conflict between offline operation and server state.
 *
 * A conflict exists when the desired state already exists on the server.
 */
export function detectConflict(
  offlinePayload: ToggleCompletionPayload,
  serverState: ServerCompletionState
): boolean {
  return offlinePayload.toCompleted === serverState.isCompleted;
}

/**
 * Resolve a conflict using the "completion wins" strategy (FR-010).
 *
 * Rules:
 * 1. If offline wants to complete AND server is already complete → SKIP
 * 2. If offline wants to complete AND server is NOT complete → SYNC
 * 3. If offline wants to uncomplete AND server is complete → SYNC
 * 4. If offline wants to uncomplete AND server is NOT complete → SKIP
 */
export function resolveConflict(
  offlinePayload: ToggleCompletionPayload,
  serverState: ServerCompletionState
): { resolution: ConflictResolution; reason: string } {
  const { toCompleted } = offlinePayload;
  const { isCompleted: serverCompleted } = serverState;

  if (toCompleted && serverCompleted) {
    return {
      reason: 'Completion already exists on server (completion wins)',
      resolution: 'skip',
    };
  }

  if (toCompleted && !serverCompleted) {
    return {
      reason: 'Server needs to be marked complete',
      resolution: 'sync',
    };
  }

  if (!toCompleted && serverCompleted) {
    return {
      reason: 'Server needs to be toggled to incomplete',
      resolution: 'sync',
    };
  }

  // !toCompleted && !serverCompleted
  return {
    reason: 'Server already shows incomplete (state achieved)',
    resolution: 'skip',
  };
}

/**
 * Build a conflict resolution result
 */
export function buildResolutionResult(
  operationId: string,
  payload: ToggleCompletionPayload,
  serverState: ServerCompletionState | undefined,
  resolution: ConflictResolution,
  reason: string
): ConflictResolutionResult {
  const hasConflict = serverState
    ? detectConflict(payload, serverState)
    : false;

  return { hasConflict, operationId, payload, reason, resolution, serverState };
}
