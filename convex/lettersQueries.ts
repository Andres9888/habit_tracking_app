/**
 * Letters Query API
 * SEC-004: All queries require authentication and filter by userId
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import { letterObjectValidator, letterStatsValidator } from './letters/index';

/**
 * Get all letters for a specific habit
 * SEC-004: Requires authentication; filters by userId at DB level
 */
export const listByHabit = query({
  args: { habitId: v.id('habits'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const q = ctx.db
      .query('letters')
      .withIndex('by_habit', (query) => query.eq('habitId', args.habitId))
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .order('desc');
    return args.limit ? await q.take(args.limit) : await q.collect();
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get all unlocked letters for a habit that haven't been read yet
 * SEC-004: Requires authentication; filters by userId
 */
export const getUnreadUnlocked = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const now = Date.now();
    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .collect();
    return letters.filter((letter) => letter.unlockAt <= now && !letter.isRead);
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get all letters that are about to unlock (within next 24 hours)
 * SEC-004: Requires authentication; uses identity.subject for user filtering
 * (removed client-supplied userId arg — always uses authenticated user)
 */
export const getUpcomingUnlocks = query({
  args: { habitId: v.optional(v.id('habits')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const now = Date.now();
    const in24Hours = now + 24 * 60 * 60 * 1000;
    let letters;

    if (args.habitId) {
      letters = await ctx.db
        .query('letters')
        .withIndex('by_habit', (q) => q.eq('habitId', args.habitId!))
        .filter((q) => q.eq(q.field('userId'), identity.subject))
        .collect();
    } else {
      letters = await ctx.db
        .query('letters')
        .withIndex('by_user', (q) => q.eq('userId', identity.subject))
        .collect();
    }

    return letters.filter(
      (letter) =>
        letter.unlockAt > now && letter.unlockAt <= in24Hours && !letter.isRead
    );
  },
  returns: v.array(letterObjectValidator),
});

/**
 * Get a single letter by ID
 * SEC-004: Requires authentication; verifies ownership before returning
 */
export const get = query({
  args: { letterId: v.id('letters') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const letter = await ctx.db.get(args.letterId);
    if (!letter) return null;

    if (letter.userId !== identity.subject) return null;

    return letter;
  },
  returns: v.union(v.null(), letterObjectValidator),
});

/**
 * Count letters for a habit
 * SEC-004: Requires authentication; filters by userId at DB level
 */
export const countByHabit = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .collect();
    return letters.length;
  },
  returns: v.number(),
});

/**
 * Get letter statistics for a habit
 * SEC-004: Requires authentication; verifies habit ownership before computing
 */
export const getStats = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const habit = await ctx.db.get(args.habitId);
    if (!habit) return null;
    if (habit.userId !== identity.subject) return null;

    const now = Date.now();
    const letters = await ctx.db
      .query('letters')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .collect();

    return {
      locked: letters.filter((l) => l.unlockAt > now).length,
      read: letters.filter((l) => l.isRead).length,
      total: letters.length,
      unlocked: letters.filter((l) => l.unlockAt <= now).length,
      unread: letters.filter((l) => l.unlockAt <= now && !l.isRead).length,
    };
  },
  returns: v.union(v.null(), letterStatsValidator),
});

// Additional queries in ./lettersQueriesExtra.ts
export { getMostRecentUnlocked, listByUser } from './lettersQueriesExtra';
