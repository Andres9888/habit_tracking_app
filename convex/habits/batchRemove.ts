/** Batch Remove — permanently delete multiple habits and their tracking data */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const batchRemove = mutation({
  args: { habitIds: v.array(v.id('habits')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated: Must be logged in to delete habits');

    let deletedCount = 0;

    for (const habitId of args.habitIds) {
      const habit = await ctx.db.get(habitId);
      if (!habit) continue;
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to delete this habit');
      }

      // Delete all tracking records for this habit
      const records = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habitId))
        .collect();
      for (const record of records) {
        await ctx.db.delete(record._id);
      }

      await ctx.db.delete(habitId);
      deletedCount++;
    }

    return { deletedCount };
  },
  returns: v.object({ deletedCount: v.number() }),
});
