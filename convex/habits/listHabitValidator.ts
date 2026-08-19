import { v } from 'convex/values';

import { progressEmojisValidator } from '../lib/progressEmojisValidator';

/** Slim habit object returned by habits.list for list-driven UI. */
export const listHabitValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('habits'),
  archived: v.optional(v.boolean()),
  archivedAt: v.optional(v.number()),
  bestStreak: v.optional(v.number()),
  color: v.optional(v.string()),
  createdAt: v.number(),
  currentStreak: v.optional(v.number()),
  daysOfWeek: v.optional(v.array(v.number())),
  frequency: v.optional(v.string()),
  goalDuration: v.optional(v.number()),
  goalUnit: v.optional(v.string()),
  growthType: v.optional(
    v.union(v.literal('simple'), v.literal('average'), v.literal('complex'))
  ),
  icon: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  lastCompletedDate: v.optional(v.string()),
  name: v.string(),
  order: v.optional(v.number()),
  paused: v.optional(v.boolean()),
  pausedAt: v.optional(v.number()),
  preferredTime: v.optional(v.string()),
  progressEmojis: v.optional(progressEmojisValidator),
  remindersEnabled: v.optional(v.boolean()),
  reminderSound: v.optional(v.string()),
  reminderTime: v.optional(v.string()),
  resumedAt: v.optional(v.number()),
  strength: v.optional(v.number()),
  strengthAlgorithm: v.optional(
    v.union(v.literal('forgiving'), v.literal('balanced'), v.literal('strict'))
  ),
  strengthLevel: v.optional(v.string()),
  strengthUpdatedAt: v.optional(v.number()),
  totalCompletions: v.optional(v.number()),
});
