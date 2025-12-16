import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { calculateMomentumStrengthSnapshot } from './habitStrength';
import { updateStreak } from "./streakUtils";

function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function maxDateKey(a: string, b: string): string {
  return a > b ? a : b;
}

export const create = mutation({
  args: {
    icon: v.optional(v.string()),
    iconColor: v.optional(v.string()),
    name: v.string(),
    notes: v.optional(v.string()),
    preferredTime: v.optional(v.string()),
    remindersEnabled: v.optional(v.boolean()),
    reminderSound: v.optional(v.string()),
    reminderTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all existing habits to determine next order value
    const allHabits = await ctx.db.query('habits').collect();
    let maxOrder = -1;
    for (const habit of allHabits) {
      const order = habit.order ?? -1;
      if (order > maxOrder) {
        maxOrder = order;
      }
    }

    return await ctx.db.insert('habits', {
      bestStreak: 0,
      createdAt: Date.now(),
      // Initialize streak tracking fields (Story 1.3)
      currentStreak: 0,

      icon: args.icon,

      iconColor: args.iconColor,

      lastCompletedDate: undefined,

      name: args.name,

      notes: args.notes,

      order: maxOrder + 1,

      // Huberman day phase timing
      preferredTime: args.preferredTime,

      remindersEnabled: args.remindersEnabled,

      reminderSound: args.reminderSound,
      reminderTime: args.reminderTime,

      // Initialize habit strength fields (v2.0 momentum-based formula)
      strength: 0,
      strengthLevel: 'starting',
      strengthUpdatedAt: Date.now(),
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
    // Cue - Implementation Intention (Gollwitzer, 1999)
    cueAfterBehavior: v.optional(v.string()),
    cueLocation: v.optional(v.string()),
    cueTime: v.optional(v.string()),
    daysOfWeek: v.optional(v.array(v.number())),
    frequency: v.optional(v.string()),
    goalDuration: v.optional(v.number()),
    habitId: v.id('habits'),
    goalUnit: v.optional(v.string()),
    icon: v.optional(v.string()),
    iconColor: v.optional(v.string()),
    name: v.optional(v.string()),
    notes: v.optional(v.string()),
    why: v.optional(v.string()),
    preferredTime: v.optional(v.string()),
    remindersEnabled: v.optional(v.boolean()),
    reminderSound: v.optional(v.string()),
    reminderTime: v.optional(v.string()),
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
    let maxOrder = -1;
    for (const habit of activeHabits) {
      const order = habit.order ?? -1;
      if (order > maxOrder) {
        maxOrder = order;
      }
    }

    await ctx.db.patch(args.habitId, {
      archived: false,
      archivedAt: undefined,
      order: maxOrder + 1,
    });

    return null;
  },
  returns: v.null(),
});

export const pause = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Store pause metadata
    await ctx.db.patch(args.habitId, {
      accessibilityAtPause: habit.accessibility,
      paused: true,

      pausedAt: Date.now(),
      // Preserve strength values
      strengthAtPause: habit.strength,
    });

    return { habitId: args.habitId, success: true };
  },
  returns: v.object({
    habitId: v.id('habits'),
    success: v.boolean(),
  }),
});

export const resume = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    await ctx.db.patch(args.habitId, {
      paused: false,
      resumedAt: Date.now(),
      // Strength values are preserved, just unpause
    });

    return { habitId: args.habitId, success: true };
  },
  returns: v.object({
    habitId: v.id('habits'),
    success: v.boolean(),
  }),
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
    let maxOrder = -1;
    for (const habit of allHabits) {
      const order = habit.order ?? -1;
      if (order > maxOrder) {
        maxOrder = order;
      }
    }

    // Recreate the habit with proper order and initialize strength
    const habitId = await ctx.db.insert('habits', {
      ...args.habitData,
      order: maxOrder + 1,
      // Initialize habit strength fields (will be recalculated from tracking data)
      strength: 0,
      strengthLevel: 'starting',
      strengthUpdatedAt: Date.now(),
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
    const habit = await ctx.db.get(args.habitId);
    if (!habit) return null;

    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
      .collect();

    const todayDateKey = getTodayDateKey();
    const maxTrackingDateKey = tracking.reduce(
      (maxKey, record) => maxDateKey(maxKey, record.date),
      todayDateKey
    );
    const evaluationDateKey = maxDateKey(todayDateKey, maxTrackingDateKey);

    const snapshot = calculateMomentumStrengthSnapshot({
      habitCreatedAt: habit.createdAt,
      throughDate: evaluationDateKey,
      tracking: tracking.map((record) => ({
        completed: record.completed,
        date: record.date,
      })),
    });

    return {
      ...habit,
      strength: snapshot.strength,
      strengthLevel: snapshot.strengthLevel,
    };
  },
  returns: v.union(
    v.null(),
    v.object({
      _creationTime: v.number(),
      _id: v.id('habits'),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      createdAt: v.number(),
      bestStreak: v.optional(v.number()),
      cueAfterBehavior: v.optional(v.string()),
      cueLocation: v.optional(v.string()),
      cueTime: v.optional(v.string()),
      currentStreak: v.optional(v.number()),
      consecutiveDays: v.optional(v.number()),
      name: v.string(),
      accessibility: v.optional(v.number()),
      notes: v.optional(v.string()),
      why: v.optional(v.string()),
      accessibilityDecayParam: v.optional(v.number()),
      order: v.optional(v.number()),
      accessibilityGainBehavior: v.optional(v.number()),
      strength: v.optional(v.number()),
      accessibilityGainReminder: v.optional(v.number()),
      strengthLevel: v.optional(v.string()),
      accessibilityUpdatedAt: v.optional(v.number()),
      strengthUpdatedAt: v.optional(v.number()),
      habitDecayParam: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      frequency: v.optional(v.string()),
      userId: v.optional(v.string()),
      daysOfWeek: v.optional(v.array(v.number())),
      lastCompletedDate: v.optional(v.string()),
      habitGainParam: v.optional(v.number()),
      totalCompletions: v.optional(v.number()),
      goalDuration: v.optional(v.number()),
      totalMisses: v.optional(v.number()),
      goalUnit: v.optional(v.string()),
      icon: v.optional(v.string()),
      iconColor: v.optional(v.string()),
      lastPredictionAt: v.optional(v.number()),
      predictedCompletionProb: v.optional(v.number()),
      preferredTime: v.optional(v.string()),
      remindersEnabled: v.optional(v.boolean()),
      reminderSound: v.optional(v.string()),
      reminderTime: v.optional(v.string()),
    })
  ),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const habits = await ctx.db
      .query('habits')
      .filter((q) =>
        q.and(
          q.neq(q.field('archived'), true),
          q.neq(q.field('paused'), true)
        )
      )
      .collect();

    // Sort by order field (ascending), use _creationTime as fallback
    const sortedHabits = habits.sort((a, b) => {
      const aOrder = a.order ?? Infinity;
      const bOrder = b.order ?? Infinity;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      // If orders are equal (or both undefined), sort by creation time
      return a._creationTime - b._creationTime;
    });

    const todayDateKey = getTodayDateKey();
    const habitsWithComputedStrength: typeof sortedHabits = [];

    for (const habit of sortedHabits) {
      const tracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      const maxTrackingDateKey = tracking.reduce(
        (maxKey, record) => maxDateKey(maxKey, record.date),
        todayDateKey
      );
      const evaluationDateKey = maxDateKey(todayDateKey, maxTrackingDateKey);

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        throughDate: evaluationDateKey,
        tracking: tracking.map((record) => ({
          completed: record.completed,
          date: record.date,
        })),
      });

      habitsWithComputedStrength.push({
        ...habit,
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
      });
    }

    return habitsWithComputedStrength;
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('habits'),
      accessibility: v.optional(v.number()),
      accessibilityDecayParam: v.optional(v.number()),
      accessibilityGainBehavior: v.optional(v.number()),
      accessibilityGainReminder: v.optional(v.number()),
      accessibilityUpdatedAt: v.optional(v.number()),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      bestStreak: v.optional(v.number()),
      consecutiveDays: v.optional(v.number()),
      createdAt: v.number(),
      cueAfterBehavior: v.optional(v.string()),
      cueLocation: v.optional(v.string()),
      cueTime: v.optional(v.string()),
      currentStreak: v.optional(v.number()),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.string()),
      goalDuration: v.optional(v.number()),
      goalUnit: v.optional(v.string()),
      habitDecayParam: v.optional(v.number()),
      habitGainParam: v.optional(v.number()),
      icon: v.optional(v.string()),
      iconColor: v.optional(v.string()),
      lastCompletedDate: v.optional(v.string()),
      lastPredictionAt: v.optional(v.number()),
      name: v.string(),
      notes: v.optional(v.string()),
      why: v.optional(v.string()),
      order: v.optional(v.number()),
      predictedCompletionProb: v.optional(v.number()),
      preferredTime: v.optional(v.string()),
      remindersEnabled: v.optional(v.boolean()),
      reminderSound: v.optional(v.string()),
      reminderTime: v.optional(v.string()),
      strength: v.optional(v.number()),
      strengthLevel: v.optional(v.string()),
      strengthUpdatedAt: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      totalCompletions: v.optional(v.number()),
      totalMisses: v.optional(v.number()),
      userId: v.optional(v.string()),
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
      accessibility: v.optional(v.number()),
      accessibilityDecayParam: v.optional(v.number()),
      accessibilityGainBehavior: v.optional(v.number()),
      accessibilityGainReminder: v.optional(v.number()),
      accessibilityUpdatedAt: v.optional(v.number()),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      bestStreak: v.optional(v.number()),
      consecutiveDays: v.optional(v.number()),
      createdAt: v.number(),
      cueAfterBehavior: v.optional(v.string()),
      cueLocation: v.optional(v.string()),
      cueTime: v.optional(v.string()),
      currentStreak: v.optional(v.number()),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.string()),
      goalDuration: v.optional(v.number()),
      goalUnit: v.optional(v.string()),
      habitDecayParam: v.optional(v.number()),
      habitGainParam: v.optional(v.number()),
      icon: v.optional(v.string()),
      iconColor: v.optional(v.string()),
      lastCompletedDate: v.optional(v.string()),
      lastPredictionAt: v.optional(v.number()),
      name: v.string(),
      notes: v.optional(v.string()),
      why: v.optional(v.string()),
      order: v.optional(v.number()),
      predictedCompletionProb: v.optional(v.number()),
      preferredTime: v.optional(v.string()),
      remindersEnabled: v.optional(v.boolean()),
      reminderSound: v.optional(v.string()),
      reminderTime: v.optional(v.string()),
      strength: v.optional(v.number()),
      strengthLevel: v.optional(v.string()),
      strengthUpdatedAt: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      totalCompletions: v.optional(v.number()),
      totalMisses: v.optional(v.number()),
      userId: v.optional(v.string()),
    })
  ),
});

export const listPaused = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('habits')
      .filter((q) => q.eq(q.field('paused'), true))
      .order('desc')
      .collect();
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('habits'),
      accessibility: v.optional(v.number()),
      accessibilityDecayParam: v.optional(v.number()),
      accessibilityGainBehavior: v.optional(v.number()),
      accessibilityGainReminder: v.optional(v.number()),
      accessibilityUpdatedAt: v.optional(v.number()),
      archived: v.optional(v.boolean()),
      archivedAt: v.optional(v.number()),
      bestStreak: v.optional(v.number()),
      consecutiveDays: v.optional(v.number()),
      createdAt: v.number(),
      cueAfterBehavior: v.optional(v.string()),
      cueLocation: v.optional(v.string()),
      cueTime: v.optional(v.string()),
      currentStreak: v.optional(v.number()),
      daysOfWeek: v.optional(v.array(v.number())),
      frequency: v.optional(v.string()),
      goalDuration: v.optional(v.number()),
      goalUnit: v.optional(v.string()),
      habitDecayParam: v.optional(v.number()),
      habitGainParam: v.optional(v.number()),
      icon: v.optional(v.string()),
      accessibilityAtPause: v.optional(v.number()),
      lastCompletedDate: v.optional(v.string()),
      iconColor: v.optional(v.string()),
      lastPredictionAt: v.optional(v.number()),
      name: v.string(),
      notes: v.optional(v.string()),
      why: v.optional(v.string()),
      order: v.optional(v.number()),
      paused: v.optional(v.boolean()),
      pausedAt: v.optional(v.number()),
      predictedCompletionProb: v.optional(v.number()),
      preferredTime: v.optional(v.string()),
      remindersEnabled: v.optional(v.boolean()),
      reminderSound: v.optional(v.string()),
      reminderTime: v.optional(v.string()),
      resumedAt: v.optional(v.number()),
      strength: v.optional(v.number()),
      strengthAtPause: v.optional(v.number()),
      strengthLevel: v.optional(v.string()),
      strengthUpdatedAt: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      totalCompletions: v.optional(v.number()),
      totalMisses: v.optional(v.number()),
      userId: v.optional(v.string()),
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
    const [yearStr, monthStr, dayStr] = args.date.split('-');
    const inputDate = new Date(
      Number(yearStr),
      Number(monthStr) - 1,
      Number(dayStr)
    );
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

    // Update habit strength and streak based on full tracking history
    const habit = await ctx.db.get(args.habitId);
    if (habit) {
      // Query all tracking for this habit to count TOTAL completions
      const allTracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
        .collect();

      const maxTrackingDateKey = allTracking.reduce(
        (maxKey, record) => maxDateKey(maxKey, record.date),
        args.date
      );

      const evaluationDateKey = maxDateKey(
        getTodayDateKey(),
        maxDateKey(args.date, maxTrackingDateKey)
      );

      const snapshot = calculateMomentumStrengthSnapshot({
        habitCreatedAt: habit.createdAt,
        throughDate: evaluationDateKey,
        tracking: allTracking.map((record) => ({
          completed: record.completed,
          date: record.date,
        })),
      });

      // Calculate updated streak using the existing streak logic
      const streakData = updateStreak(
        {
          bestStreak: habit.bestStreak,
          currentStreak: habit.currentStreak,
          lastCompletedDate: habit.lastCompletedDate,
        },
        args.date,
        newCompletedStatus
      );

      const previousStrength100 = (habit.strength ?? 0) * 100;

      console.log('🔧 Habit Strength Update (momentum-based):', {
        action: newCompletedStatus ? 'TOGGLE ON' : 'TOGGLE OFF',
        change: `${(snapshot.strength100 - previousStrength100).toFixed(2)}%`,
        date: args.date,
        daysProcessed: snapshot.daysProcessed,
        evaluationDateKey,
        habitName: habit.name,
        newStrength: `${snapshot.strength100.toFixed(1)}%`,
        previousStrength: `${previousStrength100.toFixed(1)}%`,
      });

      await ctx.db.patch(args.habitId, {
        bestStreak: streakData.bestStreak,
        currentStreak: streakData.currentStreak,
        lastCompletedDate: streakData.lastCompletedDate,
        strength: snapshot.strength,
        strengthLevel: snapshot.strengthLevel,
        strengthUpdatedAt: Date.now(),
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
    const endDate = sortedDates.at(-1);
    if (!endDate) return [];

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
