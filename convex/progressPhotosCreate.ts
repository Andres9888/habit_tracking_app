/**
 * Progress Photos create mutation
 *
 * Create a new progress photo from storage ID.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import {
  FREE_TIER_PHOTO_LIMIT,
  MAX_CAPTION_LENGTH,
} from './progressPhotos/index';
import {
  validateShortText,
  requireValid,
} from './lib/inputValidation';
import { isUserPremium } from './subscriptions/premiumCheck';

/**
 * Create a new progress photo from storage ID
 */
export const create = mutation({
  args: {
    caption: v.optional(v.string()),
    habitId: v.id('habits'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to add progress photos');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to add photos to this habit');
    }

    // Premium check - Free tier: 5 photos per habit, Premium: unlimited
    const isPremium = await isUserPremium(ctx, identity.subject);
    const existingPhotos = await ctx.db
      .query('progressPhotos')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    if (!isPremium && existingPhotos.length >= FREE_TIER_PHOTO_LIMIT) {
      throw new Error(
        `Free tier limit reached. Upgrade to Premium for unlimited progress photos.`
      );
    }

    // Verify storage file exists
    const fileMetadata = await ctx.db.system.get(args.storageId);
    if (!fileMetadata) {
      throw new Error('Storage file not found');
    }

    // SEC-003: Input validation - caption
    const captionResult = validateShortText(args.caption, MAX_CAPTION_LENGTH, 'Caption');
    const caption = requireValid(captionResult, args.caption);

    return ctx.db.insert('progressPhotos', {
      caption: caption?.trim(),
      createdAt: Date.now(),
      habitId: args.habitId,
      storageId: args.storageId,
      userId: identity.subject,
    });
  },
  returns: v.id('progressPhotos'),
});
