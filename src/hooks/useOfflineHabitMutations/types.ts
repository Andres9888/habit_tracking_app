import type { Id } from '../../../convex/_generated/dataModel';

export interface CreateHabitArgs {
  name: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  daysOfWeek?: number[];
  frequency?: string;
  goalDuration?: number;
  notes?: string;
  preferredTime?: string;
  remindersEnabled?: boolean;
  reminderTime?: string;
  reminderSound?: string;
  strengthAlgorithm?: 'forgiving' | 'balanced' | 'strict';
}

export interface UpdateHabitArgs {
  habitId: Id<'habits'>;
  name?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  notes?: string;
  preferredTime?: string;
  remindersEnabled?: boolean;
  reminderTime?: string;
  reminderSound?: string;
}

export interface MutationResult {
  queued: boolean;
  offlineOperationId?: string;
  result?: unknown;
  tempId?: string;
}

export type HabitId = Id<'habits'>;
export type NamedHabitOperationType = 'archiveHabit' | 'pauseHabit';
