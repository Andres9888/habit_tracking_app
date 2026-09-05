/**
 * Users Convex Functions
 *
 * User management operations including creation,
 * profile updates, and Clerk identity sync.
 */

import { mutation, query } from './_generated/server';
import type { MutationCtx } from './_generated/server';
import { v } from 'convex/values';
import { enforceRateLimit, RATE_LIMITS } from './lib/rateLimit';

async function deleteDocuments(
  ctx: MutationCtx,
  ids: Array<Parameters<MutationCtx['db']['delete']>[0]>
): Promise<number> {
  for (const id of ids) {
    await ctx.db.delete(id);
  }

  return ids.length;
}

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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();
    const tracking = await ctx.db
      .query('tracking')
      .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
      .collect();
    const settings = await ctx.db
      .query('userSettings')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();
    const subscriptions = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', userId))
      .collect();
    const users = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', userId))
      .collect();
    const ownedStorage = await ctx.db
      .query('storageOwnership')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .collect();
    const deletedHabits = await ctx.db
      .query('deletedHabits')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();
    const templateUsage = await ctx.db
      .query('templateUsage')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    // SR-2026-04-17-09 follow-up: keep GDPR delete complete when the
    // rate-limits table was added. Purge per-user throttle rows, but keep
    // windows that are still open: deleting them would let a caller reset
    // an exhausted budget (e.g. uploads) by deleting and recreating the
    // account with the same Clerk id. Open windows hold only an opaque id
    // and a counter, and close on their own within the hour.
    const now = Date.now();
    const rateLimits = (
      await ctx.db
        .query('rateLimits')
        .withIndex('by_user_and_action', (q) => q.eq('userId', userId))
        .collect()
    ).filter((row) => {
      const config = RATE_LIMITS[row.action as keyof typeof RATE_LIMITS];
      return !config || row.windowStartMs + config.windowMs <= now;
    });

    const deletedTemplateUsage = await deleteDocuments(
      ctx,
      templateUsage.map((entry) => entry._id)
    );
    const deletedRateLimits = await deleteDocuments(
      ctx,
      rateLimits.map((entry) => entry._id)
    );
    const deletedTracking = await deleteDocuments(
      ctx,
      tracking.map((entry) => entry._id)
    );
    const deletedHabitsCount = await deleteDocuments(
      ctx,
      habits.map((entry) => entry._id)
    );
    const deletedSettings = await deleteDocuments(
      ctx,
      settings.map((entry) => entry._id)
    );
    const deletedSubscriptions = await deleteDocuments(
      ctx,
      subscriptions.map((entry) => entry._id)
    );
    const deletedUsers = await deleteDocuments(
      ctx,
      users.map((entry) => entry._id)
    );
    const deletedUndoRecords = await deleteDocuments(
      ctx,
      deletedHabits.map((entry) => entry._id)
    );

    const profileStorageIds = new Set(
      users
        .map((user) => user.profileImageStorageId)
        .filter(
          (storageId): storageId is NonNullable<typeof storageId> =>
            storageId !== undefined
        )
    );
    for (const ownership of ownedStorage) {
      profileStorageIds.add(ownership.storageId);
      await ctx.db.delete(ownership._id);
    }
    for (const storageId of profileStorageIds) {
      try {
        await ctx.storage.delete(storageId);
      } catch {
        // The database deletion must remain complete if a blob was already
        // removed by an earlier cleanup attempt.
      }
    }

    return {
      deletedHabits: deletedHabitsCount,
      deletedRateLimits,
      deletedSettings,
      deletedSubscriptions,
      deletedTemplateUsage,
      deletedTracking,
      deletedUndoRecords,
      deletedUsers,
    };
  },
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
