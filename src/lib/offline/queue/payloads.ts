/**
 * Offline Queue Operation Payloads
 *
 * Payload shapes for each queued habit/settings operation. Split from types.ts
 * to keep both files within the readability line budget.
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type { ProgressEmojiSet } from '../../../utils/progressEmojis';

/** Payload for toggle completion operation */
export interface ToggleCompletionPayload {
  habitId: Id<'habits'>;
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Marking complete (true) or incomplete (false) */
  toCompleted: boolean;
}

/** Payload for create habit operation */
export interface CreateHabitPayload {
  /** Temporary local id for optimistic updates */
  tempId: string;
  name: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  notes?: string;
  preferredTime?: string;
  frequency?: string;
  daysOfWeek?: number[];
  goalDuration?: number;
  strengthAlgorithm?: 'forgiving' | 'balanced' | 'strict';
  progressEmojis?: ProgressEmojiSet;
  remindersEnabled?: boolean;
  reminderTime?: string;
  reminderSound?: string;
}

/** Payload for update habit operation */
export interface UpdateHabitPayload {
  habitId: Id<'habits'>;
  updates: {
    name?: string;
    icon?: string;
    color?: string;
    iconColor?: string;
    notes?: string;
    preferredTime?: string;
    frequency?: string;
    daysOfWeek?: number[];
    goalDuration?: number;
    strengthAlgorithm?: 'forgiving' | 'balanced' | 'strict';
    progressEmojis?: ProgressEmojiSet;
    remindersEnabled?: boolean;
    reminderTime?: string;
    reminderSound?: string;
  };
}

/** Payload for archive habit operation */
export interface ArchiveHabitPayload {
  habitId: Id<'habits'>;
  /** Display name captured at enqueue time */
  habitName?: string;
  /** Archive (true) or unarchive (false). Defaults to true on replay. */
  toArchived?: boolean;
}

/** Payload for pause habit operation */
export interface PauseHabitPayload {
  habitId: Id<'habits'>;
  /** Display name captured at enqueue time */
  habitName?: string;
  /** Pause (true) or resume (false). Defaults to true on replay. */
  toPaused?: boolean;
}

/** Payload for remove habit operation */
export interface RemoveHabitPayload {
  habitId: Id<'habits'>;
  /** Display name captured at enqueue time */
  habitName?: string;
}

/**
 * Payload for update settings operation. Carries the full sanitized settings
 * document (coalesced to a single whole-document last-write-wins entry).
 */
export interface UpdateSettingsPayload {
  settings: Record<string, unknown>;
}

/** Union of all offline operation payloads */
export type OfflineOperationPayload =
  | ToggleCompletionPayload
  | CreateHabitPayload
  | UpdateHabitPayload
  | ArchiveHabitPayload
  | PauseHabitPayload
  | RemoveHabitPayload
  | UpdateSettingsPayload;
