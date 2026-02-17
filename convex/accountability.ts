/**
 * Accountability Partners - Convex Functions
 *
 * Enables users to pair with a friend on a habit for mutual motivation.
 * Uses deep-link invite tokens for frictionless pairing.
 *
 * Scientific Basis:
 * - Social accountability increases adherence by 65% (ASTC, 2015)
 * - External commitment drives consistency (Cialdini, 2006)
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ─── Queries ───────────────────────────────────────────────

/** Get accountability partner for a habit (if any) */
export const getPartnerForHabit = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, { habitId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;

    // Check as inviter
    const asInviter = await ctx.db
      .query('accountabilityPartners')
      .withIndex('by_habit', (q) => q.eq('habitId', habitId))
      .filter((q) =>
        q.and(
          q.eq(q.field('inviterUserId'), userId),
          q.neq(q.field('status'), 'removed'),
          q.neq(q.field('status'), 'declined')
        )
      )
      .first();

    if (asInviter) {
      const partnerUser = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', asInviter.partnerUserId))
        .first();
      return { ...asInviter, role: 'inviter' as const, partnerName: partnerUser?.name ?? partnerUser?.email ?? 'Partner' };
    }

    // Check as partner
    const asPartner = await ctx.db
      .query('accountabilityPartners')
      .withIndex('by_partner', (q) => q.eq('partnerUserId', userId))
      .filter((q) =>
        q.and(
          q.eq(q.field('habitId'), habitId),
          q.neq(q.field('status'), 'removed'),
          q.neq(q.field('status'), 'declined')
        )
      )
      .first();

    if (asPartner) {
      const inviterUser = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', asPartner.inviterUserId))
        .first();
      return { ...asPartner, role: 'partner' as const, partnerName: inviterUser?.name ?? inviterUser?.email ?? 'Partner' };
    }

    return null;
  },
});

/** Get partner's streak info for display */
export const getPartnerStreakInfo = query({
  args: { partnershipId: v.id('accountabilityPartners') },
  handler: async (ctx, { partnershipId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const partnership = await ctx.db.get(partnershipId);
    if (!partnership || partnership.status !== 'active') return null;

    const userId = identity.subject;
    const isInviter = partnership.inviterUserId === userId;
    const partnerHabitId = isInviter ? partnership.partnerHabitId : partnership.habitId;

    if (!partnerHabitId) return null;

    const partnerHabit = await ctx.db.get(partnerHabitId);
    if (!partnerHabit) return null;

    // Get today's date string
    const today = new Date().toISOString().split('T')[0];

    // Check if partner completed today
    const todayTracking = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) =>
        q.eq('habitId', partnerHabitId).eq('date', today)
      )
      .first();

    return {
      currentStreak: partnerHabit.currentStreak ?? 0,
      bestStreak: partnerHabit.bestStreak ?? 0,
      completedToday: !!todayTracking?.completed,
      habitName: partnerHabit.name,
      strength: partnerHabit.strength ?? 0,
      strengthLevel: partnerHabit.strengthLevel ?? 'starting',
    };
  },
});

/** Look up partnership by invite token */
export const getByInviteToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const partnership = await ctx.db
      .query('accountabilityPartners')
      .withIndex('by_invite_token', (q) => q.eq('inviteToken', token))
      .first();

    if (!partnership || partnership.status !== 'pending') return null;

    const habit = await ctx.db.get(partnership.habitId);
    const inviter = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', partnership.inviterUserId))
      .first();

    return {
      ...partnership,
      habitName: habit?.name ?? 'Unknown Habit',
      habitIcon: habit?.icon,
      inviterName: inviter?.name ?? inviter?.email ?? 'Someone',
    };
  },
});

// ─── Mutations ─────────────────────────────────────────────

/** Create an accountability invite (generates deep link token) */
export const createInvite = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, { habitId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;
    const now = Date.now();

    // Generate a unique invite token
    const token = `acc_${now}_${Math.random().toString(36).slice(2, 10)}`;

    // Check for existing pending invite
    const existing = await ctx.db
      .query('accountabilityPartners')
      .withIndex('by_habit', (q) => q.eq('habitId', habitId))
      .filter((q) =>
        q.and(
          q.eq(q.field('inviterUserId'), userId),
          q.eq(q.field('status'), 'pending')
        )
      )
      .first();

    if (existing) {
      return { token: existing.inviteToken, partnershipId: existing._id };
    }

    const id = await ctx.db.insert('accountabilityPartners', {
      habitId,
      inviterUserId: userId,
      partnerUserId: '', // filled on accept
      status: 'pending',
      inviteToken: token,
      createdAt: now,
      updatedAt: now,
    });

    return { token, partnershipId: id };
  },
});

/** Accept an accountability invite */
export const acceptInvite = mutation({
  args: {
    token: v.string(),
    partnerHabitId: v.optional(v.id('habits')),
  },
  handler: async (ctx, { token, partnerHabitId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    const partnership = await ctx.db
      .query('accountabilityPartners')
      .withIndex('by_invite_token', (q) => q.eq('inviteToken', token))
      .first();

    if (!partnership) throw new Error('Invite not found');
    if (partnership.status !== 'pending') throw new Error('Invite already used');
    if (partnership.inviterUserId === userId) throw new Error('Cannot partner with yourself');

    await ctx.db.patch(partnership._id, {
      partnerUserId: userId,
      partnerHabitId,
      status: 'active',
      updatedAt: Date.now(),
    });

    return { partnershipId: partnership._id };
  },
});

/** Send a nudge to your accountability partner */
export const sendNudge = mutation({
  args: { partnershipId: v.id('accountabilityPartners') },
  handler: async (ctx, { partnershipId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const partnership = await ctx.db.get(partnershipId);
    if (!partnership || partnership.status !== 'active') {
      throw new Error('Partnership not active');
    }

    // Rate limit: one nudge per hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    if (partnership.lastNudgeSentAt && partnership.lastNudgeSentAt > oneHourAgo) {
      throw new Error('Can only nudge once per hour');
    }

    await ctx.db.patch(partnershipId, {
      lastNudgeSentAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/** Record a celebration (both completed on same day) */
export const recordCelebration = mutation({
  args: { partnershipId: v.id('accountabilityPartners') },
  handler: async (ctx, { partnershipId }) => {
    const partnership = await ctx.db.get(partnershipId);
    if (!partnership || partnership.status !== 'active') return;

    await ctx.db.patch(partnershipId, {
      lastCelebrationAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

/** Remove an accountability partnership */
export const removePartnership = mutation({
  args: { partnershipId: v.id('accountabilityPartners') },
  handler: async (ctx, { partnershipId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const partnership = await ctx.db.get(partnershipId);
    if (!partnership) throw new Error('Partnership not found');

    const userId = identity.subject;
    if (partnership.inviterUserId !== userId && partnership.partnerUserId !== userId) {
      throw new Error('Not your partnership');
    }

    await ctx.db.patch(partnershipId, {
      status: 'removed',
      updatedAt: Date.now(),
    });
  },
});
