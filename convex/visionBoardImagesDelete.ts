/**
 * Vision Board Images delete mutation
 *
 * Handles image deletion with storage cleanup and reordering.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';

/**
 * Delete an image from the vision board and storage
 * SEC-007: Added authentication and ownership validation to prevent unauthorized deletion
 */
export const remove = mutation({
  args: {
    imageId: v.id('visionBoardImages'),
  },
  handler: async (ctx, args) => {
    // SEC-007: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete images');
    }

    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // SEC-007: Ownership validation - verify caller owns this image
    if (image.userId !== identity.subject) {
      throw new Error('Not authorized to delete this image');
    }

    // Delete the file from storage
    try {
      await ctx.storage.delete(image.storageId);
    } catch (error) {
      // File may already be deleted, continue with record deletion
      console.error('Failed to delete storage file:', error);
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
