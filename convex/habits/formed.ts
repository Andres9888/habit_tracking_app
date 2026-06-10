/** Formed Habit Mutations — mark a mastered habit as formed (retired with honors) */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { hasPremiumAccess } from '../subscriptions/premiumCheck';
import { fullHabitValidator } from './types';
import { findMaxOrder } from './utils';

const FREE_HABIT_LIMIT = 3;

function requireAuth(identity: unknown, action: string) {
  if (!identity)
    throw new Error(`Unauthenticated: Must be logged in to ${action}`);
}

export const markFormed = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'mark habits as formed');
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized to update this habit');
    await ctx.db.patch(args.habitId, {
      formed: true,
      formedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});

export const unmarkFormed = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'restore formed habits');
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized to update this habit');
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) =>
        q.and(
          q.neq(q.field('archived'), true),
          q.neq(q.field('formed'), true)
        )
      )
      .collect();
    // Mirror of SEC-005 unarchive check: restoring counts against the free tier
    const nonPausedActive = activeHabits.filter((h) => !h.paused);
    const isPremiumUser = await hasPremiumAccess(ctx, identity!.subject);
    if (!isPremiumUser && nonPausedActive.length >= FREE_HABIT_LIMIT) {
      throw new Error(
        `Free tier is limited to ${FREE_HABIT_LIMIT} active habits. Upgrade to premium or delete an active habit to resume this one.`
      );
    }
    await ctx.db.patch(args.habitId, {
      formed: false,
      formedAt: undefined,
      order: findMaxOrder(activeHabits) + 1,
    });
    return null;
  },
  returns: v.null(),
});

export const listFormed = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const formedHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .filter((q) =>
        q.and(
          q.eq(q.field('formed'), true),
          q.neq(q.field('archived'), true)
        )
      )
      .collect();
    // Most recently formed first
    return formedHabits.sort((a, b) => (b.formedAt ?? 0) - (a.formedAt ?? 0));
  },
  returns: v.array(fullHabitValidator),
});

export const listFormedCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;
    const formedHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity.subject))
      .filter((q) =>
        q.and(
          q.eq(q.field('formed'), true),
          q.neq(q.field('archived'), true)
        )
      )
      .collect();
    return formedHabits.length;
  },
  returns: v.number(),
});
