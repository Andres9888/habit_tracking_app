/* eslint-disable max-lines */
/** Subscription mutations for RevenueCat webhook handling */
import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';
import { updateUserSettingsPremium } from './subscriptions/helpers';
import { isStaleWebhookTimestamp } from './subscriptions/premiumCheck';

// Export premium checking utilities
export { hasPremiumAccess, requirePremium } from './subscriptions/premiumCheck';

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
    // A delayed purchase event can arrive after the period it describes has
    // already ended (for example behind an EXPIRATION that found no row).
    // Record it, but never turn the entitlement on for a past period.
    const alreadyExpired =
      args.expiresAt !== undefined && args.expiresAt <= now;
    const status = alreadyExpired
      ? 'expired'
      : args.isTrialing
        ? 'trialing'
        : 'active';
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
    await updateUserSettingsPremium(ctx, args.clerkId, !alreadyExpired);
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

    const status = eventType === 'CANCELLATION' ? 'cancelled' : 'expired';
    // eslint-disable-next-line unicorn/prefer-ternary
    if (existing) {
      await ctx.db.patch(existing._id, {
        cancelledAt: eventType === 'CANCELLATION' ? now : existing.cancelledAt,
        lastWebhookAt: now,
        lastWebhookEvent: eventType,
        lastWebhookEventId: eventId,
        lastWebhookEventTimestamp: eventTimestamp,
        status,
        updatedAt: now,
      });
    } else {
      // Tombstone. Without a row carrying this event's timestamp, an older
      // purchase event delivered later would pass the staleness check and
      // re-grant premium for a period that has already ended.
      await ctx.db.insert('subscriptions', {
        cancelledAt: eventType === 'CANCELLATION' ? now : undefined,
        clerkId,
        createdAt: now,
        lastWebhookAt: now,
        lastWebhookEvent: eventType,
        lastWebhookEventId: eventId,
        lastWebhookEventTimestamp: eventTimestamp,
        startedAt: now,
        status,
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
