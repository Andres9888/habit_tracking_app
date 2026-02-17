/**
 * Progress Photos delete mutation
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';

/**
 * Delete a progress photo and its storage file
 */
export const deletePhoto = mutation({
  args: {
    photoId: v.id('progressPhotos'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete progress photos');
    }

    const photo = await ctx.db.get(args.photoId);
    if (!photo) {
      throw new Error('Progress photo not found');
    }

    // SEC-001: Ownership verification
    if (photo.userId !== identity.subject) {
      throw new Error('Not authorized to delete this photo');
    }

    // Delete the storage file
    await ctx.storage.delete(photo.storageId);

    // Delete the photo record
    await ctx.db.delete(args.photoId);
  },
});
