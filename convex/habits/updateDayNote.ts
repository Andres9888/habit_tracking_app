import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { enforceRateLimit } from '../lib/rateLimit';
import { validateLongText } from '../lib/inputValidation';
import { assertNoteDateAllowed } from './dayNoteDate';

export { isValidDateKey } from './dayNoteDate';

export const listDayNotes = query({
  args: { habitId: v.id('habits') },
  returns: v.array(v.object({ date: v.string(), note: v.string() })),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) return [];

    const notes = await ctx.db
      .query('habitDayNotes')
      .withIndex('by_habitId_and_date', (q) => q.eq('habitId', args.habitId))
      .take(2000);

    return notes.map(({ date, note }) => ({ date, note }));
  },
});

export const updateDayNote = mutation({
  args: {
    date: v.string(),
    habitId: v.id('habits'),
    note: v.string(),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update day notes');
    }
    assertNoteDateAllowed(args.date, args.timezone);

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    await enforceRateLimit(ctx, identity.subject, 'habit.update');

    const checked = validateLongText(args.note, undefined, 'Note');
    if (!checked.isValid) throw new Error(checked.error ?? 'Invalid note');

    const text = (checked.sanitized ?? '').trim();
    const existing = await ctx.db
      .query('habitDayNotes')
      .withIndex('by_habitId_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    if (!text) {
      if (existing) await ctx.db.delete(existing._id);
      return null;
    }

    if (existing) {
      await ctx.db.patch(existing._id, { note: text, updatedAt: Date.now() });
    } else {
      await ctx.db.insert('habitDayNotes', {
        date: args.date,
        habitId: args.habitId,
        note: text,
        updatedAt: Date.now(),
        userId: identity.subject,
      });
    }
    return null;
  },
  returns: v.null(),
});
