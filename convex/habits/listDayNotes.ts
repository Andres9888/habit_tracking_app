import { v } from 'convex/values';
import { query } from '../_generated/server';
import { mergeDayNotes } from './mergeDayNotes';

export const listDayNotes = query({
  args: { habitId: v.id('habits') },
  returns: v.array(v.object({ date: v.string(), note: v.string() })),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) return [];

    const stored = await ctx.db
      .query('habitDayNotes')
      .withIndex('by_habitId_and_date', (q) => q.eq('habitId', args.habitId))
      .take(2000);
    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .take(2000);

    return mergeDayNotes(
      stored.map(({ date, note }) => ({ date, note })),
      tracking.map(({ date, note }) => ({ date, note }))
    );
  },
});
