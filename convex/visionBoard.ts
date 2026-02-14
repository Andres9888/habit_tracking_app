import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import {
  validateLongText,
  validateShortText,
  requireValid,
  containsDangerousPatterns,
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
} from './lib/inputValidation';

/** Maximum length for vision board titles */
const MAX_VISION_BOARD_TITLE_LENGTH = 60;

/** Maximum length for vision board body text */
const MAX_VISION_BOARD_BODY_LENGTH = 600;

export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
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
    // SEC-003: Input validation - title (short text with XSS protection)
    const titleResult = validateShortText(
      args.title,
      MAX_VISION_BOARD_TITLE_LENGTH,
      'Title'
    );
    const title = requireValid(titleResult, args.title);
    if (!title || !title.trim()) {
      throw new Error('Title is required');
    }

    // SEC-003: Input validation - body (long text with XSS protection)
    const bodyResult = validateLongText(
      args.body,
      MAX_VISION_BOARD_BODY_LENGTH,
      'Body'
    );
    const body = requireValid(bodyResult, args.body);

    const now = Date.now();

    return await ctx.db.insert('visionBoardItems', {
      body: body?.trim() || undefined,
      createdAt: now,
      habitId: args.habitId,
      title: title.trim(),
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
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error('Vision board item not found');
    }

    // SEC-003: Input validation - title (short text with XSS protection)
    let title: string | undefined;
    if (args.title !== undefined) {
      const titleResult = validateShortText(
        args.title,
        MAX_VISION_BOARD_TITLE_LENGTH,
        'Title'
      );
      title = requireValid(titleResult, args.title);
      if (title !== undefined && !title.trim()) {
        throw new Error('Title cannot be empty');
      }
    }

    // SEC-003: Input validation - body (long text with XSS protection)
    let body: string | undefined;
    if (args.body !== undefined) {
      const bodyResult = validateLongText(
        args.body,
        MAX_VISION_BOARD_BODY_LENGTH,
        'Body'
      );
      body = requireValid(bodyResult, args.body);
    }

    await ctx.db.patch(args.id, {
      body: body?.trim() || undefined,
      title: title?.trim() || undefined,
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
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error('Vision board item not found');
    }

    await ctx.db.delete(args.id);
    return null;
  },
  returns: v.null(),
});
