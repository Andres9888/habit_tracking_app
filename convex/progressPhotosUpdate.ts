/**
 * Progress Photos update mutation
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { MAX_CAPTION_LENGTH } from './progressPhotos/index';
import {
  validateShortText,
  requireValid,
} from './lib/inputValidation';

/**
 * Update a progress photo's caption
 */
export const updateCaption = mutation({
  args: {
    caption: v.optional(v.string()),
    photoId: v.id('progressPhotos'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to update progress photos');
    }

    const photo = await ctx.db.get(args.photoId);
    if (!photo) {
      throw new Error('Progress photo not found');
    }

    // SEC-001: Ownership verification
    if (photo.userId !== identity.subject) {
      throw new Error('Not authorized to update this photo');
    }

    // SEC-003: Input validation - caption
    const captionResult = validateShortText(args.caption, MAX_CAPTION_LENGTH, 'Caption');
    const caption = requireValid(captionResult, args.caption);

    await ctx.db.patch(args.photoId, {
      caption: caption?.trim(),
      updatedAt: Date.now(),
    });
  },
});
