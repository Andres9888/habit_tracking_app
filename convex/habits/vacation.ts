/**
 * Habit Vacation Mode Mutations
 *
 * Streak Insurance — Premium Feature
 * Allows users to pause streak tracking during vacations without breaking streaks.
 *
 * Behavior:
 * - Vacation days are excluded from streak calculation (neither break nor grow)
 * - Vacation periods are stored as [{start, end}] date ranges (YYYY-MM-DD)
 * - Premium-only feature validated server-side
 */

import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requirePremium } from '../subscriptions/premiumCheck';

const vacationPeriodValidator = v.object({
  end: v.string(),
  start: v.string(),
});

/**
 * Toggle vacation mode on/off for a habit.
 * Premium required.
 */
export const setVacationMode = mutation({
  args: {
    enabled: v.boolean(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to set vacation mode');
    }

    await requirePremium(ctx, identity.subject, 'Streak Insurance (Vacation Mode)');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    await ctx.db.patch(args.habitId, { vacationMode: args.enabled });
    return null;
  },
  returns: v.null(),
});

/**
 * Add a vacation period to a habit.
 * Premium required.
 */
export const addVacationPeriod = mutation({
  args: {
    end: v.string(),
    habitId: v.id('habits'),
    start: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to add vacation period');
    }

    await requirePremium(ctx, identity.subject, 'Streak Insurance (Vacation Mode)');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(args.start) || !dateRegex.test(args.end)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD.');
    }
    if (args.start > args.end) {
      throw new Error('Vacation start date must be before or equal to end date.');
    }

    const existing = habit.vacationPeriods ?? [];
    const updated = [...existing, { end: args.end, start: args.start }];

    await ctx.db.patch(args.habitId, { vacationPeriods: updated });
    return null;
  },
  returns: v.null(),
});

/**
 * Remove a vacation period by index.
 * Premium required.
 */
export const removeVacationPeriod = mutation({
  args: {
    habitId: v.id('habits'),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to remove vacation period');
    }

    await requirePremium(ctx, identity.subject, 'Streak Insurance (Vacation Mode)');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to modify this habit');
    }

    const existing = habit.vacationPeriods ?? [];
    if (args.index < 0 || args.index >= existing.length) {
      throw new Error('Invalid vacation period index.');
    }

    const updated = existing.filter((_, i) => i !== args.index);
    await ctx.db.patch(args.habitId, { vacationPeriods: updated });
    return null;
  },
  returns: v.null(),
});
