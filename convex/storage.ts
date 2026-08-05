/**
 * File Storage API
 * Handles file uploads for Convex storage
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { enforceRateLimit } from './lib/rateLimit';
import { getStorageMetadata } from './storageMetadata';
import {
  getInvalidImageUploadReason,
  MAX_OWNED_UPLOADS_PER_USER,
} from './storageValidation';
import {
  claimStorageForUser,
  getStorageOwner,
  releaseStorageForUser,
} from './storageOwnership';

const validationFailureValidator = v.object({
  error: v.string(),
  ok: v.literal(false),
});

const validationSuccessValidator = v.object({
  contentType: v.string(),
  ok: v.literal(true),
  size: v.number(),
  storageId: v.id('_storage'),
});

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

    await enforceRateLimit(ctx, identity.subject, 'storage.generateUploadUrl');

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

    await enforceRateLimit(
      ctx,
      identity.subject,
      'storage.validateImageUpload'
    );

    const owner = await getStorageOwner(ctx, args.storageId);
    if (owner && owner.userId !== identity.subject) {
      throw new Error('Not authorized to use this uploaded file');
    }

    const metadata = await getStorageMetadata(ctx, args.storageId);
    const validationError = getInvalidImageUploadReason(metadata);

    if (validationError) {
      if (metadata) {
        try {
          await ctx.storage.delete(args.storageId);
        } catch {
          // A scheduled orphan sweep retries deletion after transient failures.
        }
      }
      if (owner?.userId === identity.subject) {
        await releaseStorageForUser(ctx, args.storageId, identity.subject);
      }
      // Returning instead of throwing lets the deletion/ownership cleanup commit.
      return { error: validationError, ok: false as const };
    }

    if (!metadata) {
      return { error: 'Uploaded file was not found', ok: false as const };
    }

    if (!owner) {
      const ownedUploads = await ctx.db
        .query('storageOwnership')
        .withIndex('by_user_id', (q) => q.eq('userId', identity.subject))
        .take(MAX_OWNED_UPLOADS_PER_USER);
      if (ownedUploads.length >= MAX_OWNED_UPLOADS_PER_USER) {
        try {
          await ctx.storage.delete(args.storageId);
        } catch {
          // The orphan sweep handles any file left behind.
        }
        return {
          error:
            'Upload limit reached. Remove an existing image and try again.',
          ok: false as const,
        };
      }
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
      ok: true as const,
      size: metadata.size,
      storageId: args.storageId,
    };
  },
  returns: v.union(validationSuccessValidator, validationFailureValidator),
});
