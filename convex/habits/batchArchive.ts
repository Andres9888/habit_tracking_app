/** Batch Archive / Unarchive — archive or restore multiple habits at once */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { hasPremiumAccess } from '../subscriptions/premiumCheck';
import { findMaxOrder } from './utils';

const FREE_HABIT_LIMIT = 3;

export const batchArchive = mutation({
  args: { habitIds: v.array(v.id('habits')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new Error('Unauthenticated: Must be logged in to archive habits');

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
    if (!identity)
      throw new Error('Unauthenticated: Must be logged in to unarchive habits');

    const uniqueHabitIds = [...new Set(args.habitIds)];
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .filter((q) =>
        q.and(
          q.neq(q.field('archived'), true),
          q.neq(q.field('formed'), true)
        )
      )
      .collect();
    const habitsToUnarchive = [];
    for (const habitId of uniqueHabitIds) {
      const habit = await ctx.db.get(habitId);
      if (!habit) continue;
      if (habit.userId !== identity.subject) {
        throw new Error('Not authorized to unarchive this habit');
      }
      habitsToUnarchive.push(habit);
    }

    const nonPausedActiveHabits = activeHabits.filter((habit) => !habit.paused);
    const requestedActiveHabitCount = habitsToUnarchive.filter(
      (habit) => habit.archived === true && !habit.paused
    ).length;
    const isPremiumUser = await hasPremiumAccess(ctx, identity.subject);
    if (
      !isPremiumUser &&
      nonPausedActiveHabits.length + requestedActiveHabitCount >
        FREE_HABIT_LIMIT
    ) {
      throw new Error(
        `Free tier is limited to ${FREE_HABIT_LIMIT} active habits. Upgrade to premium or keep some habits archived to continue.`
      );
    }

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
