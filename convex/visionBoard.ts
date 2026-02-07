import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * List all vision board items for a specific habit
 * SEC-001: Requires authentication and verifies habit ownership
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) return [];

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

/**
 * Create a new vision board item
 * SEC-001: Requires authentication and verifies habit ownership
 */
export const create = mutation({
  args: {
    body: v.optional(v.string()),
    habitId: v.id('habits'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create vision board items');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error('Habit not found');
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to add vision board items to this habit');
    }

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
      title,
      updatedAt: now,
      userId: identity.subject,
    });
  },
  returns: v.id('visionBoardItems'),
});

/**
 * Update an existing vision board item
 * SEC-001: Requires authentication and verifies ownership
 */
export const update = mutation({
  args: {
    body: v.optional(v.string()),
    id: v.id('visionBoardItems'),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update vision board items');
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error('Vision board item not found');
    }

    if (existing.userId && existing.userId !== identity.subject) {
      throw new Error('Not authorized to update this vision board item');
    }
    const habit = await ctx.db.get(existing.habitId);
    if (habit && habit.userId !== identity.subject) {
      throw new Error('Not authorized to update this vision board item');
    }

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

/**
 * Remove a vision board item
 * SEC-001: Requires authentication and verifies ownership
 */
export const remove = mutation({
  args: {
    id: v.id('visionBoardItems'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete vision board items');
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error('Vision board item not found');
    }

    if (existing.userId && existing.userId !== identity.subject) {
      throw new Error('Not authorized to delete this vision board item');
    }
    const habit = await ctx.db.get(existing.habitId);
    if (habit && habit.userId !== identity.subject) {
      throw new Error('Not authorized to delete this vision board item');
    }

    await ctx.db.delete(args.id);
    return null;
  },
  returns: v.null(),
});
