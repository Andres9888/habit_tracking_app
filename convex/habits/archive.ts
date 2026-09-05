/* eslint-disable max-lines */
/** Habit Archive Mutations — Archive, unarchive, and bulk delete */
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { fullHabitValidator } from './types';
import { findMaxOrder } from './utils';

function requireAuth(identity: unknown, action: string) {
  if (!identity)
    throw new Error(`Unauthenticated: Must be logged in to ${action}`);
}

export const archive = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'archive habits');
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized to archive this habit');
    await ctx.db.patch(args.habitId, {
      archived: true,
      archivedAt: Date.now(),
    });
    return null;
  },
  returns: v.null(),
});

export const unarchive = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'unarchive habits');
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity!.subject)
      throw new Error('Not authorized to unarchive this habit');
    // Read only to place the restored habit at the end of the list.
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) => q.neq(q.field('archived'), true))
      .collect();
    await ctx.db.patch(args.habitId, {
      archived: false,
      archivedAt: undefined,
      order: findMaxOrder(activeHabits) + 1,
    });
    return null;
  },
  returns: v.null(),
});

export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query('habits')
      .withIndex('by_userId_and_archived', (q) =>
        q.eq('userId', identity.subject).eq('archived', true)
      )
      .collect();
  },
  returns: v.array(fullHabitValidator),
});

export const listArchivedCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;
    const archivedHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId_and_archived', (q) =>
        q.eq('userId', identity.subject).eq('archived', true)
      )
      .collect();
    return archivedHabits.length;
  },
  returns: v.number(),
});

export const deleteAllArchived = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'delete archived habits');
    const archivedHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId_and_archived', (q) =>
        q.eq('userId', identity!.subject).eq('archived', true)
      )
      .collect();
    let deletedCount = 0;
    for (const habit of archivedHabits) {
      const records = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();
      const templateUsageEntries = await ctx.db
        .query('templateUsage')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const dayNotes = await ctx.db
        .query('habitDayNotes')
        .withIndex('by_habitId_and_date', (q) => q.eq('habitId', habit._id))
        .collect();

      for (const record of records) await ctx.db.delete(record._id);
      for (const usageEntry of templateUsageEntries)
        await ctx.db.delete(usageEntry._id);
      for (const dayNote of dayNotes) await ctx.db.delete(dayNote._id);

      await ctx.db.delete(habit._id);
      deletedCount++;
    }
    return { deletedCount };
  },
  returns: v.object({ deletedCount: v.number() }),
});
