/* eslint-disable max-lines */
/** Subscription mutations for RevenueCat webhook handling */
import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';
import { updateUserSettingsPremium } from './subscriptions/helpers';
import { isStaleWebhookTimestamp } from './subscriptions/premiumCheck';
import { recordProductEvent } from './lib/productEvents';

// Export premium checking utilities
export { hasPremiumAccess, requirePremium } from './subscriptions/premiumCheck';

const subscriptionPlanType = v.union(v.literal('monthly'), v.literal('yearly'));
type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'past_due'
  | 'trialing';

/** Get subscription by Clerk ID */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== clerkId) {
      throw new Error('Not authorized: can only query your own subscription');
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

/**
 * Grant premium access (INITIAL_PURCHASE, RENEWAL, PRODUCT_CHANGE)
 *
 * SEC-002: Server-side premium validation
 * SEC-005: Premium feature gating - updates userSettings.hasPremium which gates:
 *   - Voice notes: unlimited (vs 1 free per habit)
 *   - Vision board: unlimited (vs 4 free per habit)
 *   - Other premium features as defined in FREE_TIER_LIMITS
 */
export const grantPremium = internalMutation({
  args: {
    clerkId: v.string(),
    eventId: v.string(),
    eventTimestamp: v.number(),
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

    // Idempotency: skip if we already processed this exact event
    if (existing && existing.lastWebhookEventId === args.eventId) {
      return;
    }

    if (
      existing &&
      isStaleWebhookTimestamp(
        existing.lastWebhookEventTimestamp,
        args.eventTimestamp
      )
    ) {
      return;
    }

    // eslint-disable-next-line unicorn/prefer-ternary
    if (existing) {
      await ctx.db.patch(existing._id, {
        expiresAt: args.expiresAt,
        hasBillingIssue: false,
        lastWebhookAt: now,
        lastWebhookEvent: args.eventType,
        lastWebhookEventId: args.eventId,
        lastWebhookEventTimestamp: args.eventTimestamp,
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
        lastWebhookEventId: args.eventId,
        lastWebhookEventTimestamp: args.eventTimestamp,
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
    if (args.eventType === 'INITIAL_PURCHASE') {
      await recordProductEvent(ctx, args.clerkId, 'purchase_succeeded', {
        source: args.isTrialing ? 'revenuecat_trial' : 'revenuecat_paid',
      });
    }
  },
});

/** Reconcile durable entitlement state from RevenueCat's canonical subscriber API. */
export const reconcileRevenueCatSubscriber = internalMutation({
  args: {
    cancelledAt: v.optional(v.number()),
    clerkId: v.string(),
    eventId: v.string(),
    eventTimestamp: v.number(),
    eventType: v.string(),
    expiresAt: v.optional(v.number()),
    hasBillingIssue: v.boolean(),
    isActive: v.boolean(),
    isTrialing: v.boolean(),
    planType: subscriptionPlanType,
    productId: v.optional(v.string()),
    revenueCatId: v.optional(v.string()),
    trialEndsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existing && existing.lastWebhookEventId === args.eventId) {
      return;
    }

    if (
      existing &&
      isStaleWebhookTimestamp(
        existing.lastWebhookEventTimestamp,
        args.eventTimestamp
      )
    ) {
      return;
    }

    const status: SubscriptionStatus = args.isActive
      ? args.hasBillingIssue
        ? 'past_due'
        : args.isTrialing
          ? 'trialing'
          : args.cancelledAt
            ? 'cancelled'
            : 'active'
      : 'expired';

    const patch = {
      cancelledAt: args.cancelledAt,
      expiresAt: args.expiresAt,
      hasBillingIssue: args.hasBillingIssue,
      lastWebhookAt: now,
      lastWebhookEvent: args.eventType,
      lastWebhookEventId: args.eventId,
      lastWebhookEventTimestamp: args.eventTimestamp,
      planType: args.planType,
      productId: args.productId,
      revenueCatId: args.revenueCatId,
      status,
      trialEndsAt: args.trialEndsAt,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert('subscriptions', {
        ...patch,
        clerkId: args.clerkId,
        createdAt: now,
        startedAt: now,
      });
    }

    await updateUserSettingsPremium(ctx, args.clerkId, args.isActive);
    if (args.eventType === 'INITIAL_PURCHASE' && args.isActive) {
      await recordProductEvent(ctx, args.clerkId, 'purchase_succeeded', {
        source: args.isTrialing ? 'revenuecat_trial' : 'revenuecat_paid',
      });
    }
  },
});

/**
 * Revoke premium access (CANCELLATION, EXPIRATION)
 *
 * CANCELLATION: User turned off auto-renew but still has access until the
 * period ends.  We mark the subscription as "cancelled" but do NOT revoke
 * premium — the user already paid for the current period.
 *
 * EXPIRATION: The paid period has ended.  Now we actually revoke access.
 *
 * SEC-002: Server-side premium validation
 * Updates userSettings.hasPremium which affects:
 *   - Voice notes: limited to 1 per habit
 *   - Vision board: limited to 4 per habit
 */
export const revokePremium = internalMutation({
  args: {
    clerkId: v.string(),
    eventId: v.string(),
    eventTimestamp: v.number(),
    eventType: v.string(),
  },
  handler: async (ctx, { clerkId, eventId, eventTimestamp, eventType }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();

    if (existing && existing.lastWebhookEventId === eventId) {
      return;
    }

    if (
      existing &&
      isStaleWebhookTimestamp(
        existing.lastWebhookEventTimestamp,
        eventTimestamp
      )
    ) {
      return;
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        cancelledAt: eventType === 'CANCELLATION' ? now : existing.cancelledAt,
        lastWebhookAt: now,
        lastWebhookEvent: eventType,
        lastWebhookEventId: eventId,
        lastWebhookEventTimestamp: eventTimestamp,
        status: eventType === 'CANCELLATION' ? 'cancelled' : 'expired',
        updatedAt: now,
      });
    }
    // Only revoke premium access on EXPIRATION.
    // CANCELLATION means the user cancelled auto-renew but their current
    // billing period is still active — they should keep premium until it expires.
    if (eventType === 'EXPIRATION') {
      await updateUserSettingsPremium(ctx, clerkId, false);
    }
  },
});

/** Set billing issue flag (BILLING_ISSUE) — user keeps access during grace period */
export const setBillingIssue = internalMutation({
  args: {
    clerkId: v.string(),
    eventId: v.string(),
    eventTimestamp: v.number(),
  },
  handler: async (ctx, { clerkId, eventId, eventTimestamp }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();

    if (existing && existing.lastWebhookEventId === eventId) {
      return;
    }

    if (
      existing &&
      isStaleWebhookTimestamp(
        existing.lastWebhookEventTimestamp,
        eventTimestamp
      )
    ) {
      return;
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        hasBillingIssue: true,
        lastWebhookAt: now,
        lastWebhookEvent: 'BILLING_ISSUE',
        lastWebhookEventId: eventId,
        lastWebhookEventTimestamp: eventTimestamp,
        status: 'past_due',
        updatedAt: now,
      });
    }
  },
});

/** Transfer entitlements between RevenueCat App User IDs. */
export const transferPremium = internalMutation({
  args: {
    clerkId: v.string(),
    eventId: v.string(),
    eventTimestamp: v.number(),
    transferredFrom: v.array(v.string()),
    transferredTo: v.array(v.string()),
  },
  handler: async (
    ctx,
    { clerkId, eventId, eventTimestamp, transferredFrom, transferredTo }
  ) => {
    const now = Date.now();
    const destinationIds = new Set([...transferredTo, clerkId]);

    for (const sourceClerkId of transferredFrom) {
      if (destinationIds.has(sourceClerkId)) continue;

      const existing = await ctx.db
        .query('subscriptions')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', sourceClerkId))
        .first();

      if (!existing || existing.lastWebhookEventId === eventId) {
        continue;
      }

      if (
        isStaleWebhookTimestamp(
          existing.lastWebhookEventTimestamp,
          eventTimestamp
        )
      ) {
        continue;
      }

      await ctx.db.patch(existing._id, {
        hasBillingIssue: false,
        lastWebhookAt: now,
        lastWebhookEvent: 'TRANSFER',
        lastWebhookEventId: eventId,
        lastWebhookEventTimestamp: eventTimestamp,
        status: 'expired',
        updatedAt: now,
      });
      await updateUserSettingsPremium(ctx, sourceClerkId, false);
    }

    for (const destinationClerkId of destinationIds) {
      const existing = await ctx.db
        .query('subscriptions')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', destinationClerkId))
        .first();

      if (existing && existing.lastWebhookEventId === eventId) {
        continue;
      }

      if (
        existing &&
        isStaleWebhookTimestamp(
          existing.lastWebhookEventTimestamp,
          eventTimestamp
        )
      ) {
        continue;
      }

      // eslint-disable-next-line unicorn/prefer-ternary
      if (existing) {
        await ctx.db.patch(existing._id, {
          cancelledAt: undefined,
          hasBillingIssue: false,
          lastWebhookAt: now,
          lastWebhookEvent: 'TRANSFER',
          lastWebhookEventId: eventId,
          lastWebhookEventTimestamp: eventTimestamp,
          status: 'active',
          updatedAt: now,
        });
      } else {
        await ctx.db.insert('subscriptions', {
          clerkId: destinationClerkId,
          createdAt: now,
          hasBillingIssue: false,
          lastWebhookAt: now,
          lastWebhookEvent: 'TRANSFER',
          lastWebhookEventId: eventId,
          lastWebhookEventTimestamp: eventTimestamp,
          planType: 'monthly',
          revenueCatId: destinationClerkId,
          startedAt: now,
          status: 'active',
          updatedAt: now,
        });
      }

      await updateUserSettingsPremium(ctx, destinationClerkId, true);
    }
  },
});

/** Handle refund and refund reversal webhook events idempotently. */
export const handleRefund = internalMutation({
  args: {
    clerkId: v.string(),
    eventId: v.string(),
    eventTimestamp: v.number(),
    eventType: v.string(),
    expiresAt: v.optional(v.number()),
    isTrialing: v.optional(v.boolean()),
    productId: v.optional(v.string()),
    revenueCatId: v.optional(v.string()),
    trialEndsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('subscriptions')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existing && existing.lastWebhookEventId === args.eventId) {
      return;
    }

    if (
      existing &&
      isStaleWebhookTimestamp(
        existing.lastWebhookEventTimestamp,
        args.eventTimestamp
      )
    ) {
      return;
    }

    const isReversal = args.eventType === 'REFUND_REVERSED';
    const planType = args.productId?.includes('yearly') ? 'yearly' : 'monthly';
    const status = isReversal
      ? args.isTrialing
        ? 'trialing'
        : 'active'
      : 'expired';

    // eslint-disable-next-line unicorn/prefer-ternary
    if (existing) {
      await ctx.db.patch(existing._id, {
        expiresAt: args.expiresAt ?? existing.expiresAt,
        hasBillingIssue: false,
        lastWebhookAt: now,
        lastWebhookEvent: args.eventType,
        lastWebhookEventId: args.eventId,
        lastWebhookEventTimestamp: args.eventTimestamp,
        planType,
        productId: args.productId ?? existing.productId,
        status,
        trialEndsAt: args.trialEndsAt ?? existing.trialEndsAt,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('subscriptions', {
        clerkId: args.clerkId,
        createdAt: now,
        expiresAt: args.expiresAt,
        hasBillingIssue: false,
        lastWebhookAt: now,
        lastWebhookEvent: args.eventType,
        lastWebhookEventId: args.eventId,
        lastWebhookEventTimestamp: args.eventTimestamp,
        planType,
        productId: args.productId,
        revenueCatId: args.revenueCatId,
        startedAt: now,
        status,
        trialEndsAt: args.trialEndsAt,
        updatedAt: now,
      });
    }

    await updateUserSettingsPremium(ctx, args.clerkId, isReversal);
  },
});
