/**
 * RevenueCat TRANSFER: an entitlement moved from one app user id to another
 * (default behaviour when a purchase is restored on a second account).
 * Revoke the source accounts and carry the live subscription to the targets.
 */
import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import type { MutationCtx } from '../_generated/server';
import { updateUserSettingsPremium } from './helpers';
import { isStaleWebhookTimestamp } from './premiumCheck';

type Sub = NonNullable<Awaited<ReturnType<typeof findSubscription>>>;

async function findSubscription(ctx: MutationCtx, clerkId: string) {
  return await ctx.db
    .query('subscriptions')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
    .first();
}

/** RevenueCat ids include anonymous ids; only act on ids we know as users. */
async function isKnownUser(ctx: MutationCtx, clerkId: string) {
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
    .first();
  return user !== null;
}

function isLive(sub: Sub, now: number) {
  const active = sub.status === 'active' || sub.status === 'trialing';
  return active && (sub.expiresAt === undefined || sub.expiresAt > now);
}

export const transferPremium = internalMutation({
  args: {
    eventId: v.string(),
    eventTimestamp: v.number(),
    fromClerkIds: v.array(v.string()),
    toClerkIds: v.array(v.string()),
  },
  handler: async (
    ctx,
    { eventId, eventTimestamp, fromClerkIds, toClerkIds }
  ) => {
    const now = Date.now();
    const audit = {
      lastWebhookAt: now,
      lastWebhookEvent: 'TRANSFER',
      lastWebhookEventId: eventId,
      lastWebhookEventTimestamp: eventTimestamp,
      updatedAt: now,
    };
    let carried: Sub | null = null;

    for (const clerkId of fromClerkIds) {
      const sub = await findSubscription(ctx, clerkId);
      if (sub?.lastWebhookEventId === eventId) return; // replay
      if (
        sub &&
        isStaleWebhookTimestamp(sub.lastWebhookEventTimestamp, eventTimestamp)
      ) {
        continue;
      }
      // Copy before the patch below marks the source row expired.
      if (sub && isLive(sub, now)) carried ??= { ...sub };
      if (sub) await ctx.db.patch(sub._id, { ...audit, status: 'expired' });
      if (sub || (await isKnownUser(ctx, clerkId))) {
        await updateUserSettingsPremium(ctx, clerkId, false);
      }
    }

    for (const clerkId of toClerkIds) {
      if (!(await isKnownUser(ctx, clerkId))) continue;
      const sub = await findSubscription(ctx, clerkId);
      if (sub?.lastWebhookEventId === eventId) continue;
      if (
        sub &&
        isStaleWebhookTimestamp(sub.lastWebhookEventTimestamp, eventTimestamp)
      ) {
        continue;
      }
      // Without a live source subscription there is nothing to prove the
      // target is entitled; a later purchase event will grant it.
      if (!carried) continue;
      const fields = {
        expiresAt: carried.expiresAt,
        hasBillingIssue: false,
        planType: carried.planType,
        productId: carried.productId,
        revenueCatId: carried.revenueCatId,
        status: carried.status,
        trialEndsAt: carried.trialEndsAt,
      };
      if (sub) {
        await ctx.db.patch(sub._id, { ...audit, ...fields });
      } else {
        await ctx.db.insert('subscriptions', {
          ...audit,
          ...fields,
          clerkId,
          createdAt: now,
          startedAt: carried.startedAt,
        });
      }
      await updateUserSettingsPremium(ctx, clerkId, true);
    }
  },
});
