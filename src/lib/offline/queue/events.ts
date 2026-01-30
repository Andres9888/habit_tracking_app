/**
 * Offline Queue Event Types
 *
 * Types for queue event handling and callbacks.
 */

import type { OfflineOperation } from './types';
import type { OfflineQueueStats } from './state';

/**
 * Queue event types
 */
export type QueueEventType =
  | 'operation:added'
  | 'operation:updated'
  | 'operation:removed'
  | 'operation:synced'
  | 'operation:failed'
  | 'queue:cleared'
  | 'queue:restored';

/**
 * Queue event payload
 */
export interface QueueEvent {
  type: QueueEventType;
  timestamp: number;
  operationId?: string;
  operation?: OfflineOperation;
  stats?: OfflineQueueStats;
}

/**
 * Callback for queue events
 */
export type QueueEventCallback = (event: QueueEvent) => void;

/**
 * Options for adding an operation to the queue
 */
export interface QueueOperationOptions {
  /** Skip duplicate detection (default: false) */
  allowDuplicate?: boolean;

  /** Priority level (higher = process first, default: 0) */
  priority?: number;
}

/**
 * Result of a queue operation
 */
export interface QueueOperationResult {
  /** Whether the operation was successfully queued */
  success: boolean;

  /** The operation ID if successful */
  operationId?: string;

  /** Error message if failed */
  error?: string;

  /** Whether this replaced an existing operation */
  replaced?: boolean;
}
