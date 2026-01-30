/**
 * Voice Notes type definitions and validators
 */

import { v } from 'convex/values';

/**
 * Voice note object validator for return types
 */
export const voiceNoteObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('voiceNotes'),
  audioUrl: v.string(),
  createdAt: v.number(),
  duration: v.number(),
  habitId: v.id('habits'),
  isDay1: v.optional(v.boolean()),
  label: v.optional(v.string()),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});

/**
 * Voice note with streak context for recovery mode
 */
export const voiceNoteWithStreakContextValidator = v.object({
  ...voiceNoteObjectValidator.fields,
  daysAgo: v.number(),
  streakAtRecording: v.number(),
});
