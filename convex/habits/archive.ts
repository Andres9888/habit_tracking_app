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
    if (habit.userId !== identity!.subject) throw new Error('Not authorized to archive this habit');
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
    if (habit.userId !== identity!.subject) throw new Error('Not authorized to unarchive this habit');
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
    requireAuth(identity, 'view archived habits');
    return await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) => q.eq(q.field('archived'), true))
      .collect();
  },
  returns: v.array(fullHabitValidator),
});

export const listArchivedCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    requireAuth(identity, 'view archived habits');
    const archivedHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) => q.eq(q.field('archived'), true))
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
      .withIndex('by_userId', (q) => q.eq('userId', identity!.subject))
      .filter((q) => q.eq(q.field('archived'), true))
      .collect();
    let deletedCount = 0;
    for (const habit of archivedHabits) {
      const records = await ctx.db
        .query('tracking')
        .withIndex('by_habit_and_date', (q) => q.eq('habitId', habit._id))
        .collect();
      const notes = await ctx.db
        .query('notes')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const reflections = await ctx.db
        .query('reflections')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const letters = await ctx.db
        .query('letters')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const affirmations = await ctx.db
        .query('affirmations')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const voiceNotes = await ctx.db
        .query('voiceNotes')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const visionBoardItems = await ctx.db
        .query('visionBoardItems')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const visionBoardImages = await ctx.db
        .query('visionBoardImages')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const templateUsageEntries = await ctx.db
        .query('templateUsage')
        .withIndex('by_habit', (q) => q.eq('habitId', habit._id))
        .collect();
      const storageIds = [...new Set(visionBoardImages.map((image) => image.storageId))];

      for (const record of records) await ctx.db.delete(record._id);
      for (const note of notes) await ctx.db.delete(note._id);
      for (const reflection of reflections) await ctx.db.delete(reflection._id);
      for (const letter of letters) await ctx.db.delete(letter._id);
      for (const affirmation of affirmations) await ctx.db.delete(affirmation._id);
      for (const voiceNote of voiceNotes) await ctx.db.delete(voiceNote._id);
      for (const item of visionBoardItems) await ctx.db.delete(item._id);
      for (const image of visionBoardImages) await ctx.db.delete(image._id);
      for (const usageEntry of templateUsageEntries) await ctx.db.delete(usageEntry._id);

      for (const storageId of storageIds) {
        const remainingReferences = await ctx.db
          .query('visionBoardImages')
          .withIndex('by_storageId', (q) => q.eq('storageId', storageId))
          .collect();
        if (remainingReferences.length > 0) {
          continue;
        }
        try {
          await ctx.storage.delete(storageId);
        } catch (error) {
          console.error(
            'Failed to delete storage file during archived habit removal:',
            error
          );
        }
      }

      await ctx.db.delete(habit._id);
      deletedCount++;
    }
    return { deletedCount };
  },
  returns: v.object({ deletedCount: v.number() }),
});
