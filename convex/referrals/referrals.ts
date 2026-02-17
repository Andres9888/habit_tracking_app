/**
 * Referral System - Convex Functions
 *
 * Enables organic growth through user-to-user referral codes.
 * Both the referrer and referred user receive 1 week of premium free.
 */

import { mutation, query } from '../_generated/server';
import { v } from 'convex/values';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Generate a random 8-character alphanumeric code */
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/1/O/0 to avoid confusion
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Get or create the current user's referral code
 */
export const getMyReferralCode = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const existing = await ctx.db
      .query('referralCodes')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .unique();

    return existing?.code ?? null;
  },
});

/**
 * Create a referral code for the current user (called once)
 */
export const createMyReferralCode = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    // Check if already has one
    const existing = await ctx.db
      .query('referralCodes')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .unique();

    if (existing) return existing.code;

    // Generate unique code (retry on collision)
    let code = generateCode();
    let attempts = 0;
    while (attempts < 5) {
      const collision = await ctx.db
        .query('referralCodes')
        .withIndex('by_code', (q) => q.eq('code', code))
        .unique();
      if (!collision) break;
      code = generateCode();
      attempts++;
    }

    await ctx.db.insert('referralCodes', {
      userId: identity.subject,
      code,
      createdAt: Date.now(),
    });

    return code;
  },
});

/**
 * Redeem a referral code (called by new user during onboarding)
 */
export const redeemReferralCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const normalizedCode = code.toUpperCase().trim();

    // Find the referral code
    const referralCode = await ctx.db
      .query('referralCodes')
      .withIndex('by_code', (q) => q.eq('code', normalizedCode))
      .unique();

    if (!referralCode) {
      return { success: false, error: 'Invalid referral code' };
    }

    // Can't refer yourself
    if (referralCode.userId === identity.subject) {
      return { success: false, error: 'Cannot use your own referral code' };
    }

    // Check if already used a referral
    const existingReferral = await ctx.db
      .query('referrals')
      .withIndex('by_referred', (q) => q.eq('referredUserId', identity.subject))
      .first();

    if (existingReferral) {
      return { success: false, error: 'You have already used a referral code' };
    }

    const now = Date.now();
    const rewardEnd = now + ONE_WEEK_MS;

    // Create the referral record
    const referralId = await ctx.db.insert('referrals', {
      referrerUserId: referralCode.userId,
      referredUserId: identity.subject,
      referralCode: normalizedCode,
      status: 'completed',
      rewardGrantedAt: now,
      rewardExpiresAt: rewardEnd,
      createdAt: now,
    });

    // Grant premium to both users
    await ctx.db.insert('referralRewards', {
      userId: referralCode.userId, // Referrer
      referralId,
      type: 'referrer',
      premiumStartAt: now,
      premiumEndAt: rewardEnd,
      createdAt: now,
    });

    await ctx.db.insert('referralRewards', {
      userId: identity.subject, // Referred user
      referralId,
      type: 'referred',
      premiumStartAt: now,
      premiumEndAt: rewardEnd,
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Get referral stats for the current user
 */
export const getMyReferralStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const referrals = await ctx.db
      .query('referrals')
      .withIndex('by_referrer', (q) => q.eq('referrerUserId', identity.subject))
      .collect();

    const rewards = await ctx.db
      .query('referralRewards')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect();

    const now = Date.now();
    const activeRewards = rewards.filter((r) => r.premiumEndAt > now);
    const totalPremiumDays = activeRewards.reduce(
      (sum, r) => sum + Math.ceil((r.premiumEndAt - now) / (24 * 60 * 60 * 1000)),
      0
    );

    return {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter((r) => r.status === 'completed').length,
      activePremiumDays: totalPremiumDays,
      hasActiveReward: activeRewards.length > 0,
      rewardExpiresAt: activeRewards.length > 0
        ? Math.max(...activeRewards.map((r) => r.premiumEndAt))
        : null,
    };
  },
});

/**
 * Check if user has active referral premium (used by premium check)
 */
export const hasReferralPremium = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const now = Date.now();
    const rewards = await ctx.db
      .query('referralRewards')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    return rewards.some((r) => r.premiumEndAt > now);
  },
});
