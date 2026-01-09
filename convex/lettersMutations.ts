/**
 * Letters Mutation API
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH } from './letters/index';

/**
 * Create a new letter to self
 */
export const create = mutation({
  args: {
    content: v.string(),
    habitId: v.id('habits'),
    title: v.optional(v.string()),
    unlockDays: v.number(),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');

    if (!args.content || args.content.trim() === '')
      throw new Error('Letter content is required');
    if (args.content.length > MAX_CONTENT_LENGTH)
      throw new Error(
        `Letter content cannot exceed ${MAX_CONTENT_LENGTH} characters`
      );
    if (args.title && args.title.length > MAX_TITLE_LENGTH)
      throw new Error(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
    if (args.unlockDays <= 0) throw new Error('Unlock days must be positive');
    if (args.unlockDays > 365)
      throw new Error('Unlock duration cannot exceed 1 year');

    const now = Date.now();
    const unlockAt = now + args.unlockDays * 24 * 60 * 60 * 1000;

    return await ctx.db.insert('letters', {
      content: args.content.trim(),
      createdAt: now,
      habitId: args.habitId,
      isRead: false,
      title: args.title?.trim(),
      unlockAt,
    });
  },
  returns: v.id('letters'),
});

/**
 * Mark a letter as read (only after unlocked)
 */
export const markAsRead = mutation({
  args: { letterId: v.id('letters') },
  handler: async (ctx, args) => {
    const letter = await ctx.db.get(args.letterId);
    if (!letter) throw new Error('Letter not found');

    const now = Date.now();
    if (letter.unlockAt > now) throw new Error('Letter is still locked');
    if (letter.isRead) return args.letterId;

    await ctx.db.patch(args.letterId, { isRead: true, updatedAt: now });
    return args.letterId;
  },
  returns: v.id('letters'),
});

/**
 * Update a letter's content or title (only while locked)
 */
export const update = mutation({
  args: {
    content: v.optional(v.string()),
    letterId: v.id('letters'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const letter = await ctx.db.get(args.letterId);
    if (!letter) throw new Error('Letter not found');

    const now = Date.now();
    if (letter.unlockAt <= now)
      throw new Error('Cannot edit an unlocked letter');

    if (args.content !== undefined) {
      if (!args.content || args.content.trim() === '')
        throw new Error('Letter content is required');
      if (args.content.length > MAX_CONTENT_LENGTH)
        throw new Error(
          `Letter content cannot exceed ${MAX_CONTENT_LENGTH} characters`
        );
    }

    if (
      args.title !== undefined &&
      args.title &&
      args.title.length > MAX_TITLE_LENGTH
    )
      throw new Error(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);

    const updates: Record<string, unknown> = { updatedAt: now };
    if (args.content !== undefined) updates.content = args.content.trim();
    if (args.title !== undefined) updates.title = args.title?.trim();

    await ctx.db.patch(args.letterId, updates);
    return args.letterId;
  },
  returns: v.id('letters'),
});

/**
 * Delete a letter (only while locked)
 */
export const remove = mutation({
  args: { letterId: v.id('letters') },
  handler: async (ctx, args) => {
    const letter = await ctx.db.get(args.letterId);
    if (!letter) throw new Error('Letter not found');

    const now = Date.now();
    if (letter.unlockAt <= now)
      throw new Error('Cannot delete an unlocked letter');

    await ctx.db.delete(args.letterId);
    return null;
  },
  returns: v.null(),
});
