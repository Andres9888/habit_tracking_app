/* eslint-disable max-lines -- Central queue payload and operation type registry. */

/**
 * Offline Queue Types
 *
 * Types for queuing habit operations while offline, with automatic sync
 * when connectivity returns. See spec: docs/offline-habit-sync.md
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';
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
 */
export type OfflineOperationType =
  | 'toggleCompletion'
  | 'createHabit'
  | 'updateHabit'
  | 'archiveHabit'
  | 'pauseHabit'
  | 'removeHabit';

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
 * Payload for create habit operation
 */
export interface CreateHabitPayload {
  /** Temporary local ID for optimistic updates (format: temp_{timestamp}_{random}) */
  tempId: string;
  /** Habit name */
  name: string;
  /** Optional icon/emoji */
  icon?: string;
  /** Optional color */
  color?: string;
  /** Optional icon color */
  iconColor?: string;
  /** Optional notes */
  notes?: string;
  /** Optional preferred time */
  preferredTime?: string;
  /** Growth emoji set captured from the current user default. */
  progressEmojis?: ProgressEmojiSet;
  /** Optional frequency/cadence */
  frequency?: string;
  /** Optional weekly day selection */
  daysOfWeek?: number[];
  /** Optional streak goal */
  goalDuration?: number;
  /** Optional strength algorithm */
  strengthAlgorithm?: 'forgiving' | 'balanced' | 'strict';
  /** Whether reminders are enabled */
  remindersEnabled?: boolean;
  /** Optional reminder time */
  reminderTime?: string;
  /** Optional reminder sound */
  reminderSound?: string;
}

/**
 * Payload for update habit operation
 */
export interface UpdateHabitPayload {
  /** ID of the habit being updated */
  habitId: Id<'habits'>;
  /** Updated fields */
  updates: {
    name?: string;
    icon?: string;
    color?: string;
    iconColor?: string;
    notes?: string;
    preferredTime?: string;
    remindersEnabled?: boolean;
    reminderTime?: string;
    reminderSound?: string;
  };
}

/**
 * Payload for archive habit operation
 */
export interface ArchiveHabitPayload {
  /** ID of the habit being archived */
  habitId: Id<'habits'>;
  /** Display name captured at enqueue time */
  habitName?: string;
}

/**
 * Payload for pause habit operation
 */
export interface PauseHabitPayload {
  /** ID of the habit being paused */
  habitId: Id<'habits'>;
  /** Display name captured at enqueue time */
  habitName?: string;
}

/**
 * Payload for remove habit operation
 */
export interface RemoveHabitPayload {
  /** ID of the habit being removed */
  habitId: Id<'habits'>;
  /** Display name captured at enqueue time. */
  habitName?: string;
}

/**
 * Union of all offline operation payloads
 */
export type OfflineOperationPayload =
  | ToggleCompletionPayload
  | CreateHabitPayload
  | UpdateHabitPayload
  | ArchiveHabitPayload
  | PauseHabitPayload
  | RemoveHabitPayload;

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
