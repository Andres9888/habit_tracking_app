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
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const fileMetadata = await ctx.db.system.get(args.storageId);
    if (!fileMetadata) {
      throw new Error('Storage file not found');
    }

    if (args.caption && args.caption.length > MAX_CAPTION_LENGTH) {
      throw new Error(`Caption cannot exceed ${MAX_CAPTION_LENGTH} characters`);
    }

    const existingImages = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    if (existingImages.length >= MAX_IMAGES_PER_HABIT) {
      throw new Error(
        `Vision board is full. Maximum ${MAX_IMAGES_PER_HABIT} images allowed.`
      );
    }

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
      caption: args.caption?.trim(),
      createdAt: Date.now(),
      habitId: args.habitId,
      order,
      storageId: args.storageId,
    });
  },
  returns: v.id('visionBoardImages'),
});
