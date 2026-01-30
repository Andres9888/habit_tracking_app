import { v } from 'convex/values';

/**
 * Notes module validators
 */

/** Validator for note object returned from queries */
export const noteValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('notes'),
  body: v.string(),
  createdAt: v.number(),
  date: v.string(),
  habitId: v.optional(v.id('habits')),
  updatedAt: v.number(),
  userId: v.optional(v.string()),
});

/** Validator for nullable note (used in get query) */
export const nullableNoteValidator = v.union(v.null(), noteValidator);

/** Validator for array of notes */
export const notesArrayValidator = v.array(noteValidator);

/** Maximum body length for notes */
export const MAX_NOTE_BODY_LENGTH = 1000;

/** Date format regex (YYYY-MM-DD) */
export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
