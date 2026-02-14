/**
 * Streak Freeze - Server-side logic for streak recovery (Premium)
 *
 * Allows premium users to "freeze" a missed day, preserving their streak.
 * Each premium user gets a limited number of freezes per month.
 *
 * PR #504 introduced streak freeze notifications; this adds the backend logic.
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/** Maximum streak freezes a premium user gets per calendar month */
const FREEZES_PER_MONTH = 3;

/**
 * Query: Check if the user has any habits with a broken streak from yesterday
 * that can be recovered with a streak freeze.
 *
 * Returns habits eligible for streak recovery + remaining freezes this month.
 */
export const getStreakRecoveryStatus = query({
  args: { timezone: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;

    // Check premium status
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', userId))
      .first();

    const isPremium =
      subscription?.status === 'active' ||
      subscription?.status === 'trialing';

    if (!isPremium) return null;

    // Calculate today and yesterday in user timezone
    const tz = args.timezone ?? 'America/New_York';
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: tz }); // YYYY-MM-DD
    const yesterdayDate = new Date(now.getTime() - 86400000);
    const yesterdayStr = yesterdayDate.toLocaleDateString('en-CA', {
      timeZone: tz,
    });

    // Count freezes used this month
    const monthStart = todayStr.slice(0, 7); // YYYY-MM
    const allFreezes = await ctx.db
      .query('streakFreezes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    const freezesThisMonth = allFreezes.filter((f) =>
      f.date.startsWith(monthStart)
    ).length;
    const freezesRemaining = Math.max(0, FREEZES_PER_MONTH - freezesThisMonth);

    if (freezesRemaining <= 0) return null;

    // Find habits where yesterday was missed but there was an active streak
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();

    const eligibleHabits: Array<{
      habitId: string;
      habitName: string;
      habitEmoji: string;
      currentStreak: number;
    }> = [];

    for (const habit of habits) {
      if (habit.archived || habit.paused) continue;
      if (!habit.currentStreak || habit.currentStreak < 2) continue;

      // Check if yesterday was NOT completed
      const yesterdayTracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) =>
          q.eq('habitId', habit._id).eq('date', yesterdayStr)
        )
        .unique();

      const yesterdayCompleted =
        yesterdayTracking?.completed === true;

      if (yesterdayCompleted) continue;

      // Check if the day before yesterday WAS completed (streak was active)
      const dayBeforeDate = new Date(yesterdayDate.getTime() - 86400000);
      const dayBeforeStr = dayBeforeDate.toLocaleDateString('en-CA', {
        timeZone: tz,
      });
      const dayBeforeTracking = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) =>
          q.eq('habitId', habit._id).eq('date', dayBeforeStr)
        )
        .unique();

      if (!dayBeforeTracking?.completed) continue;

      // Check freeze hasn't already been used for this habit+date
      const existingFreeze = allFreezes.find(
        (f) =>
          f.habitId === habit._id && f.date === yesterdayStr
      );
      if (existingFreeze) continue;

      eligibleHabits.push({
        currentStreak: habit.currentStreak,
        habitEmoji: habit.icon ?? '🔗',
        habitId: habit._id,
        habitName: habit.name,
      });
    }

    if (eligibleHabits.length === 0) return null;

    return {
      eligibleHabits,
      freezesRemaining,
    };
  },
});

/**
 * Mutation: Use a streak freeze to recover a habit's streak for yesterday.
 * Inserts a tracking record for yesterday and recalculates the streak.
 */
export const useStreakFreeze = mutation({
  args: {
    habitId: v.id('habits'),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const userId = identity.subject;

    // Verify premium
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', userId))
      .first();

    const isPremium =
      subscription?.status === 'active' ||
      subscription?.status === 'trialing';
    if (!isPremium) throw new Error('Premium subscription required');

    // Verify habit ownership
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== userId)
      throw new Error('Habit not found');

    const tz = args.timezone ?? 'America/New_York';
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', { timeZone: tz });
    const yesterdayDate = new Date(now.getTime() - 86400000);
    const yesterdayStr = yesterdayDate.toLocaleDateString('en-CA', {
      timeZone: tz,
    });

    // Check monthly freeze limit
    const monthStart = todayStr.slice(0, 7);
    const allFreezes = await ctx.db
      .query('streakFreezes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    const freezesThisMonth = allFreezes.filter((f) =>
      f.date.startsWith(monthStart)
    ).length;
    if (freezesThisMonth >= FREEZES_PER_MONTH)
      throw new Error('No streak freezes remaining this month');

    // Check not already frozen
    const existing = allFreezes.find(
      (f) => f.habitId === args.habitId && f.date === yesterdayStr
    );
    if (existing) throw new Error('Streak freeze already used for this date');

    // Insert tracking record for yesterday (marks it as completed via freeze)
    const existingTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', yesterdayStr)
      )
      .unique();

    if (existingTracking) {
      await ctx.db.patch(existingTracking._id, { completed: true });
    } else {
      await ctx.db.insert('tracking', {
        completed: true,
        date: yesterdayStr,
        habitId: args.habitId,
        userId,
      });
    }

    // Record the freeze
    await ctx.db.insert('streakFreezes', {
      date: yesterdayStr,
      habitId: args.habitId,
      usedAt: Date.now(),
      userId,
    });

    // Recalculate streak
    const { calculateStreakFromHistory } = await import('./streakUtils');
    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId)
      )
      .collect();

    const tracking = allTracking.map((r) => ({
      completed: r.completed,
      date: r.date,
    }));
    const streakData = calculateStreakFromHistory(tracking, todayStr);

    await ctx.db.patch(args.habitId, {
      bestStreak: streakData.bestStreak,
      currentStreak: streakData.currentStreak,
      lastCompletedDate: streakData.lastCompletedDate,
    });

    return { success: true };
  },
  returns: v.object({ success: v.boolean() }),
});
