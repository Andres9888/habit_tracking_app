/**
 * Vision Board Images update mutations
 *
 * Update and reorder operations for vision board images.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { MAX_CAPTION_LENGTH } from './visionBoardImages/index';

/**
 * Update an image's caption
 */
export const updateCaption = mutation({
  args: {
    caption: v.optional(v.string()),
    imageId: v.id('visionBoardImages'),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    if (args.caption && args.caption.length > MAX_CAPTION_LENGTH) {
      throw new Error(`Caption cannot exceed ${MAX_CAPTION_LENGTH} characters`);
    }

    await ctx.db.patch(args.imageId, {
      caption: args.caption?.trim(),
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
