import { v } from 'convex/values';

/**
 * Reflections module validators and constants
 */

/** Emoji type validator - matches schema definition */
export const emojiValidator = v.union(
  v.literal('fire'),
  v.literal('frustrated'),
  v.literal('happy'),
  v.literal('neutral')
);

/** Reflection object validator for return types */
export const reflectionObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('reflections'),
  createdAt: v.number(),
  date: v.string(),
  emoji: emojiValidator,
  habitId: v.id('habits'),
  note: v.optional(v.string()),
  updatedAt: v.number(),
  userId: v.optional(v.string()),
});

/** Array of reflections validator */
export const reflectionsArrayValidator = v.array(reflectionObjectValidator);

/** Nullable reflection validator */
export const nullableReflectionValidator = v.union(
  v.null(),
  reflectionObjectValidator
);

/** Maximum note length for reflections */
export const MAX_REFLECTION_NOTE_LENGTH = 500;

/** Date format regex (YYYY-MM-DD) */
export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
