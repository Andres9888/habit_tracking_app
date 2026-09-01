/**
 * Habit Argument Types
 * Mutation argument validators for habits module
 */
import { v } from 'convex/values';

import { progressEmojisValidator } from '../lib/progressEmojisValidator';

// Re-export validators for convenience
export { fullHabitValidator, trackingRecordValidator } from './validators';
export { listHabitValidator } from './listHabitValidator';

/** Create habit args validator */
export const createHabitArgs = {
  cueAfterBehavior: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueTime: v.optional(v.string()),
  daysOfWeek: v.optional(v.array(v.number())),
  frequency: v.optional(v.string()),
  goalDuration: v.optional(v.number()),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  name: v.string(),
  notes: v.optional(v.string()),
  preferredTime: v.optional(v.string()),
  progressEmojis: v.optional(progressEmojisValidator),
  remindersEnabled: v.optional(v.boolean()),
  reminderSound: v.optional(v.string()),
  reminderTime: v.optional(v.string()),
  strengthAlgorithm: v.optional(
    v.union(v.literal('forgiving'), v.literal('balanced'), v.literal('strict'))
  ),
  why: v.optional(v.string()),
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
  color: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  identity: v.optional(v.string()),
  name: v.optional(v.string()),
  notes: v.optional(v.string()),
  preferredTime: v.optional(v.string()),
  progressEmojis: v.optional(progressEmojisValidator),
  remindersEnabled: v.optional(v.boolean()),
  reminderSound: v.optional(v.string()),
  reminderTime: v.optional(v.string()),
  strengthAlgorithm: v.optional(
    v.union(v.literal('forgiving'), v.literal('balanced'), v.literal('strict'))
  ),
  why: v.optional(v.string()),
  woopObstacle: v.optional(v.string()),
  woopOutcome: v.optional(v.string()),
  woopPlan: v.optional(v.string()),
  woopWish: v.optional(v.string()),
};
