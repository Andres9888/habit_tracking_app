/* eslint-disable max-lines */
/**
 * Habit Removal and Restoration
 * Delete habits with undo support
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import type { RemovedHabitPayload } from './removePayload';
import { buildRemovedHabitPayload } from './removePayload';
import { findMaxOrderForUser } from './utils';

const UNDO_RETENTION_MS = 15 * 60 * 1000;

export const remove = mutation({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // SEC-004: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete habits');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-004: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to delete this habit');
    }

    // Get all related data before deleting
    const trackingEntries = await ctx.db
      .query('tracking')
      .withIndex('by_habit_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();
    const templateUsageEntries = await ctx.db
      .query('templateUsage')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();
    const dayNotes = await ctx.db
      .query('habitDayNotes')
      .withIndex('by_habitId_and_date', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Delete the habit permanently
    await ctx.db.delete(args.habitId);

    // Delete all related data for this habit
    for (const entry of trackingEntries) {
      await ctx.db.delete(entry._id);
    }
    for (const usageEntry of templateUsageEntries) {
      await ctx.db.delete(usageEntry._id);
    }
    for (const dayNote of dayNotes) {
      await ctx.db.delete(dayNote._id);
    }

    const deletedHabitPayload: RemovedHabitPayload = buildRemovedHabitPayload(
      habit,
      trackingEntries,
      dayNotes,
      templateUsageEntries
    );

    const deletedHabitId = await ctx.db.insert('deletedHabits', {
      createdAt: Date.now(),
      expiresAt: Date.now() + UNDO_RETENTION_MS,
      payload: JSON.stringify(deletedHabitPayload),
      userId: identity.subject,
    });

    return { deletedHabitId };
  },
  returns: v.object({ deletedHabitId: v.id('deletedHabits') }),
});

export const restore = mutation({
  args: {
    deletedHabitId: v.id('deletedHabits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to restore habits');
    }

    const deletedHabit = await ctx.db.get(args.deletedHabitId);
    if (!deletedHabit || deletedHabit.userId !== identity.subject) {
      throw new Error('Deleted habit not found');
    }
    if (deletedHabit.expiresAt < Date.now()) {
      await ctx.db.delete(args.deletedHabitId);
      throw new Error('Undo window expired');
    }

    let payload: RemovedHabitPayload;
    try {
      payload = JSON.parse(deletedHabit.payload) as RemovedHabitPayload;
    } catch {
      await ctx.db.delete(args.deletedHabitId);
      throw new Error('Deleted habit data is corrupted');
    }

    // Single indexed read — no need to load every habit document just to take
    // the maximum order.
    const maxOrder = await findMaxOrderForUser(ctx, identity.subject);

    const habitId = await ctx.db.insert('habits', {
      ...payload.habit,
      order: maxOrder + 1,
      strengthUpdatedAt: Date.now(),
      userId: identity.subject,
    });

    for (const trackingEntry of payload.tracking) {
      await ctx.db.insert('tracking', {
        completed: trackingEntry.completed,
        date: trackingEntry.date,
        habitId,
        userId: identity.subject,
      });
    }

    for (const dayNote of payload.dayNotes ?? []) {
      await ctx.db.insert('habitDayNotes', {
        date: dayNote.date,
        habitId,
        note: dayNote.note,
        updatedAt: Date.now(),
        userId: identity.subject,
      });
    }

    // habits.get joins templateUsage for the template "why" and start-small
    // copy. `?? []` keeps payloads written before this field existed working.
    for (const usage of payload.templateUsage ?? []) {
      await ctx.db.insert('templateUsage', {
        habitId,
        importedAt: usage.importedAt,
        templateId: usage.templateId,
        userId: identity.subject,
      });
    }

    await ctx.db.delete(args.deletedHabitId);

    return habitId;
  },
  returns: v.id('habits'),
});
