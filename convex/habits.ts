import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { generateHabitStrengthSnapshot } from './habitStrength';

export const create = mutation({
  args: {
    name: v.string(),
    notes: v.optional(v.string()),
    remindersEnabled: v.optional(v.boolean()),
    reminderTime: v.optional(v.string()),
    reminderSound: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all existing habits to determine next order value
    const allHabits = await ctx.db.query('habits').collect();
    const maxOrder = allHabits.reduce(
      (max, habit) => Math.max(max, habit.order ?? -1),
      -1
    );

    return await ctx.db.insert('habits', {
      createdAt: Date.now(),
      name: args.name,
      notes: args.notes,
      order: maxOrder + 1,
      remindersEnabled: args.remindersEnabled,
      reminderTime: args.reminderTime,
      reminderSound: args.reminderSound,
    });
  },
  returns: v.id('habits'),
});

export const updateNotes = mutation({
  args: {
    habitId: v.id('habits'),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.habitId, {
      notes: args.notes,
    });
    return null;
  },
  returns: v.null(),
});

export const update = mutation({
  args: {
    habitId: v.id('habits'),
    name: v.optional(v.string()),
    notes: v.optional(v.string()),
    icon: v.optional(v.string()),
    iconColor: v.optional(v.string()),
    frequency: v.optional(v.string()),
    daysOfWeek: v.optional(v.array(v.number())),
    preferredTime: v.optional(v.string()),
    remindersEnabled: v.optional(v.boolean()),
    reminderTime: v.optional(v.string()),
    reminderSound: v.optional(v.string()),
    goalDuration: v.optional(v.number()),
    goalUnit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { habitId, ...updates } = args;

    // Remove undefined fields
    const cleanedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(habitId, cleanedUpdates);
    return null;
  },
  returns: v.null(),
});

export const archive = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    await ctx.db.patch(args.habitId, {
      archived: true,
      archivedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

export const unarchive = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Get all non-archived habits to determine next order value
    const activeHabits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();
    const maxOrder = activeHabits.reduce(
      (max, h) => Math.max(max, h.order ?? -1),
      -1
    );

    await ctx.db.patch(args.habitId, {
      archived: false,
      archivedAt: undefined,
      order: maxOrder + 1,
    });

    return null;
  },
  returns: v.null(),
});

export const reorderHabits = mutation({
  args: {
    habitIds: v.array(v.id('habits')),
  },
  handler: async (ctx, args) => {
    console.log('reorderHabits called with:', args.habitIds.length, 'habits');

    // Validate input
    if (!args.habitIds || args.habitIds.length === 0) {
      console.error('No habit IDs provided');
      return null;
    }

    try {
      // Update each habit with its new order index
      for (let i = 0; i < args.habitIds.length; i++) {
        const habitId = args.habitIds[i];
        const habit = await ctx.db.get(habitId);

        if (habit) {
          await ctx.db.patch(habitId, {
            order: i,
          });
        } else {
          console.warn(`Habit ${habitId} not found`);
        }
      }

      console.log('Successfully reordered', args.habitIds.length, 'habits');
      return null;
    } catch (error) {
      console.error('Error in reorderHabits:', error);
      throw error;
    }
  },
  returns: v.null(),
});

export const remove = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // Get the habit data before deleting
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Get all tracking data before deleting
    const trackingEntries = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Delete the habit permanently
    await ctx.db.delete(args.habitId);

    // Delete all tracking data for this habit
    for (const entry of trackingEntries) {
      await ctx.db.delete(entry._id);
    }

    // Return the deleted data for potential undo
    return {
      habit: {
        createdAt: habit.createdAt,
        name: habit.name,
        notes: habit.notes,
      },
      tracking: trackingEntries.map((entry) => ({
        completed: entry.completed,
        date: entry.date,
      })),
    };
  },
  returns: v.object({
    habit: v.object({
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
    }),
    tracking: v.array(
      v.object({
        completed: v.boolean(),
        date: v.string(),
      })
    ),
  }),
});

export const restore = mutation({
  args: {
    habitData: v.object({
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
    }),
    trackingData: v.array(
      v.object({
        completed: v.boolean(),
        date: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Get all existing habits to determine next order value
    const allHabits = await ctx.db.query('habits').collect();
    const maxOrder = allHabits.reduce(
      (max, habit) => Math.max(max, habit.order ?? -1),
      -1
    );

    // Recreate the habit with proper order
    const habitId = await ctx.db.insert('habits', {
      ...args.habitData,
      order: maxOrder + 1,
    });

    // Recreate all tracking data
    for (const trackingEntry of args.trackingData) {
      await ctx.db.insert('tracking', {
        completed: trackingEntry.completed,
        date: trackingEntry.date,
        habitId,
      });
    }

    return habitId;
  },
  returns: v.id('habits'),
});

export const get = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.habitId);
  },
  returns: v.union(
    v.null(),
    v.object({
      _creationTime: v.number(),
      _id: v.id('habits'),
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
      order: v.optional(v.number()),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      strength: v.optional(v.number()),
      strengthLevel: v.optional(v.string()),
      strengthUpdatedAt: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      userId: v.optional(v.string()),
      consecutiveDays: v.optional(v.number()),
      totalCompletions: v.optional(v.number()),
      totalMisses: v.optional(v.number()),
      accessibility: v.optional(v.number()),
      accessibilityDecayParam: v.optional(v.number()),
      accessibilityGainBehavior: v.optional(v.number()),
      accessibilityGainReminder: v.optional(v.number()),
      accessibilityUpdatedAt: v.optional(v.number()),
      habitDecayParam: v.optional(v.number()),
      habitGainParam: v.optional(v.number()),
      lastPredictionAt: v.optional(v.number()),
      predictedCompletionProb: v.optional(v.number()),
      icon: v.optional(v.string()),
      iconColor: v.optional(v.string()),
      frequency: v.optional(v.string()),
      daysOfWeek: v.optional(v.array(v.number())),
      preferredTime: v.optional(v.string()),
      remindersEnabled: v.optional(v.boolean()),
      reminderTime: v.optional(v.string()),
      reminderSound: v.optional(v.string()),
      goalDuration: v.optional(v.number()),
      goalUnit: v.optional(v.string()),
    })
  ),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const habits = await ctx.db
      .query('habits')
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();

    // Sort by order field (ascending), use _creationTime as fallback
    return habits.sort((a, b) => {
      const aOrder = a.order ?? Infinity;
      const bOrder = b.order ?? Infinity;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      // If orders are equal (or both undefined), sort by creation time
      return a._creationTime - b._creationTime;
    });
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('habits'),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
      order: v.optional(v.number()),
      strength: v.optional(v.number()),
      strengthLevel: v.optional(v.string()),
      strengthUpdatedAt: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      userId: v.optional(v.string()),
      remindersEnabled: v.optional(v.boolean()),
      reminderTime: v.optional(v.string()),
      reminderSound: v.optional(v.string()),
    })
  ),
});

export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('habits')
      .filter((q) => q.eq(q.field('archived'), true))
      .collect();
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('habits'),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      createdAt: v.number(),
      name: v.string(),
      notes: v.optional(v.string()),
      order: v.optional(v.number()),
      strength: v.optional(v.number()),
      strengthLevel: v.optional(v.string()),
      strengthUpdatedAt: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      userId: v.optional(v.string()),
      remindersEnabled: v.optional(v.boolean()),
      reminderTime: v.optional(v.string()),
      reminderSound: v.optional(v.string()),
    })
  ),
});

export const toggleHabit = mutation({
  args: { date: v.string(), habitId: v.id('habits') },
  handler: async (ctx, args) => {
    // Validate date format as YYYY-MM-DD
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(args.date);
    if (!isValidDate)
      throw new Error('Invalid date format; expected YYYY-MM-DD');

    // Prevent future dates - only allow today or past dates
    const inputDate = new Date(args.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      throw new Error('Cannot track habits for future dates');
    }

    const existing = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.date)
      )
      .unique();

    const newCompletedStatus = existing ? !existing.completed : true;

    await (existing
      ? ctx.db.patch(existing._id, {
          completed: newCompletedStatus,
        })
      : ctx.db.insert('tracking', {
          completed: true,
          date: args.date,
          habitId: args.habitId,
        }));

    // Update habit strength based on the new completion status
    const habit = await ctx.db.get(args.habitId);
    if (habit) {
      const previousStrength = habit.strength ?? 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
        .collect();

      const snapshot = generateHabitStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        throughDate: today,
        tracking: tracking.map((t) => ({
          completed: t.completed,
          date: t.date,
        })),
      });

      console.log('🔧 Habit Strength Update (replay):', {
        baseline: (snapshot.baseline * 100).toFixed(1) + '%',
        behaviorPerformed: newCompletedStatus,
        change: ((snapshot.strength - previousStrength) * 100).toFixed(1) + '%',
        compliance: (snapshot.compliance * 100).toFixed(1) + '%',
        habitName: habit.name,
        newStrength: (snapshot.strength * 100).toFixed(1) + '%',
        previousStrength: (previousStrength * 100).toFixed(1) + '%',
        strengthLevel: snapshot.strengthLevel,
        successes: snapshot.complianceSuccesses,
        windowDays: snapshot.complianceDaysConsidered,
      });

      await ctx.db.patch(args.habitId, {
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
        strengthUpdatedAt: snapshot.lastEvaluatedDate.getTime(),
      });
    }

    return null;
  },
  returns: v.null(),
});

export const getTracking = query({
  args: { dates: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (args.dates.length === 0) return [];

    // Optimize by querying a single date range then filtering to requested dates
    const sortedDates = [...args.dates].sort();
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    const range = await ctx.db
      .query('tracking')
      .filter((q) =>
        q.and(
          q.gte(q.field('date'), startDate),
          q.lte(q.field('date'), endDate)
        )
      )
      .collect();

    const dateSet = new Set(args.dates);
    return range.filter((t) => dateSet.has(t.date));
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('tracking'),
      completed: v.boolean(),
      date: v.string(),
      habitId: v.id('habits'),
      userId: v.optional(v.string()),
    })
  ),
});

export const getStats = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    const sortedDates = tracking
      .filter((t) => t.completed)
      .map((t) => new Date(t.date).getTime())
      .sort((a, b) => b - a);

    let streak = 0;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (const [i, sortedDate] of sortedDates.entries()) {
      const expectedDate = new Date(now);
      expectedDate.setDate(now.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      const expectedTime = expectedDate.getTime();

      if (sortedDate === expectedTime) {
        streak++;
      } else {
        break;
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    const recentTracking = tracking.filter((t) => {
      const date = new Date(t.date);
      return date >= thirtyDaysAgo && t.completed;
    });

    const consistency = Math.max(
      0,
      Math.min(100, Math.round((recentTracking.length / 30) * 100))
    );

    return { consistency, streak };
  },
  returns: v.object({ consistency: v.number(), streak: v.number() }),
});
