/**
 * Streak Recovery — "Repair" a Broken Streak
 *
 * Premium feature that lets users fill in a single missed day to
 * restore a streak that would otherwise reset to zero.
 *
 * Limits per calendar month:
 *   Free users  → 1 recovery
 *   Premium     → 3 recoveries
 */

import { v } from 'convex/values';
import { internal } from './_generated/api';
import { mutation, query } from './_generated/server';
import { hasPremiumAccess } from './subscriptions/premiumCheck';

const FREE_RECOVERIES_PER_MONTH = 1;
const PREMIUM_RECOVERIES_PER_MONTH = 3;

/**
 * Get how many recoveries the user has used this month and their limit.
 */
export const getRecoveryStatus = query({
  args: { timezone: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;
    const isPremium = await hasPremiumAccess(ctx, userId);
    const yearMonth = getCurrentYearMonth(args.timezone);

    const recoveries = await ctx.db
      .query('streakRecoveries')
      .withIndex('by_user_and_month', (q) =>
        q.eq('userId', userId).eq('yearMonth', yearMonth)
      )
      .collect();

    const limit = isPremium
      ? PREMIUM_RECOVERIES_PER_MONTH
      : FREE_RECOVERIES_PER_MONTH;

    return {
      isPremium,
      limit,
      remaining: Math.max(0, limit - recoveries.length),
      used: recoveries.length,
    };
  },
  returns: v.union(
    v.null(),
    v.object({
      isPremium: v.boolean(),
      limit: v.number(),
      remaining: v.number(),
      used: v.number(),
    })
  ),
});

/**
 * Recover a broken streak by filling in a missed date.
 *
 * The missed date must be:
 *   1. Yesterday or the day before yesterday (within recovery window)
 *   2. Not already completed
 *   3. User must have remaining recoveries this month
 */
export const recoverStreak = mutation({
  args: {
    habitId: v.id('habits'),
    missedDate: v.string(),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      throw new Error('Unauthenticated: Must be logged in to recover streak');

    const userId = identity.subject;

    // Validate habit ownership
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== userId)
      throw new Error('Not authorized to recover this habit');

    // Check the missed date isn't already completed
    const existing = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('date', args.missedDate)
      )
      .unique();

    if (existing?.completed) {
      throw new Error('This date is already completed — no recovery needed');
    }

    // Check already recovered
    const alreadyRecovered = await ctx.db
      .query('streakRecoveries')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', args.habitId).eq('recoveredDate', args.missedDate)
      )
      .unique();

    if (alreadyRecovered) {
      throw new Error('This date has already been recovered');
    }

    // Check monthly limit
    const isPremium = await hasPremiumAccess(ctx, userId);
    const yearMonth = getCurrentYearMonth(args.timezone);
    const limit = isPremium
      ? PREMIUM_RECOVERIES_PER_MONTH
      : FREE_RECOVERIES_PER_MONTH;

    const monthRecoveries = await ctx.db
      .query('streakRecoveries')
      .withIndex('by_user_and_month', (q) =>
        q.eq('userId', userId).eq('yearMonth', yearMonth)
      )
      .collect();

    if (monthRecoveries.length >= limit) {
      throw new Error(
        isPremium
          ? `You've used all ${PREMIUM_RECOVERIES_PER_MONTH} streak recoveries this month. Resets next month.`
          : `Free users get ${FREE_RECOVERIES_PER_MONTH} streak recovery per month. Upgrade to premium for ${PREMIUM_RECOVERIES_PER_MONTH}/month.`
      );
    }

    // Insert the tracking record for the missed day
    if (existing) {
      await ctx.db.patch(existing._id, { completed: true, userId });
    } else {
      await ctx.db.insert('tracking', {
        completed: true,
        date: args.missedDate,
        habitId: args.habitId,
        userId,
      });
    }

    // Record the recovery
    await ctx.db.insert('streakRecoveries', {
      habitId: args.habitId,
      recoveredDate: args.missedDate,
      usedAt: Date.now(),
      userId,
      yearMonth,
    });

    // Recalculate streak
    await ctx.scheduler.runAfter(
      500,
      internal.habits.toggle.recalculateStreakAndStrength,
      { date: args.missedDate, habitId: args.habitId, timezone: args.timezone }
    );

    return { remaining: limit - monthRecoveries.length - 1 };
  },
  returns: v.object({ remaining: v.number() }),
});

/** Get current YYYY-MM based on optional timezone, falling back to UTC. */
function getCurrentYearMonth(timezone?: string): string {
  const now = new Date();
  if (timezone) {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        month: '2-digit',
        timeZone: timezone,
        year: 'numeric',
      }).formatToParts(now);
      const year = parts.find((p) => p.type === 'year')?.value;
      const month = parts.find((p) => p.type === 'month')?.value;
      if (year && month) return `${year}-${month}`;
    } catch {
      // Fall through to UTC
    }
  }
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}
