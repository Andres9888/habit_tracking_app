/**
 * Quick fix - Set one habit to 50% to test if display works
 * Run: npx convex run quickFix:testDisplay
 */

import { internalMutation, internalQuery } from './_generated/server';

export const testDisplay = internalMutation({
  handler: async (ctx) => {
    const habit = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .first();

    if (!habit) {
      return { error: 'No habits found' };
    }

    // Setting habit to 50% strength for testing

    await ctx.db.patch(habit._id, {
      strength: 0.5,
      strengthLevel: 'developing',
      strengthUpdatedAt: Date.now(),
    });

    // Done — check app for 50% display

    return {
      habitName: habit.name,
      message: 'Refresh your app - first habit should show 50%',
      success: true,
    };
  },
});

export const checkToggle = internalQuery({
  handler: async (ctx) => {
    const habit = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .first();

    if (!habit) return { error: 'No habits' };

    return {
      habitName: habit.name,
      lastUpdated: habit.strengthUpdatedAt
        ? new Date(habit.strengthUpdatedAt).toLocaleString()
        : 'never',
      strength: habit.strength,
      strengthLevel: habit.strengthLevel || 'not set',
      strengthPercent: habit.strength
        ? `${(habit.strength * 100).toFixed(1)}%`
        : 'not set',
    };
  },
});
