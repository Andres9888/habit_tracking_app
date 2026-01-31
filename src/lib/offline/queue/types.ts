/**
 * Offline Queue Types
 *
 * Types for queuing habit operations while offline, with automatic sync
 * when connectivity returns. See spec: docs/offline-habit-sync.md
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { ErrorCategory } from '../types';

/**
 * Status of an offline operation in the queue
 */
export type OfflineOperationStatus =
  | 'pending' // Queued, waiting to sync
  | 'syncing' // Currently being synced
  | 'completed' // Successfully synced to server
  | 'failed'; // Failed after max retries (permanent failure)

/**
 * Types of operations that can be queued offline
 * MVP scope: only habit completion toggling
 */
export type OfflineOperationType = 'toggleCompletion';

/**
 * Payload for toggle completion operation
 */
export interface ToggleCompletionPayload {
  /** ID of the habit being toggled */
  habitId: Id<'habits'>;
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Whether the habit is being marked complete (true) or incomplete (false) */
  toCompleted: boolean;
}

/**
 * Union of all offline operation payloads
 * Extensible for future offline operations (archive, pause, etc.)
 */
export type OfflineOperationPayload = ToggleCompletionPayload;

/**
 * A single offline operation in the queue
 *
 * Represents a mutation that occurred while offline and needs to sync
 * when connectivity returns. Operations are processed FIFO.
 */
export interface OfflineOperation<
  T extends OfflineOperationType = OfflineOperationType,
> {
  /** Unique operation ID (format: op_{timestamp}_{random}) */
  id: string;

  /** Type of operation */
  type: T;

  /** Operation payload (type depends on operation type) */
  payload: T extends 'toggleCompletion'
    ? ToggleCompletionPayload
    : OfflineOperationPayload;

  /** Current status of the operation */
  status: OfflineOperationStatus;

  /** Timestamp when operation was created (ms since epoch) */
  createdAt: number;

  /** Timestamp when operation last attempted sync (ms since epoch) */
  lastAttemptAt?: number;

  /** Number of sync attempts made */
  retryCount: number;

  /** Error message from last failed attempt */
  lastError?: string;

  /** Error category from last failed attempt */
  lastErrorCategory?: ErrorCategory;
}

/**
 * Typed helper for toggle completion operations
 */
export type ToggleCompletionOperation = OfflineOperation<'toggleCompletion'>;
