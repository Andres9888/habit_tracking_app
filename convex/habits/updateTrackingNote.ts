/**
 * Update the journal note on a completed tracking row.
 * Refuses to create a completion — the day must already be logged.
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
  MAX_LONG_TEXT_LENGTH,
  requireValid,
  validateLongText,
} from '../lib/inputValidation';
import { enforceRateLimit } from '../lib/rateLimit';
import { updateTrackingNoteGuard } from './updateTrackingNoteGuard';
import { isValidDateFormat } from './utils';

export const updateTrackingNote = mutation({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
    note: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update notes');
    }
    if (!isValidDateFormat(args.date)) {
      throw new Error('Invalid date format; expected YYYY-MM-DD');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    await enforceRateLimit(ctx, identity.subject, 'habit.update');

    const existing = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    const guardError = updateTrackingNoteGuard({
      completed: existing?.completed ?? false,
      exists: Boolean(existing),
    });
    if (guardError) throw new Error(guardError);

    const trimmed = args.note.trim();
    const note =
      trimmed.length === 0
        ? undefined
        : requireValid(
            validateLongText(trimmed, MAX_LONG_TEXT_LENGTH, 'Note'),
            trimmed
          );

    await ctx.db.patch(existing!._id, { note });
    return null;
  },
});
