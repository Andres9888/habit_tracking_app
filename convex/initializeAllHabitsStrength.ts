/**
 * Initialize habit strength for all existing habits
 * Run this once to populate strength values for habits that don't have them yet
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { generateHabitStrengthSnapshot } from './habitStrength';

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

      // Calculate strength
      const snapshot = generateHabitStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        throughDate: startOfDay(new Date()),
        tracking: tracking.map((t) => ({
          completed: t.completed,
          date: t.date,
        })),
      });

      // Update habit with strength data
      await ctx.db.patch(habit._id, {
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
        strengthUpdatedAt: snapshot.lastEvaluatedDate.getTime(),
      });

      console.log(
        `  ✅ ${habit.name}: ${(snapshot.strength * 100).toFixed(1)}% (${snapshot.strengthLevel})`
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
