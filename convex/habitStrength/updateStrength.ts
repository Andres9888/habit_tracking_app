// Update Habit Strength Mutation - @deprecated Use tracking.toggleCompletion instead
import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import { calculateNewStrength } from './momentum';
import { getStrengthLevel } from './strengthLevel';
import { predictCompletionProbability } from './legacyFormula';
export const updateHabitStrength = internalMutation({
  args: {
    behaviorPerformed: v.boolean(),
    date: v.string(),
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        'Unauthenticated: Must be logged in to update habit strength'
      );
    }
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to update this habit');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }
    const previousStrength = habit.strength ?? 0;
    const userId = identity.subject;
    // Update tracking record
    const trackingForDay = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();
    if (trackingForDay) {
      if (trackingForDay.completed !== args.behaviorPerformed) {
        await ctx.db.patch(trackingForDay._id, {
          completed: args.behaviorPerformed,
          ...(trackingForDay.userId ? {} : { userId }),
        });
      }
    } else {
      await ctx.db.insert('tracking', {
        completed: args.behaviorPerformed,
        date: args.date,
        habitId: args.habitId,
        userId: habit.userId,
      });
    }
    // Calculate completionsLast7Days for streak shield
    const toggleDate = new Date(args.date);
    const sevenDaysAgo = new Date(toggleDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // Bounded to the 7-day window this loop actually needs. The bound is
    // deliberately generous (date-key granularity vs. the loop's exact
    // timestamp compare); the loop below still filters precisely.
    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q
          .eq('habitId', args.habitId)
          .gte('date', sevenDaysAgo.toISOString().slice(0, 10))
      )
      .collect();
    let completionsLast7Days = 0;
    for (const record of allTracking) {
      const recordDate = new Date(record.date);
      if (
        recordDate >= sevenDaysAgo &&
        recordDate < toggleDate &&
        record.completed
      ) {
        completionsLast7Days++;
      }
    }
    const newStrength =
      calculateNewStrength(
        previousStrength * 100,
        args.behaviorPerformed,
        completionsLast7Days
      ) / 100;
    const strengthLevel = getStrengthLevel(newStrength);
    await ctx.db.patch(args.habitId, {
      strength: newStrength,
      strengthLevel,
      strengthUpdatedAt: Date.now(),
    });
    return {
      baseline: 0,
      compliance: 0,
      daysSinceCreation: 0,
      newStrength,
      predictionProbability: predictCompletionProbability(newStrength),
      previousStrength,
      strengthLevel,
    };
  },
});
