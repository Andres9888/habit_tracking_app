/**
 * NPS (Net Promoter Score) Convex Functions
 *
 * Handles NPS survey responses and user eligibility checks.
 * NPS is shown after 14 days of use OR 30 habit completions,
 * and only once every 90 days.
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Submit NPS survey response
 */
export const submitNPSResponse = mutation({
  args: {
    feedback: v.optional(v.string()),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Validate score is 0-10
    if (args.score < 0 || args.score > 10) {
      throw new Error('Score must be between 0 and 10');
    }

    // Get user
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    // Store the response
    await ctx.db.insert('npsResponses', {
      createdAt: Date.now(),
      feedback: args.feedback,
      score: args.score,
      userId: user.clerkId,
    });

    return { success: true };
  },
});

/**
 * Check if user is eligible to see NPS survey
 * Returns eligibility status and reason
 */
export const checkNPSEligibility = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { eligible: false, reason: 'not_authenticated' };
    }

    // Get user
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return { eligible: false, reason: 'user_not_found' };
    }

    // Check if user has already responded in the last 90 days
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const recentResponse = await ctx.db
      .query('npsResponses')
      .withIndex('by_user', (q) => q.eq('userId', user.clerkId))
      .filter((q) => q.gte(q.field('createdAt'), ninetyDaysAgo))
      .first();

    if (recentResponse) {
      return {
        eligible: false,
        lastResponseAt: recentResponse.createdAt,
        reason: 'recent_response',
      };
    }

    // Check account age (14 days minimum)
    const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const accountAge = user.createdAt ?? Date.now();

    if (accountAge > fourteenDaysAgo) {
      return {
        accountCreatedAt: accountAge,
        eligible: false,
        reason: 'account_too_new',
      };
    }

    // Count total habit completions
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', user.clerkId))
      .collect();

    const totalCompletions = habits.reduce(
      (sum, habit) => sum + (habit.totalCompletions ?? 0),
      0
    );

    // Check if user has 30+ completions
    if (totalCompletions < 30) {
      return {
        eligible: false,
        reason: 'insufficient_completions',
        totalCompletions,
      };
    }

    // User is eligible!
    return {
      eligible: true,
      reason: 'eligible',
      totalCompletions,
    };
  },
});

/**
 * Get latest NPS response for current user
 */
export const getLatestNPSResponse = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query('npsResponses')
      .withIndex('by_user', (q) => q.eq('userId', user.clerkId))
      .order('desc')
      .first();
  },
});

/**
 * Get NPS analytics (admin/analytics view)
 * Returns overall NPS score and distribution
 */
export const getNPSAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    // Get all NPS responses for this user (for personal analytics)
    const responses = await ctx.db
      .query('npsResponses')
      .withIndex('by_user', (q) => q.eq('userId', user.clerkId))
      .collect();

    if (responses.length === 0) {
      return {
        hasResponses: false,
        npsScore: null,
        responseCount: 0,
        totalDetractors: 0,
        totalPassives: 0,
        totalPromoters: 0,
      };
    }

    // Calculate NPS categories
    const promoters = responses.filter((r) => r.score >= 9).length;
    const passives = responses.filter((r) => r.score >= 7 && r.score <= 8)
      .length;
    const detractors = responses.filter((r) => r.score <= 6).length;

    // NPS = % Promoters - % Detractors (ranges from -100 to +100)
    const npsScore = ((promoters - detractors) / responses.length) * 100;

    return {
      hasResponses: true,
      npsScore: Math.round(npsScore),
      responseCount: responses.length,
      totalDetractors: detractors,
      totalPassives: passives,
      totalPromoters: promoters,
    };
  },
});
