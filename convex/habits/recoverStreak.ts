/**
 * Streak Recovery Mutation
 * Premium feature to restore broken streaks by spending coins
 */

import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { hasPremiumAccess } from '../subscriptions/premiumCheck';
import { calculateStreakFromHistory } from '../streakUtils';

/**
 * Calculate recovery cost based on streak length
 * 1 week (7 days) = 1 coin
 * 1 month (30 days) = 3 coins
 * Scales linearly between these points
 */
export function calculateRecoveryCost(streakLength: number): number {
  if (streakLength < 7) return 0; // Free recovery for streaks < 7 days
  if (streakLength >= 30) return 3; // Max 3 coins for streaks >= 30 days
  // Linear scaling: 1-3 coins for 7-29 days
  return Math.ceil(1 + ((streakLength - 7) / 22) * 2);
}

/**
 * Get monthly recovery count for a habit
 */
export async function getMonthlyRecoveryCount(
  ctx: any,
  habitId: string,
  monthKey: string
): Promise<number> {
  const recoveries = await ctx.db
    .query('streakRecoveries')
    .withIndex('by_habit_and_month', (q) =>
      q.eq('habitId', habitId).eq('monthKey', monthKey)
    )
    .collect();

  return recoveries.length;
}

/**
 * Get current month key (format: YYYY-MM)
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Recover a broken streak (Premium Feature)
 *
 * Cost: Scales with streak length
 * - < 7 days: Free
 * - 7-29 days: 1-2 coins (linear scale)
 * - >= 30 days: 3 coins
 *
 * Limits:
 * - Free users: 1 recovery per habit per month
 * - Premium users: 3 recoveries per habit per month
 */
export const recoverStreak = mutation({
  args: {
    habitId: v.id('habits'),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated: Must be logged in');

    const userId = identity.subject;
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== userId) throw new Error('Not authorized');

    // Get user's premium status
    const hasPremium = await hasPremiumAccess(ctx, userId);
    const maxRecoveries = hasPremium ? 3 : 1;

    // Check monthly limit
    const monthKey = getCurrentMonthKey();
    const recoveryCount = await getMonthlyRecoveryCount(ctx, args.habitId, monthKey);
    if (recoveryCount >= maxRecoveries) {
      throw new Error(
        hasPremium
          ? 'Monthly limit reached: Premium users can recover up to 3 times per habit per month'
          : 'Monthly limit reached: Free users can recover 1 time per habit per month. Upgrade to premium for 3 recoveries.'
      );
    }

    // Get tracking history
    const allTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    const tracking = allTracking.map((r) => ({
      completed: r.completed,
      date: r.date,
    }));

    // Calculate current streak to find the broken streak
    const streakData = calculateStreakFromHistory(tracking, '2025-01-01'); // Use past date to find best streak
    const bestStreak = streakData.bestStreak;

    // Only allow recovery if there's a significant streak to recover
    if (bestStreak < 7) {
      throw new Error('Streak too short to recover (minimum 7 days required)');
    }

    // Calculate cost
    const cost = calculateRecoveryCost(bestStreak);

    // Get user's coin balance (check userSettings for now)
    const userSettings = await ctx.db
      .query('userSettings')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    // For now, assume unlimited coins or track separately
    // TODO: Implement coin balance tracking in userSettings

    // Find the broken date (first missed day after the best streak)
    // This is a simplified approach - in production, track when streak was broken
    const completedDates = tracking
      .filter((t) => t.completed)
      .map((t) => t.date)
      .sort((a, b) => b.localeCompare(a));

    let brokenDate = '';
    if (completedDates.length > 0) {
      // Look for the gap in the streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let streakCount = 0;
      let lastDate = today.toISOString().split('T')[0];

      // Count backward from today
      for (const date of completedDates) {
        const dateObj = new Date(date);
        const lastDateObj = new Date(lastDate);
        const diff = Math.floor(
          (lastDateObj.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diff === 0 || diff === 1) {
          streakCount++;
          lastDate = date;
        } else {
          brokenDate = lastDate;
          break;
        }
      }
    }

    // Record the recovery
    const recoveryId = await ctx.db.insert('streakRecoveries', {
      habitId: args.habitId,
      userId,
      recoveredStreakLength: bestStreak,
      cost,
      brokenDate,
      monthKey,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Restore the streak by setting currentStreak to the recovered value
    await ctx.db.patch(args.habitId, {
      currentStreak: bestStreak,
    });

    return {
      success: true,
      recoveryId,
      recoveredStreakLength: bestStreak,
      cost,
      remainingRecoveries: maxRecoveries - recoveryCount - 1,
    };
  },
  returns: v.object({
    success: v.boolean(),
    recoveryId: v.id('streakRecoveries'),
    recoveredStreakLength: v.number(),
    cost: v.number(),
    remainingRecoveries: v.number(),
  }),
});

/**
 * Get recovery history for a habit
 */
export const getRecoveryHistory = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) throw new Error('Not authorized');

    const recoveries = await ctx.db
      .query('streakRecoveries')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc')
      .collect();

    return recoveries;
  },
  returns: v.array(
    v.object({
      _id: v.id('streakRecoveries'),
      _creationTime: v.number(),
      recoveredStreakLength: v.number(),
      cost: v.number(),
      brokenDate: v.string(),
      monthKey: v.string(),
      createdAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

/**
 * Get all recoveries for the current user
 */
export const getUserRecoveries = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const recoveries = await ctx.db
      .query('streakRecoveries')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .collect();

    // Fetch habit names for display
    const habitsWithNames = await Promise.all(
      recoveries.map(async (recovery) => {
        const habit = await ctx.db.get(recovery.habitId);
        return {
          ...recovery,
          habitName: habit?.name ?? 'Unknown Habit',
        };
      })
    );

    return habitsWithNames;
  },
  returns: v.array(
    v.object({
      _id: v.id('streakRecoveries'),
      _creationTime: v.number(),
      recoveredStreakLength: v.number(),
      cost: v.number(),
      brokenDate: v.string(),
      monthKey: v.string(),
      createdAt: v.number(),
      userId: v.optional(v.string()),
      habitName: v.string(),
    })
  ),
});

/**
 * Check if user can recover a habit's streak
 */
export const canRecoverStreak = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { canRecover: false, reason: 'Not authenticated' };
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      return { canRecover: false, reason: 'Habit not found' };
    }

    if (habit.userId !== identity.subject) {
      return { canRecover: false, reason: 'Not authorized' };
    }

    // Check if streak is broken (currentStreak < bestStreak)
    if (!habit.currentStreak || !habit.bestStreak) {
      return { canRecover: false, reason: 'No streak data available' };
    }

    if (habit.currentStreak >= habit.bestStreak) {
      return { canRecover: false, reason: 'Streak is active, not broken' };
    }

    if (habit.bestStreak < 7) {
      return { canRecover: false, reason: 'Streak too short (minimum 7 days)' };
    }

    // Check monthly limit
    const hasPremium = await hasPremiumAccess(ctx, identity.subject);
    const maxRecoveries = hasPremium ? 3 : 1;
    const monthKey = getCurrentMonthKey();
    const recoveryCount = await getMonthlyRecoveryCount(ctx, args.habitId, monthKey);

    if (recoveryCount >= maxRecoveries) {
      return {
        canRecover: false,
        reason: hasPremium
          ? 'Monthly limit reached (3 recoveries)'
          : 'Monthly limit reached (1 recovery)',
      };
    }

    // Calculate cost
    const cost = calculateRecoveryCost(habit.bestStreak);

    return {
      canRecover: true,
      streakLength: habit.bestStreak,
      cost,
      remainingRecoveries: maxRecoveries - recoveryCount,
    };
  },
  returns: v.union(
    v.object({
      canRecover: v.literal(true),
      streakLength: v.number(),
      cost: v.number(),
      remainingRecoveries: v.number(),
    }),
    v.object({
      canRecover: v.literal(false),
      reason: v.string(),
    })
  ),
});
