/**
 * Vision Board Images validators
 */

import { v } from 'convex/values';

/**
 * Vision board image object validator for return types (with resolved URL)
 */
export const visionBoardImageObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('visionBoardImages'),
  caption: v.optional(v.string()),
  createdAt: v.number(),
  habitId: v.id('habits'),
  imageUrl: v.union(v.string(), v.null()),
  order: v.number(),
  storageId: v.id('_storage'),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});

/**
 * Vision board image as stored in DB (no resolved URL)
 */
export const visionBoardImageDbValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('visionBoardImages'),
  caption: v.optional(v.string()),
  createdAt: v.number(),
  habitId: v.id('habits'),
  imageUrl: v.optional(v.string()),
  order: v.number(),
  storageId: v.id('_storage'),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});
