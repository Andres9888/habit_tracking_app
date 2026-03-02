import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';
import {
  requireAuthenticatedUser,
  requireOwnedDocumentById,
  requireOwnedHabit,
} from './security';

export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedHabit(ctx, args.habitId, userId);

    return await ctx.db
      .query('visionBoardItems')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .order('desc')
      .collect();
  },
  returns: v.array(
    v.object({
      _creationTime: v.number(),
      _id: v.id('visionBoardItems'),
      body: v.optional(v.string()),
      createdAt: v.number(),
      habitId: v.id('habits'),
      title: v.string(),
      updatedAt: v.number(),
      userId: v.optional(v.string()),
    })
  ),
});

export const create = mutation({
  args: {
    body: v.optional(v.string()),
    habitId: v.id('habits'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    await requireOwnedHabit(ctx, args.habitId, userId);

    const title = args.title.trim();
    const body = args.body?.trim();

    if (!title) {
      throw new Error('Title is required');
    }

    if (title.length > 60) {
      throw new Error('Title cannot exceed 60 characters');
    }

    if (body && body.length > 600) {
      throw new Error('Body cannot exceed 600 characters');
    }

    const now = Date.now();

    return await ctx.db.insert('visionBoardItems', {
      body: body ? body : undefined,
      createdAt: now,
      habitId: args.habitId,
      userId,
      title,
      updatedAt: now,
    });
  },
  returns: v.id('visionBoardItems'),
});

export const update = mutation({
  args: {
    body: v.optional(v.string()),
    id: v.id('visionBoardItems'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const existing = await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'visionBoardItems'>),
      args.id,
      userId,
      'vision board item'
    );

    const title = args.title?.trim();
    const body = args.body?.trim();

    if (title !== undefined && !title) {
      throw new Error('Title is required');
    }

    if (title !== undefined && title.length > 60) {
      throw new Error('Title cannot exceed 60 characters');
    }

    if (body && body.length > 600) {
      throw new Error('Body cannot exceed 600 characters');
    }

    await ctx.db.patch(args.id, {
      body: body ? body : undefined,
      title: title === undefined ? undefined : title,
      updatedAt: Date.now(),
    });

    return null;
  },
  returns: v.null(),
});

export const remove = mutation({
  args: {
    id: v.id('visionBoardItems'),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUser(ctx);
    const existing = await requireOwnedDocumentById(
      async (id) => await ctx.db.get(id as Id<'visionBoardItems'>),
      args.id,
      userId,
      'vision board item'
    );

    await ctx.db.delete(args.id);
    return null;
  },
  returns: v.null(),
});





