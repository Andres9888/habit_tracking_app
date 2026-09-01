import type { Habit } from '../types';

export const CONFIRMED_PENDING_TTL_MS = 4000;
export const MATCH_LOOKBACK_MS = 15_000;
export const OPTIMISTIC_HABIT_ID_PREFIX = 'temp_habit_';

export interface OptimisticHabitCreateInput {
  color: string;
  daysOfWeek?: number[];
  frequency?: string;
  icon?: string;
  iconColor?: string;
  name: string;
  preferredTime?: string;
  reminderSound?: string;
  reminderTime?: string;
  remindersEnabled: boolean;
  tempId?: string;
}

export interface PendingCreatedHabitRecord {
  confirmedAt: number | null;
  matchKey: string;
  submittedAt: number;
  tempHabit: Habit;
}

export interface ReconciledHabitCreation {
  serverHabit: Habit;
  tempHabit: Habit;
}

export type PendingCreatedHabitSnapshot = Habit[];
export type StoreListener = () => void;
