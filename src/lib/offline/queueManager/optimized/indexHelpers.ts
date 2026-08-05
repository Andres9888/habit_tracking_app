/**
 * Operation Index Helpers
 *
 * Map-based indexing for O(1) lookups instead of O(n) array scans.
 *
 * @see docs/offline-habit-sync.md FR-011 (handle 500+ operations)
 */

import type { OfflineOperation, ToggleCompletionPayload } from '../../queue';
import type { OperationIndex } from './types';

/** Build index from operations array */
export function buildOperationIndex(
  operations: OfflineOperation[]
): OperationIndex {
  const byId = new Map<string, number>();
  const byDedupeKey = new Map<string, string>();

  for (const [i, op] of operations.entries()) {
    byId.set(op.id, i);

    if (op.type === 'toggleCompletion') {
      const payload = op.payload as ToggleCompletionPayload;
      const key = `toggle:${payload.habitId}:${payload.date}`;
      byDedupeKey.set(key, op.id);
    }
  }

  return { byDedupeKey, byId };
}

/** Find operation index in O(1) using pre-built index */
export function findOperationIndexOptimized(
  index: OperationIndex,
  operationId: string
): number {
  return index.byId.get(operationId) ?? -1;
}

/** Check if duplicate exists in O(1) */
export function hasDuplicateOptimized(
  index: OperationIndex,
  habitId: string,
  date: string
): { exists: boolean; operationId?: string } {
  const key = `toggle:${habitId}:${date}`;
  const existingId = index.byDedupeKey.get(key);
  return { exists: existingId !== undefined, operationId: existingId };
}
