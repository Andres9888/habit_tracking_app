import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { enforceRateLimit } from '../lib/rateLimit';
import { validateLongText } from '../lib/inputValidation';

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidDateKey(value: string): boolean {
  const match = DATE_KEY.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    year >= 1900 &&
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update day notes');
    }
    if (!isValidDateKey(args.date)) {
      throw new Error('Invalid date');
    }

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

    // Separate branches keep insert and patch payloads type-safe.
    // eslint-disable-next-line unicorn/prefer-ternary
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
