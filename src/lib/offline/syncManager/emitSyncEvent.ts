/**
 * Sync Event Emission
 * Utility for broadcasting sync events to listeners
 */

import type { SyncEvent, SyncEventType } from '../types';
import type { SyncEventListener } from './types';

export function emitSyncEvent(
  listeners: Set<SyncEventListener>,
  type: SyncEventType,
  data?: Record<string, unknown>
): void {
  const event: SyncEvent = { data, timestamp: Date.now(), type };
  for (const l of listeners) {
    try {
      l(event);
    } catch {
      /* ignore */
    }
  }
}
