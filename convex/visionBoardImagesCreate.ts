/**
 * Vision Board Images create mutation
 *
 * Create a new vision board image from storage ID.
 */

import { v } from 'convex/values';
import { mutation } from './_generated/server';
import {
  MAX_IMAGES_PER_HABIT,
  MAX_CAPTION_LENGTH,
} from './visionBoardImages/index';
import {
  validateShortText,
  requireValid,
} from './lib/inputValidation';
import { canAddVisionBoardImage, FREE_TIER_LIMITS } from './subscriptions/premiumCheck';

/**
 * Create a new vision board image from storage ID
 */
export const create = mutation({
  args: {
    caption: v.optional(v.string()),
    habitId: v.id('habits'),
    order: v.optional(v.number()),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to create vision board images');
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // SEC-001: Ownership verification
    if (habit.userId !== identity.subject) {
      throw new Error('Not authorized to add images to this habit');
    }

    // SEC-005: Premium gating - check if user can add more vision board images
    // Free tier: 4 images per habit, Premium: unlimited
    const visionBoardAccess = await canAddVisionBoardImage(
      ctx,
      identity.subject,
      args.habitId
    );
    if (!visionBoardAccess.allowed) {
      throw new Error(visionBoardAccess.reason ?? 'Vision board image limit reached');
    }

    const fileMetadata = await ctx.db.system.get(args.storageId);
    if (!fileMetadata) {
      throw new Error('Uploaded file not found');
    }

    // SEC-003: Input validation - caption
    const captionResult = validateShortText(args.caption, MAX_CAPTION_LENGTH, 'Caption');
    const caption = requireValid(captionResult, args.caption);

    const existingImages = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    let order = args.order;
    if (order === undefined) {
      let maxOrder = -1;
      for (const img of existingImages) {
        if (img.order > maxOrder) {
          maxOrder = img.order;
        }
      }
      order = maxOrder + 1;
    }

    if (order < 0 || order > MAX_IMAGES_PER_HABIT - 1) {
      throw new Error(
        `Order must be between 0 and ${MAX_IMAGES_PER_HABIT - 1}`
      );
    }

    return ctx.db.insert('visionBoardImages', {
      caption: caption?.trim(),
      createdAt: Date.now(),
      habitId: args.habitId,
      order,
      storageId: args.storageId,
      userId: identity.subject,
    });
  },
  returns: v.id('visionBoardImages'),
});
