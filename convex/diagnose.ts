/**
 * Simple diagnostic to see what's actually in your database
 * Run: npx convex run diagnose:show
 */

import { internalQuery, internalMutation } from './_generated/server';
import { calculateHabitStrength } from './habitStrength';

export const show = internalQuery({
  handler: async (ctx) => {
    const habits = await ctx.db.query('habits').collect();

    const results = [];

    for (const habit of habits) {
      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      const completed = tracking.filter((t) => t.completed).length;

      results.push({
        completedEntries: completed,
        currentStrength: habit.strength,
        hasStrengthField: typeof habit.strength,
        lastUpdated: habit.strengthUpdatedAt || 'never',
        name: habit.name,
        strengthLevel: habit.strengthLevel || 'not set',
        strengthPercent: habit.strength
          ? `${(habit.strength * 100).toFixed(1)}%`
          : 'null',
        trackingEntries: tracking.length,
      });
    }

    return {
      diagnosis:
        habits.length === 0
          ? '❌ No habits found in database'
          : results.every((h) => h.hasStrengthField === 'undefined')
            ? "❌ Schema field 'strength' doesn't exist - run 'npx convex dev'"
            : results.every(
                  (h) => h.currentStrength === null || h.currentStrength === 0
                )
              ? '⚠️ Strength exists but all at 0% - needs initialization'
              : '✅ Some habits have strength values',
      habits: results,
      totalHabits: habits.length,
    };
  },
});

export const fix = internalMutation({
  handler: async (ctx) => {
    // Forcing habit strength calculation

    const habits = await ctx.db.query('habits').collect();
    let fixed = 0;

    for (const habit of habits) {
      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      if (tracking.length === 0) {
        await ctx.db.patch(habit._id, {
          strength: 0,
          strengthLevel: 'starting',
          strengthUpdatedAt: Date.now(),
        });
        // Set to 0% — no tracking data
        continue;
      }

      // Calculate from all history
      const sorted = tracking
        .map((t) => ({ ...t, date: t.date }))
        .sort((a, b) => a.date.localeCompare(b.date));

      let strength = 0;
      for (const entry of sorted) {
        strength = calculateHabitStrength(
          strength,
          entry.completed,
          0.175,
          0.15
        );
      }

      const level =
        strength < 0.2
          ? 'starting'
          : strength < 0.4
            ? 'building'
            : strength < 0.6
              ? 'developing'
              : strength < 0.8
                ? 'strong'
                : 'automatic';

      await ctx.db.patch(habit._id, {
        strength,
        strengthLevel: level,
        strengthUpdatedAt: Date.now(),
      });

      // Strength calculated
      fixed++;
    }

    // Fix complete
    return { fixed, total: habits.length };
  },
});
