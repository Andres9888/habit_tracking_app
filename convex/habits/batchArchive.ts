/** Batch Archive / Unarchive — archive or restore multiple habits at once */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { findMaxOrder } from './utils';

export const batchArchive = mutation({
  args: { habitIds: v.array(v.id('habits')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated: Must be logged in to archive habits');

    const now = Date.now();
    let archivedCount = 0;

    for (const habitId of args.habitIds) {
      const habit = await ctx.db.get(habitId);
      if (!habit) continue;
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to archive this habit');
      }
      await ctx.db.patch(habitId, { archived: true, archivedAt: now });
      archivedCount++;
    }

    return { archivedCount };
  },
  returns: v.object({ archivedCount: v.number() }),
});

export const batchUnarchive = mutation({
  args: { habitIds: v.array(v.id('habits')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated: Must be logged in to unarchive habits');

    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();
    let nextOrder = findMaxOrder(activeHabits) + 1;
    let unarchivedCount = 0;

    for (const habitId of args.habitIds) {
      const habit = await ctx.db.get(habitId);
      if (!habit) continue;
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to unarchive this habit');
      }
      await ctx.db.patch(habitId, {
        archived: false,
        archivedAt: undefined,
        order: nextOrder++,
      });
      unarchivedCount++;
    }

    return { unarchivedCount };
  },
  returns: v.object({ unarchivedCount: v.number() }),
});
