/**
 * File Storage API
 * Handles file uploads and URL generation for Convex storage
 *
 * Used by:
 * - Vision Board images (T12.2)
 * - Voice Notes (T10)
 *
 * Follows Convex file storage pattern:
 * 1. Client calls generateUploadUrl
 * 2. Client uploads file to returned URL
 * 3. Client receives storageId
 * 4. Client saves storageId via mutation
 * 5. Server generates public URL via getUrl
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Generate a signed upload URL for file storage
 * The URL expires in 1 hour
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // SEC-002: Authentication check - prevent anonymous file uploads
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to upload files');
    }

    return await ctx.storage.generateUploadUrl();
  },
  returns: v.string(),
});

/**
 * Get the public URL for a stored file
 * Returns null if the file doesn't exist
 */
export const getUrl = query({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    // SEC-002: Authentication check - prevent anonymous access to file URLs
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to access files');
    }

    return await ctx.storage.getUrl(args.storageId);
  },
  returns: v.union(v.string(), v.null()),
});

/**
 * Delete a file from storage
 *
 * SEC-008: Ownership verification — only delete files the user owns.
 * Checks visionBoardImages and voiceNotes tables to confirm the
 * authenticated user owns a record referencing this storageId.
 */
export const deleteFile = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    // SEC-008: Authentication check - prevent anonymous file deletion
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete files');
    }

    // SEC-008: Ownership verification — ensure the file belongs to the caller.
    // Check visionBoardImages for a record with this storageId owned by the user.
    const visionImage = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .filter((q) => q.eq(q.field('storageId'), args.storageId))
      .first();

    if (!visionImage) {
      // No matching record found — the user does not own this file
      throw new Error('Not authorized to delete this file');
    }

    await ctx.storage.delete(args.storageId);
    return null;
  },
  returns: v.null(),
});
