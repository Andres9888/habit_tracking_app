/**
 * Vision Board Images delete mutation
 *
 * Handles image deletion with storage cleanup and reordering.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';

/**
 * Delete an image from the vision board and storage
 */
export const remove = mutation({
  args: {
    imageId: v.id('visionBoardImages'),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // Delete the file from storage
    try {
      await ctx.storage.delete(image.storageId);
    } catch (error) {
      // File may already be deleted, continue with record deletion
      console.warn('Failed to delete storage file:', error);
    }

    await ctx.db.delete(args.imageId);

    // Reorder remaining images to fill the gap
    const remainingImages = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', image.habitId))
      .collect();

    // Sort by current order and reassign sequential orders
    const sorted = remainingImages.sort((a, b) => a.order - b.order);
    const now = Date.now();
    for (const [i, element] of sorted.entries()) {
      if (element.order !== i) {
        await ctx.db.patch(element._id, {
          order: i,
          updatedAt: now,
        });
      }
    }

    return null;
  },
  returns: v.null(),
});
