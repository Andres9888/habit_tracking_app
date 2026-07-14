/**
 * Profile image mutations — Convex storage-backed custom avatars.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { enforceRateLimit } from './lib/rateLimit';
import { getStorageMetadata } from './storageMetadata';
import { getInvalidImageUploadReason } from './storageValidation';
import {
  claimStorageForUser,
  getStorageOwner,
  releaseStorageForUser,
} from './storageOwnership';

async function getAuthenticatedUser(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
  db: import('./_generated/server').MutationCtx['db'];
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
    .unique();

  if (!user) {
    throw new Error('User not found');
  }

  return { identity, user };
}

async function deleteStoredProfileImage(
  ctx: import('./_generated/server').MutationCtx,
  storageId: import('./_generated/dataModel').Id<'_storage'> | undefined,
  userId: string
) {
  if (!storageId) {
    return;
  }

  try {
    await ctx.storage.delete(storageId);
  } catch {
    // Best-effort cleanup when the blob is already gone.
  }
  await releaseStorageForUser(ctx, storageId, userId);
}

export const updateProfileImage = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    const { identity, user } = await getAuthenticatedUser(ctx);
    await enforceRateLimit(ctx, identity.subject, 'user.updateProfileImage');

    const owner = await getStorageOwner(ctx, args.storageId);
    if (!owner) {
      // Permit a one-time migration of a legacy profile image, but do not
      // allow arbitrary storage IDs to be attached without validation.
      if (user.profileImageStorageId !== args.storageId) {
        throw new Error('Uploaded file must be validated before use');
      }
      await claimStorageForUser(ctx, args.storageId, identity.subject);
    } else if (owner.userId !== identity.subject) {
      throw new Error('Not authorized to use this uploaded file');
    }

    const metadata = await getStorageMetadata(ctx, args.storageId);
    const validationError = getInvalidImageUploadReason(metadata);
    if (validationError) {
      if (metadata) {
        await ctx.storage.delete(args.storageId);
      }
      await releaseStorageForUser(ctx, args.storageId, identity.subject);
      throw new Error(validationError);
    }

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error('Uploaded file was not found');
    }

    if (user.profileImageStorageId !== args.storageId) {
      await deleteStoredProfileImage(
        ctx,
        user.profileImageStorageId,
        identity.subject
      );
    }

    await ctx.db.patch(user._id, {
      imageUrl,
      profileImageStorageId: args.storageId,
    });

    return { imageUrl };
  },
  returns: v.object({ imageUrl: v.string() }),
});

export const clearProfileImage = mutation({
  args: {},
  handler: async (ctx) => {
    const { identity, user } = await getAuthenticatedUser(ctx);
    await enforceRateLimit(ctx, identity.subject, 'user.updateProfileImage');

    await deleteStoredProfileImage(
      ctx,
      user.profileImageStorageId,
      identity.subject
    );

    await ctx.db.patch(user._id, {
      imageUrl: undefined,
      profileImageStorageId: undefined,
    });

    return { cleared: true };
  },
  returns: v.object({ cleared: v.boolean() }),
});
