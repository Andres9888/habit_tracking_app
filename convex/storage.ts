/**
 * File Storage API
 * Handles file uploads for Convex storage
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { getStorageMetadata } from './storageMetadata';
import { getInvalidImageUploadReason } from './storageValidation';
import {
  claimStorageForUser,
  getStorageOwner,
  releaseStorageForUser,
} from './storageOwnership';

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

export const validateImageUpload = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to upload files');
    }

    const owner = await getStorageOwner(ctx, args.storageId);
    if (owner && owner.userId !== identity.subject) {
      throw new Error('Not authorized to use this uploaded file');
    }

    const metadata = await getStorageMetadata(ctx, args.storageId);
    const validationError = getInvalidImageUploadReason(metadata);

    if (validationError) {
      if (metadata) {
        await ctx.storage.delete(args.storageId);
      }
      if (owner?.userId === identity.subject) {
        await releaseStorageForUser(ctx, args.storageId, identity.subject);
      }
      throw new Error(validationError);
    }

    if (!metadata) {
      throw new Error('Uploaded file was not found');
    }

    await claimStorageForUser(ctx, args.storageId, identity.subject);

    const contentType = metadata.contentType;
    if (!contentType) {
      throw new Error(
        'Unsupported image format. Use JPEG, PNG, WebP, or HEIC.'
      );
    }

    return {
      contentType,
      size: metadata.size,
      storageId: args.storageId,
    };
  },
  returns: v.object({
    contentType: v.string(),
    size: v.number(),
    storageId: v.id('_storage'),
  }),
});
