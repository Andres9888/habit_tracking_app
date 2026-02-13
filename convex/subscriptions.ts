/** Subscription mutations for RevenueCat webhook handling */
import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';
import { updateUserSettingsPremium } from './subscriptions/helpers';

/** Get subscription by Clerk ID */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
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

/** Get current user's subscription status (UI backup to SDK) */
export const getCurrentUserSubscription = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();
  },
});

/** Grant premium access (INITIAL_PURCHASE, RENEWAL, PRODUCT_CHANGE) */
export const grantPremium = internalMutation({
  args: {
    clerkId: v.string(),
    eventType: v.string(),
    expiresAt: v.optional(v.number()),
    isTrialing: v.optional(v.boolean()),
    productId: v.optional(v.string()),
    revenueCatId: v.optional(v.string()),
    trialEndsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const status = args.isTrialing ? 'trialing' : 'active';
    const planType = args.productId?.includes('yearly') ? 'yearly' : 'monthly';
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();
    // eslint-disable-next-line unicorn/prefer-ternary
    if (existing) {
      await ctx.db.patch(existing._id, {
        expiresAt: args.expiresAt,
        hasBillingIssue: false,
        lastWebhookAt: now,
        lastWebhookEvent: args.eventType,
        planType,
        productId: args.productId,
        status,
        trialEndsAt: args.trialEndsAt,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('subscriptions', {
        clerkId: args.clerkId,
        createdAt: now,
        expiresAt: args.expiresAt,
        lastWebhookAt: now,
        lastWebhookEvent: args.eventType,
        planType,
        productId: args.productId,
        revenueCatId: args.revenueCatId,
        startedAt: now,
        status,
        trialEndsAt: args.trialEndsAt,
        updatedAt: now,
      });
    }
    await updateUserSettingsPremium(ctx, args.clerkId, true);
  },
});

/** Revoke premium access (CANCELLATION, EXPIRATION) */
export const revokePremium = internalMutation({
  args: { clerkId: v.string(), eventType: v.string() },
  handler: async (ctx, { clerkId, eventType }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        cancelledAt: eventType === 'CANCELLATION' ? now : existing.cancelledAt,
        lastWebhookAt: now,
        lastWebhookEvent: eventType,
        status: eventType === 'CANCELLATION' ? 'cancelled' : 'expired',
        updatedAt: now,
      });
    }
    await updateUserSettingsPremium(ctx, clerkId, false);
  },
});

/** Set billing issue flag (BILLING_ISSUE) — user keeps access during grace period */
export const setBillingIssue = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        hasBillingIssue: true,
        lastWebhookAt: now,
        lastWebhookEvent: 'BILLING_ISSUE',
        status: 'past_due',
        updatedAt: now,
      });
    }
  },
});
