/**
 * Letters type definitions and validators
 */

import { v } from 'convex/values';

/**
 * Letter object validator for return types
 */
export const letterObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('letters'),
  content: v.string(),
  createdAt: v.number(),
  habitId: v.id('habits'),
  isRead: v.boolean(),
  title: v.optional(v.string()),
  unlockAt: v.number(),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});

/**
 * Letter statistics return type
 */
export const letterStatsValidator = v.object({
  locked: v.number(),
  read: v.number(),
  total: v.number(),
  unlocked: v.number(),
  unread: v.number(),
});
