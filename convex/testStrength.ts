/**
 * Quick test to manually trigger strength calculation
 * Run this to bypass the UI: npx convex run testStrength:forceInitialize
 */

import { mutation, query } from './_generated/server';
import { calculateHabitStrength, getStrengthLevel } from './habitStrength';

export const forceInitialize = mutation({
  handler: async (ctx) => {
    // Starting manual initialization

    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();

    // Processing habits

    for (const habit of habits) {
      // Get all tracking for this habit
      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      // Processing habit tracking

      if (tracking.length === 0) {
        // No tracking data, setting to 0%
        await ctx.db.patch(habit._id, {
          strength: 0,
          strengthLevel: 'starting',
          strengthUpdatedAt: Date.now(),
        });
        continue;
      }

      // Sort by date
      const sorted = tracking
        .map((t) => ({ ...t, dateObj: new Date(t.date) }))
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

      let strength = 0;
      const HDP = 0.175;
      const HGP = 0.15;

      // Simulate day by day from creation
      const habitCreation = new Date(habit.createdAt);
      habitCreation.setHours(0, 0, 0, 0);
      const lastEntry = sorted.at(-1);
      if (!lastEntry) continue;
      const lastTracking = lastEntry.dateObj;

      const trackingMap = new Map(sorted.map((t) => [t.date, t.completed]));

      const currentDate = new Date(habitCreation);
      let daysProcessed = 0;

      while (currentDate <= lastTracking) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const behaviorPerformed = trackingMap.get(dateStr) ?? false;

        strength = calculateHabitStrength(
          strength,
          behaviorPerformed,
          HDP,
          HGP
        );
        daysProcessed++;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const level = getStrengthLevel(strength);

      // Strength calculated

      await ctx.db.patch(habit._id, {
        strength,
        strengthLevel: level,
        strengthUpdatedAt: Date.now(),
      });
    }

    // Initialization complete
    return { habitsProcessed: habits.length, success: true };
  },
});

export const checkStatus = query({
  handler: async (ctx) => {
    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();

    return habits.map((h) => ({
      hasStrengthField: h.strength !== undefined,
      name: h.name,
      strength: h.strength,
      strengthLevel: h.strengthLevel,
      strengthUpdatedAt: h.strengthUpdatedAt,
    }));
  },
});
