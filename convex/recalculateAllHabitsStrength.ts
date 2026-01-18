/**
 * Recalculate strength for ALL habits using the new momentum-based formula
 * This REPLACES old strength values with new calculations
 * Run this to fix habits that were initialized with the old formula
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { calculateNewStrength, getStrengthLevel } from './habitStrength';

export const recalculateAllHabitsStrength = mutation({
  args: {
    force: v.optional(v.boolean()), // Set to true to recalculate even if strength exists
  },
  handler: async (ctx, args) => {
    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();

    console.log(`🔄 Recalculating strength for ${habits.length} habits...`);

    let recalculated = 0;
    let skipped = 0;

    for (const habit of habits) {
      // Skip if has strength and not forcing
      if (habit.strength !== undefined && !args.force) {
        console.log(`  ⏭️  Skipping ${habit.name} - already has strength (use force:true to recalculate)`);
        skipped++;
        continue;
      }

      console.log(`  🔧 Recalculating ${habit.name}...`);

      // Get all tracking data
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
        console.log(`    ✅ 0% (starting) - no tracking data`);
        recalculated++;
        continue;
      }

      // Sort by date and simulate day-by-day
      const sortedTracking = tracking.sort((a, b) => a.date.localeCompare(b.date));
      let currentStrength = 0;
      const completionsByDate = new Map<string, boolean>();

      for (const record of sortedTracking) {
        completionsByDate.set(record.date, record.completed);
      }

      // Apply new formula chronologically
      for (const record of sortedTracking) {
        const recordDate = new Date(record.date);
        const sevenDaysAgo = new Date(recordDate);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let completionsLast7Days = 0;
        for (const [date, completed] of completionsByDate.entries()) {
          const checkDate = new Date(date);
          if (checkDate >= sevenDaysAgo && checkDate < recordDate && completed) {
            completionsLast7Days++;
          }
        }

        currentStrength = calculateNewStrength(
          currentStrength,
          record.completed,
          completionsLast7Days
        );
      }

      const finalStrength = currentStrength / 100;
      const strengthLevel = getStrengthLevel(finalStrength);

      await ctx.db.patch(habit._id, {
        strength: finalStrength,
        strengthLevel,
        strengthUpdatedAt: Date.now(),
      });

      console.log(`    ✅ ${currentStrength.toFixed(1)}% (${strengthLevel})`);
      recalculated++;
    }

    console.log(`\n✨ Complete! Recalculated: ${recalculated}, Skipped: ${skipped}`);

    return {
      recalculated,
      skipped,
      total: habits.length,
    };
  },
  returns: v.object({
    recalculated: v.number(),
    skipped: v.number(),
    total: v.number(),
  }),
});
