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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to pause habits');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to pause this habit');
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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to resume habits');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to resume this habit');
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
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to view paused habits');
    }

    // SEC-001: Return only the user's paused habits
    return await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .filter((q) => q.eq(q.field('paused'), true))
      .order('desc')
      .collect();
  },
  returns: v.array(fullHabitValidator),
});
