/**
 * Social Accountability - Shared Dashboard Backend
 *
 * Provides functionality for:
 * - Creating/generating shareable dashboard links (premium)
 * - Fetching public dashboard data by token
 * - Toggling sharing on/off
 */

import { v } from 'convex/values';
import { internalMutation, mutation, query } from './_generated/server';
import { Doc } from './_generated/dataModel';

/** Generate a unique share token */
function generateShareToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/** Get or create a shared dashboard for the current user (Premium) */
export const getOrCreateSharedDashboard = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Must be logged in to create a shared dashboard');
    }

    // Check if user has premium (we'll validate this on the client side too)
    const subscription = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    const isPremium =
      subscription?.status === 'active' || subscription?.status === 'trialing';

    if (!isPremium) {
      throw new Error('Premium subscription required for social sharing');
    }

    // Check if shared dashboard already exists
    const existing = await ctx.db
      .query('sharedDashboards')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .first();

    if (existing) {
      return existing;
    }

    // Create new shared dashboard
    const now = Date.now();
    const dashboardId = await ctx.db.insert('sharedDashboards', {
      shareToken: generateShareToken(),
      userId: identity.subject,
      displayName: identity.name ?? 'My Habits',
      isEnabled: true,
      enabledAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(dashboardId);
  },
});

/** Toggle sharing on/off */
export const toggleSharing = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, { enabled }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Must be logged in to manage sharing');
    }

    const dashboard = await ctx.db
      .query('sharedDashboards')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .first();

    if (!dashboard) {
      throw new Error('Shared dashboard not found');
    }

    await ctx.db.patch(dashboard._id, {
      isEnabled: enabled,
      enabledAt: enabled ? Date.now() : dashboard.enabledAt,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(dashboard._id);
  },
});

/** Update display name */
export const updateDisplayName = mutation({
  args: { displayName: v.string() },
  handler: async (ctx, { displayName }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Must be logged in to update display name');
    }

    const dashboard = await ctx.db
      .query('sharedDashboards')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .first();

    if (!dashboard) {
      throw new Error('Shared dashboard not found');
    }

    await ctx.db.patch(dashboard._id, {
      displayName,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(dashboard._id);
  },
});

/** Regenerate share token */
export const regenerateShareToken = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Must be logged in to regenerate token');
    }

    const dashboard = await ctx.db
      .query('sharedDashboards')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .first();

    if (!dashboard) {
      throw new Error('Shared dashboard not found');
    }

    await ctx.db.patch(dashboard._id, {
      shareToken: generateShareToken(),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(dashboard._id);
  },
});

/** Get current user's shared dashboard (for settings) */
export const getMySharedDashboard = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query('sharedDashboards')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .first();
  },
});

/** Public query: Get shared dashboard data by token (no auth required) */
export const getSharedDashboardByToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const dashboard = await ctx.db
      .query('sharedDashboards')
      .withIndex('by_token', (q) => q.eq('shareToken', token))
      .first();

    if (!dashboard || !dashboard.isEnabled) {
      return null;
    }

    // Get user's active habits (non-archived, non-paused)
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', dashboard.userId))
      .collect();

    const activeHabits = habits.filter(
      (h) => h.archived !== true && h.paused !== true
    );

    // Get tracking data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const trackingRecords = await ctx.db
      .query('tracking')
      .filter((r) => r.or(
        ...activeHabits.map((h) => r.eq(h._id, r.field('habitId')))
      ))
      .collect();

    // Filter to last 30 days
    const recentTracking = trackingRecords.filter(
      (t) => t.date >= thirtyDaysAgoStr
    );

    // Calculate stats for each habit
    const habitsWithStats = activeHabits.map((habit) => {
      const habitTracking = recentTracking.filter(
        (t) => t.habitId === habit._id && t.completed
      );

      // Last 7 days completion rate
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
      const last7DaysTracking = habitTracking.filter(
        (t) => t.date >= sevenDaysAgoStr
      );
      const last7DaysRate = (last7DaysTracking.length / 7) * 100;

      // Last 30 days completion rate
      const last30DaysRate = (habitTracking.length / 30) * 100;

      return {
        id: habit._id,
        name: habit.name,
        icon: habit.icon,
        iconColor: habit.iconColor,
        currentStreak: habit.currentStreak ?? 0,
        bestStreak: habit.bestStreak ?? 0,
        totalCompletions: habit.totalCompletions ?? 0,
        last7DaysRate: Math.round(last7DaysRate),
        last30DaysRate: Math.round(last30DaysRate),
        strengthLevel: habit.strengthLevel,
      };
    });

    // Calculate overall stats
    const totalActiveHabits = activeHabits.length;
    const totalCurrentStreaks = activeHabits.reduce(
      (sum, h) => sum + (h.currentStreak ?? 0),
      0
    );
    const avgCompletionRate =
      totalActiveHabits > 0
        ? Math.round(
            habitsWithStats.reduce((sum, h) => sum + h.last7DaysRate, 0) /
              totalActiveHabits
          )
        : 0;

    return {
      displayName: dashboard.displayName ?? 'My Habits',
      enabledAt: dashboard.enabledAt,
      stats: {
        totalActiveHabits,
        totalCurrentStreaks,
        avgCompletionRate,
      },
      habits: habitsWithStats,
    };
  },
});
