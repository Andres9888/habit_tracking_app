/**
 * Vision Board Images update mutations
 *
 * Update and reorder operations for vision board images.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { MAX_CAPTION_LENGTH } from './visionBoardImages/index';
import {
  validateShortText,
  requireValid,
} from './lib/inputValidation';

/**
 * Update an image's caption
 */
export const updateCaption = mutation({
  args: {
    caption: v.optional(v.string()),
    imageId: v.id('visionBoardImages'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update vision board images');
    }

    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // SEC-001: Ownership verification via parent habit
    const habit = await ctx.db.get(image.habitId);
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to update this image');
    }

    // SEC-003: Input validation - caption
    const captionResult = validateShortText(args.caption, MAX_CAPTION_LENGTH, 'Caption');
    const caption = requireValid(captionResult, args.caption);

    await ctx.db.patch(args.imageId, {
      caption: caption?.trim(),
      updatedAt: Date.now(),
    });

    return args.imageId;
  },
  returns: v.id('visionBoardImages'),
});

/**
 * Reorder images in the grid
 */
export const reorder = mutation({
  args: {
    habitId: v.id('habits'),
    orderedImageIds: v.array(v.id('visionBoardImages')),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to reorder vision board images');
    }

    // SEC-001: Ownership verification
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }
    if (!habit || habit.userId !== identity.subject) {
      throw new Error('Not authorized to reorder images for this habit');
    }

    const existingImages = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    const existingIds = new Set(existingImages.map((img) => img._id));

    for (const id of args.orderedImageIds) {
      if (!existingIds.has(id)) {
        throw new Error(`Image ${id} not found in this habit's vision board`);
      }
    }

    const now = Date.now();
    for (let i = 0; i < args.orderedImageIds.length; i++) {
      await ctx.db.patch(args.orderedImageIds[i], {
        order: i,
        updatedAt: now,
      });
    }

    return null;
  },
  returns: v.null(),
});
