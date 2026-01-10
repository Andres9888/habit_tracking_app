/**
 * Habit Pause/Resume Mutations
 * Pause and resume habits with state preservation
 */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { fullHabitValidator } from './types';

export const pause = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Store pause metadata
    await ctx.db.patch(args.habitId, {
      accessibilityAtPause: habit.accessibility,
      paused: true,
      pausedAt: Date.now(),
      strengthAtPause: habit.strength,
    });

    return { habitId: args.habitId, success: true };
  },
  returns: v.object({
    habitId: v.id('habits'),
    success: v.boolean(),
  }),
});

export const resume = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    await ctx.db.patch(args.habitId, {
      paused: false,
      resumedAt: Date.now(),
    });

    return { habitId: args.habitId, success: true };
  },
  returns: v.object({
    habitId: v.id('habits'),
    success: v.boolean(),
  }),
});

export const listPaused = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('habits')
      .filter((q) => q.eq(q.field('paused'), true))
      .order('desc')
      .collect();
  },
  returns: v.array(fullHabitValidator),
});
