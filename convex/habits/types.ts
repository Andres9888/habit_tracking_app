/**
 * Habit Argument Types
 * Mutation argument validators for habits module
 */
import { v } from 'convex/values';

// Re-export validators for convenience
export { fullHabitValidator, trackingRecordValidator } from './validators';

/** Data export type for CSV export */
export interface DataExport {
  habitName: string;
  date: string;
  completed: boolean;
  streak: number;
  notes: string;
}

/** Validator for data export records */
export const dataExportValidator = v.object({
  habitName: v.string(),
  date: v.string(),
  completed: v.boolean(),
  streak: v.number(),
  notes: v.string(),
});

/** Create habit args validator */
export const createHabitArgs = {
  cueAfterBehavior: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueTime: v.optional(v.string()),
  icon: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  name: v.string(),
  notes: v.optional(v.string()),
  preferredTime: v.optional(v.string()),
  remindersEnabled: v.optional(v.boolean()),
  reminderSound: v.optional(v.string()),
  reminderTime: v.optional(v.string()),
};

/** Update habit args validator */
export const updateHabitArgs = {
  cueAfterBehavior: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueTime: v.optional(v.string()),
  daysOfWeek: v.optional(v.array(v.number())),
  frequency: v.optional(v.string()),
  goalDuration: v.optional(v.number()),
  goalUnit: v.optional(v.string()),
  habitId: v.id('habits'),
  icon: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  identity: v.optional(v.string()),
  name: v.optional(v.string()),
  notes: v.optional(v.string()),
  preferredTime: v.optional(v.string()),
  remindersEnabled: v.optional(v.boolean()),
  reminderSound: v.optional(v.string()),
  reminderTime: v.optional(v.string()),
  why: v.optional(v.string()),
};
