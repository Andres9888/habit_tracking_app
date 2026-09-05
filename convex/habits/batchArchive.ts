/** Batch Archive / Unarchive — archive or restore multiple habits at once */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { enforceRateLimit } from '../lib/rateLimit';
import { loadOwnedHabitsForBatch } from './batchGuards';
import { findMaxOrder } from './utils';

export const batchArchive = mutation({
  args: { habitIds: v.array(v.id('habits')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new Error('Unauthenticated: Must be logged in to archive habits');
    await enforceRateLimit(ctx, identity.subject, 'habit.batch');

    // Pre-flight: validate size + ownership of every id before patching any.
    const habits = await loadOwnedHabitsForBatch(
      ctx,
      identity.subject,
      args.habitIds,
      'archive'
    );

    const now = Date.now();
    let archivedCount = 0;

    for (const habit of habits) {
      await ctx.db.patch(habit._id, { archived: true, archivedAt: now });
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
    if (!identity)
      throw new Error('Unauthenticated: Must be logged in to unarchive habits');
    await enforceRateLimit(ctx, identity.subject, 'habit.batch');

    // Read only to place the restored habits at the end of the list.
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();
    // Pre-flight: validate size + ownership of every id before patching any.
    const habitsToUnarchive = await loadOwnedHabitsForBatch(
      ctx,
      identity.subject,
      args.habitIds,
      'unarchive'
    );

    let nextOrder = findMaxOrder(activeHabits) + 1;
    let unarchivedCount = 0;

    for (const habit of habitsToUnarchive) {
      await ctx.db.patch(habit._id, {
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
