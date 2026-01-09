/**
 * Convex return type validators for affirmations API
 */

import { v } from 'convex/values';

/**
 * Basic affirmation return type (for listByHabit)
 */
export const basicAffirmationReturn = v.object({
  _creationTime: v.number(),
  _id: v.id('affirmations'),
  createdAt: v.number(),
  habitId: v.id('habits'),
  text: v.string(),
  type: v.optional(
    v.union(
      v.literal('identity'),
      v.literal('motivational'),
      v.literal('instructional')
    )
  ),
  updatedAt: v.number(),
  userId: v.optional(v.string()),
});

/**
 * Full affirmation return type (for get and listScheduled)
 * Includes schedule-related fields
 */
export const fullAffirmationReturn = v.object({
  _creationTime: v.number(),
  _id: v.id('affirmations'),
  createdAt: v.number(),
  daysOfWeek: v.optional(v.array(v.number())),
  frequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'))),
  habitId: v.id('habits'),
  isScheduleEnabled: v.optional(v.boolean()),
  lastDeliveredAt: v.optional(v.number()),
  notificationId: v.optional(v.string()),
  scheduledTime: v.optional(v.string()),
  text: v.string(),
  type: v.optional(
    v.union(
      v.literal('identity'),
      v.literal('motivational'),
      v.literal('instructional')
    )
  ),
  updatedAt: v.number(),
  userId: v.optional(v.string()),
});

/**
 * Generated affirmation return type (for AI generation)
 */
export const generatedAffirmationReturn = v.object({
  text: v.string(),
  type: v.union(
    v.literal('identity'),
    v.literal('motivational'),
    v.literal('instructional')
  ),
});
