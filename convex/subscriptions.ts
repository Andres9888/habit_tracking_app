/**
 * Subscription mutations for RevenueCat webhook handling
 *
 * These mutations are called by the HTTP webhook handler to update
 * subscription state based on RevenueCat events.
 */

import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';
import type { MutationCtx } from './_generated/server';

/**
 * Get subscription by Clerk ID
 */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    // SEC: Auth check — only allow users to query their own subscription
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== clerkId) {
      throw new Error('Unauthorized: can only query your own subscription');
    }

    return await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
  },
});

/**
 * Get current user's subscription status
 * Used by the UI as a backup to the SDK
 */
export const getCurrentUserSubscription = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkId = identity.subject;

    return await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
  },
});

/**
 * Grant premium access (called on INITIAL_PURCHASE, RENEWAL, PRODUCT_CHANGE)
 */
export const grantPremium = internalMutation({
  args: {
    clerkId: v.string(),
    revenueCatId: v.optional(v.string()),
    productId: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    isTrialing: v.optional(v.boolean()),
    eventType: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const status = args.isTrialing ? 'trialing' : 'active';

    // Find existing subscription
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        status,
        productId: args.productId,
        planType: args.productId?.includes('yearly') ? 'yearly' : 'monthly',
        expiresAt: args.expiresAt,
        trialEndsAt: args.trialEndsAt,
        hasBillingIssue: false,
        updatedAt: now,
        lastWebhookEvent: args.eventType,
        lastWebhookAt: now,
      });
    } else {
      // Create new subscription
      await ctx.db.insert('subscriptions', {
        clerkId: args.clerkId,
        revenueCatId: args.revenueCatId,
        status,
        productId: args.productId,
        planType: args.productId?.includes('yearly') ? 'yearly' : 'monthly',
        startedAt: now,
        expiresAt: args.expiresAt,
        trialEndsAt: args.trialEndsAt,
        createdAt: now,
        updatedAt: now,
        lastWebhookEvent: args.eventType,
        lastWebhookAt: now,
      });
    }

    // Also update userSettings.hasPremium for fast UI access
    await updateUserSettingsPremium(ctx, args.clerkId, true);
  },
});

/**
 * Revoke premium access (called on CANCELLATION, EXPIRATION)
 */
export const revokePremium = internalMutation({
  args: {
    clerkId: v.string(),
    eventType: v.string(),
  },
  handler: async (ctx, { clerkId, eventType }) => {
    const now = Date.now();

    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();

    if (existing) {
      const status = eventType === 'CANCELLATION' ? 'cancelled' : 'expired';

      await ctx.db.patch(existing._id, {
        status,
        cancelledAt: eventType === 'CANCELLATION' ? now : existing.cancelledAt,
        updatedAt: now,
        lastWebhookEvent: eventType,
        lastWebhookAt: now,
      });
    }

    // Update userSettings.hasPremium
    await updateUserSettingsPremium(ctx, clerkId, false);
  },
});

/**
 * Set billing issue flag (called on BILLING_ISSUE)
 * User keeps access during grace period
 */
export const setBillingIssue = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const now = Date.now();

    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: 'past_due',
        hasBillingIssue: true,
        updatedAt: now,
        lastWebhookEvent: 'BILLING_ISSUE',
        lastWebhookAt: now,
      });
    }
    // Note: We don't revoke premium during billing issues (grace period)
  },
});

/**
 * Helper to update userSettings.hasPremium
 * This is the fast-path used by the UI
 */
async function updateUserSettingsPremium(
  ctx: MutationCtx,
  clerkId: string,
  hasPremium: boolean
) {
  // Find their settings directly by clerkId (userId stores Clerk subject ID)
  const settings = await ctx.db
    .query('userSettings')
    .filter((q) => q.eq(q.field('userId'), clerkId))
    .first();

  if (settings) {
    await ctx.db.patch(settings._id, { hasPremium });
    console.log(
      '[subscriptions] Updated hasPremium:',
      hasPremium,
      'for clerkId:',
      clerkId
    );
  } else {
    console.log('[subscriptions] No settings found for clerkId:', clerkId);
  }
}
