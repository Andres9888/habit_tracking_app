/**
 * File Storage API
 * Handles file uploads for Convex storage
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';

/**
 * Generate a signed upload URL for file storage
 * The URL expires in 1 hour
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to upload files');
    }

    return await ctx.storage.generateUploadUrl();
  },
  returns: v.string(),
});
