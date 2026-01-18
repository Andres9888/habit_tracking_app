/**
 * Initialize habit strength for all existing habits using NEW momentum-based formula
 * Run this once to populate strength values for habits that don't have them yet
 * Uses recalculateHabitStrength which simulates the new formula day-by-day
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { calculateNewStrength, getStrengthLevel } from './habitStrength';

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export const initializeAllHabitsStrength = mutation({
  args: {},
  handler: async (ctx) => {
    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();

    console.log(`🔄 Initializing strength for ${habits.length} habits...`);

    let initialized = 0;
    let skipped = 0;

    for (const habit of habits) {
      // Skip if already has strength
      if (habit.strength !== undefined) {
        console.log(`  ⏭️  Skipping ${habit.name} - already has strength`);
        skipped++;
        continue;
      }

      // Get all tracking data for this habit
      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      console.log(`  ▸ Found ${tracking.length} tracking entries`);

      if (tracking.length === 0) {
        // No tracking data = start at 0
        await ctx.db.patch(habit._id, {
          strength: 0,
          strengthLevel: 'starting',
          strengthUpdatedAt: Date.now(),
        });
        console.log(`  ✅ ${habit.name}: 0% (starting) - no tracking data`);
        initialized++;
        continue;
      }

      // Simulate day-by-day progression with NEW momentum-based formula
      const sortedTracking = tracking.sort((a, b) => a.date.localeCompare(b.date));
      let currentStrength = 0; // Start from 0
      const completionsByDate = new Map<string, boolean>();

      for (const record of sortedTracking) {
        completionsByDate.set(record.date, record.completed);
      }

      // Process each day chronologically
      for (const record of sortedTracking) {
        const recordDate = new Date(record.date);
        const sevenDaysAgo = new Date(recordDate);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Count completions in last 7 days (before this date)
        let completionsLast7Days = 0;
        for (const [date, completed] of completionsByDate.entries()) {
          const checkDate = new Date(date);
          if (checkDate >= sevenDaysAgo && checkDate < recordDate && completed) {
            completionsLast7Days++;
          }
        }

        // Apply NEW momentum-based formula
        currentStrength = calculateNewStrength(
          currentStrength,
          record.completed,
          completionsLast7Days
        );
      }

      // Convert to 0-1 scale for storage
      const finalStrength = currentStrength / 100;
      const strengthLevel = getStrengthLevel(finalStrength);

      // Update habit with calculated strength
      await ctx.db.patch(habit._id, {
        strength: finalStrength,
        strengthLevel,
        strengthUpdatedAt: Date.now(),
      });

      console.log(
        `  ✅ ${habit.name}: ${currentStrength.toFixed(1)}% (${strengthLevel})`
      );
      initialized++;
    }

    console.log(
      `\n✨ Complete! Initialized: ${initialized}, Skipped: ${skipped}`
    );

    return {
      initialized,
      skipped,
      total: habits.length,
    };
  },
  returns: v.object({
    initialized: v.number(),
    skipped: v.number(),
    total: v.number(),
  }),
});
