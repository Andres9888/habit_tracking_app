/**
 * Users Convex Functions
 *
 * User management operations including creation,
 * profile updates, and Clerk identity sync.
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { enforceRateLimit } from './lib/rateLimit';
import { deleteCurrentUserDataHandler } from './deleteCurrentUserData';

/**
 * Get or create user based on Clerk authentication
 * Called automatically when user signs in
 */
export const getOrCreateUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // SR-2026-04-17-09: throttle user-upsert churn per Clerk id.
    await enforceRateLimit(ctx, identity.subject, 'user.getOrCreate');

    // Check if user already exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (existing) {
      // Update last login time
      await ctx.db.patch(existing._id, {
        lastLoginAt: Date.now(),
      });
      return existing._id;
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      clerkId: identity.subject,
      createdAt: Date.now(),
      email: identity.email ?? undefined,
      imageUrl: identity.pictureUrl ?? undefined,
      isAnonymous: false,
      lastLoginAt: Date.now(),
      name: identity.name ?? undefined,
    });

    return userId;
  },
});

/**
 * Get current authenticated user
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();
  },
});

export const deleteCurrentUserData = mutation({
  args: {},
  handler: deleteCurrentUserDataHandler,
  returns: v.object({
    deletedHabits: v.number(),
    deletedRateLimits: v.number(),
    deletedSettings: v.number(),
    deletedSubscriptions: v.number(),
    deletedTemplateUsage: v.number(),
    deletedTracking: v.number(),
    deletedUndoRecords: v.number(),
    deletedUsers: v.number(),
  }),
});

/**
 * Get user by ID
 */
export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Only allow users to view their own profile
    if (user.clerkId !== identity.subject) return null;

    return user;
  },
});
