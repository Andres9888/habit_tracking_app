/**
 * Offline Queue Types
 *
 * Types for queuing habit operations while offline, with automatic sync
 * when connectivity returns. See spec: docs/offline-habit-sync.md
 */

import type { ErrorCategory } from '../types';
import type {
  ArchiveHabitPayload,
  CreateHabitPayload,
  OfflineOperationPayload,
  PauseHabitPayload,
  RemoveHabitPayload,
  ToggleCompletionPayload,
  UpdateHabitPayload,
  UpdateSettingsPayload,
} from './payloads';

export type {
  ArchiveHabitPayload,
  CreateHabitPayload,
  OfflineOperationPayload,
  PauseHabitPayload,
  RemoveHabitPayload,
  ToggleCompletionPayload,
  UpdateHabitPayload,
  UpdateSettingsPayload,
} from './payloads';

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
 */
export type OfflineOperationType =
  | 'toggleCompletion'
  | 'createHabit'
  | 'updateHabit'
  | 'archiveHabit'
  | 'pauseHabit'
  | 'removeHabit'
  | 'updateSettings';

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
    : T extends 'createHabit'
      ? CreateHabitPayload
      : T extends 'updateHabit'
        ? UpdateHabitPayload
        : T extends 'archiveHabit'
          ? ArchiveHabitPayload
          : T extends 'pauseHabit'
            ? PauseHabitPayload
            : T extends 'removeHabit'
              ? RemoveHabitPayload
              : T extends 'updateSettings'
                ? UpdateSettingsPayload
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
 * Typed helpers for specific operations
 */
export type ToggleCompletionOperation = OfflineOperation<'toggleCompletion'>;
export type CreateHabitOperation = OfflineOperation<'createHabit'>;
export type UpdateHabitOperation = OfflineOperation<'updateHabit'>;
export type ArchiveHabitOperation = OfflineOperation<'archiveHabit'>;
export type PauseHabitOperation = OfflineOperation<'pauseHabit'>;
export type RemoveHabitOperation = OfflineOperation<'removeHabit'>;
export type UpdateSettingsOperation = OfflineOperation<'updateSettings'>;
