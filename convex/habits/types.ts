/**
 * Habit Argument Types
 * Mutation argument validators for habits module
 */
import { v } from 'convex/values';

// Re-export validators for convenience
export { fullHabitValidator, trackingRecordValidator } from './validators';

/** Create habit args validator */
export const createHabitArgs = {
  cueAfterBehavior: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueTime: v.optional(v.string()),
  daysOfWeek: v.optional(v.array(v.number())),
  frequency: v.optional(v.string()),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  name: v.string(),
  notes: v.optional(v.string()),
  preferredTime: v.optional(v.string()),
  remindersEnabled: v.optional(v.boolean()),
  reminderSound: v.optional(v.string()),
  reminderTime: v.optional(v.string()),
};

/** Validator for habit data returned by remove (used by restore) */
export const removedHabitDataValidator = v.object({
  color: v.optional(v.string()),
  createdAt: v.number(),
  cueAfterBehavior: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueTime: v.optional(v.string()),
  daysOfWeek: v.optional(v.array(v.number())),
  frequency: v.optional(v.string()),
  goalDuration: v.optional(v.number()),
  goalUnit: v.optional(v.string()),
  icon: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  identity: v.optional(v.string()),
  name: v.string(),
  notes: v.optional(v.string()),
  preferredTime: v.optional(v.string()),
  remindersEnabled: v.optional(v.boolean()),
  reminderSound: v.optional(v.string()),
  reminderTime: v.optional(v.string()),
  strength: v.optional(v.number()),
  strengthLevel: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  vizFailureBody: v.optional(v.string()),
  vizFailureEmotion: v.optional(v.string()),
  vizFailureMind: v.optional(v.string()),
  vizSuccessBody: v.optional(v.string()),
  vizSuccessEmotion: v.optional(v.string()),
  vizSuccessMind: v.optional(v.string()),
  why: v.optional(v.string()),
  woopObstacle: v.optional(v.string()),
  woopOutcome: v.optional(v.string()),
  woopPlan: v.optional(v.string()),
  woopWish: v.optional(v.string()),
});

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
  color: v.optional(v.string()),
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
