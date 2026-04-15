/** Formed Habits — Mark habits as successfully formed, list, and unform */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { fullHabitValidator } from './types';
import { findMaxOrder } from './utils';

function requireAuth(identity: unknown, action: string) {
  if (!identity)
    throw new Error(`Unauthenticated: Must be logged in to ${action}`);
}

export const formHabit = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'form habits');
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized');
    await ctx.db.patch(args.habitId, {
      formed: true,
      formedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});

export const unformHabit = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'unform habits');
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized');
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
    requireAuth(identity, 'view formed habits');
    return await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) => q.eq(q.field('formed'), true))
      .collect();
  },
  returns: v.array(fullHabitValidator),
});

export const listFormedCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'view formed habits');
    const formed = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) => q.eq(q.field('formed'), true))
      .collect();
    return formed.length;
  },
  returns: v.number(),
});
