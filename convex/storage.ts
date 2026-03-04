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

    // SECURITY: Only return URLs for files owned by the authenticated user.
    // Storage IDs are persisted in visionBoardImages.
    const directOwnershipMatch = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_user_and_storage', (q) =>
        q.eq('userId', identity.subject).eq('storageId', args.storageId)
      )
      .first();

    if (directOwnershipMatch) {
      return await ctx.storage.getUrl(args.storageId);
    }

    // Backward compatibility for older rows where userId may be missing.
    const imageByStorageId = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_storageId', (q) => q.eq('storageId', args.storageId))
      .first();

    if (!imageByStorageId) {
      return null;
    }

    if (
      imageByStorageId.userId &&
      imageByStorageId.userId !== identity.subject
    ) {
      return null;
    }

    const habit = await ctx.db.get(imageByStorageId.habitId);
    if (!habit || habit.userId !== identity.subject) {
      return null;
    }

    return await ctx.storage.getUrl(args.storageId);
  },
  returns: v.union(v.string(), v.null()),
});

/**
 * Delete a file from storage
 * 
 * ⚠️ DEPRECATED: This mutation lacks ownership verification.
 * Use domain-specific delete mutations instead (e.g., visionBoardImages.remove)
 * which verify ownership before deletion.
 * 
 * This is kept for backwards compatibility but should not be used.
 */
export const deleteFile = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    // SEC-002: Authentication check - prevent anonymous file deletion
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to delete files');
    }

    // SEC-VULNERABILITY: This mutation does not verify file ownership!
    // Callers must verify ownership before calling this.
    // Consider using domain-specific delete mutations that verify ownership.
    
    throw new Error(
      'Direct file deletion is disabled. Use domain-specific delete mutations ' +
      '(e.g., visionBoardImages.remove) that verify ownership.'
    );
    
    // await ctx.storage.delete(args.storageId);
    // return null;
  },
  returns: v.null(),
});
