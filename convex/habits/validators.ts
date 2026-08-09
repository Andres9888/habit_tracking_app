/**
 * Habit Validators
 * Return type validators for queries
 */
import { v } from 'convex/values';

import { progressEmojisValidator } from '../lib/progressEmojisValidator';

/** Full habit object validator - used in query returns */
export const fullHabitValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('habits'),
  accessibility: v.optional(v.number()),
  accessibilityAtPause: v.optional(v.number()),
  accessibilityDecayParam: v.optional(v.number()),
  accessibilityGainBehavior: v.optional(v.number()),
  accessibilityGainReminder: v.optional(v.number()),
  accessibilityUpdatedAt: v.optional(v.number()),
  archived: v.optional(v.boolean()),
  archivedAt: v.optional(v.number()),
  // Legacy stale field on some habit rows; field was removed from schema but
  // pre-existing rows still carry it. Allowed through as v.any() to unblock
  // the list query — clean up via a one-off mutation when convenient.
  benefits: v.optional(v.any()),
  bestStreak: v.optional(v.number()),
  consecutiveDays: v.optional(v.number()),
  createdAt: v.number(),
  cueAfterBehavior: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueTime: v.optional(v.string()),
  currentStreak: v.optional(v.number()),
  daysOfWeek: v.optional(v.array(v.number())),
  frequency: v.optional(v.string()),
  goalDuration: v.optional(v.number()),
  goalUnit: v.optional(v.string()),
  growthType: v.optional(
    v.union(v.literal('simple'), v.literal('average'), v.literal('complex'))
  ),
  // Legacy fields retained on older docs; not written by current code
  dailyMinutesGoal: v.optional(v.number()),
  weeklyMinutesGoal: v.optional(v.number()),
  habitDecayParam: v.optional(v.number()),
  habitGainParam: v.optional(v.number()),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  iconColor: v.optional(v.string()),
  identity: v.optional(v.string()),
  lastCompletedDate: v.optional(v.string()),
  lastPredictionAt: v.optional(v.number()),
  name: v.string(),
  notes: v.optional(v.string()),
  order: v.optional(v.number()),
  paused: v.optional(v.boolean()),
  pausedAt: v.optional(v.number()),
  pendingStrengthRecalcId: v.optional(v.id('_scheduled_functions')),
  pendingStrengthRecalcRequestedAt: v.optional(v.number()),
  predictedCompletionProb: v.optional(v.number()),
  preferredTime: v.optional(v.string()),
  progressEmojis: v.optional(progressEmojisValidator),
  remindersEnabled: v.optional(v.boolean()),
  reminderSound: v.optional(v.string()),
  reminderTime: v.optional(v.string()),
  resumedAt: v.optional(v.number()),
  scienceNote: v.optional(v.any()),
  strength: v.optional(v.number()),
  strengthAlgorithm: v.optional(
    v.union(v.literal('forgiving'), v.literal('balanced'), v.literal('strict'))
  ),
  strengthAtPause: v.optional(v.number()),
  strengthLevel: v.optional(v.string()),
  strengthUpdatedAt: v.optional(v.number()),
  tags: v.optional(v.array(v.string())),
  totalCompletions: v.optional(v.number()),
  totalMisses: v.optional(v.number()),
  userId: v.optional(v.string()),
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

/** Tracking record validator */
export const trackingRecordValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('tracking'),
  completed: v.boolean(),
  date: v.string(),
  habitId: v.id('habits'),
  kind: v.optional(v.union(v.literal('full'), v.literal('minimal'))),
  // Legacy minutes completion value from removed minutes-goal feature.
  minutes: v.optional(v.number()),
  note: v.optional(v.string()),
  userId: v.optional(v.string()),
});
