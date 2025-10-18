/**
 * Quick fix - Set one habit to 50% to test if display works
 * Run: npx convex run quickFix:testDisplay
 */

import { mutation, query } from './_generated/server';

export const testDisplay = mutation({
  handler: async (ctx) => {
    const habit = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .first();

    if (!habit) {
      return { error: 'No habits found' };
    }

    console.log(`Setting ${habit.name} to 50% strength for testing...`);

    await ctx.db.patch(habit._id, {
      strength: 0.5,
      strengthLevel: 'developing',
      strengthUpdatedAt: Date.now(),
    });

    console.log('✅ Done! Check your app - the first habit should show 50%');

    return {
      success: true,
      habitName: habit.name,
      message: 'Refresh your app - first habit should show 50%',
    };
  },
});

export const checkToggle = query({
  handler: async (ctx) => {
    const habit = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .first();

    if (!habit) return { error: 'No habits' };

    return {
      habitName: habit.name,
      strength: habit.strength,
      strengthPercent: habit.strength
        ? `${(habit.strength * 100).toFixed(1)}%`
        : 'not set',
      strengthLevel: habit.strengthLevel || 'not set',
      lastUpdated: habit.strengthUpdatedAt
        ? new Date(habit.strengthUpdatedAt).toLocaleString()
        : 'never',
    };
  },
});
