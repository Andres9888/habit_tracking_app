/**
 * Vision Board Images API
 * Photo grid of motivational images for habits
 *
 * Scientific Basis:
 * - Visual motivation reinforces goals through mental imagery
 * - Personal images > stock images for emotional connection (Brewer, 2018)
 * - Mirror neurons activate when viewing goal-related imagery
 * - Mental contrasting with visual cues improves goal pursuit (Oettingen, 2014)
 *
 * Business Model:
 * - Premium feature: storage costs, personalization, high perceived value
 * - Users pay for customization (Notion model)
 * - 4-image grid per habit, unlimited for premium users
 *
 * Story T12: Vision Board
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Vision board image object validator for return types
const visionBoardImageObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('visionBoardImages'),
  caption: v.optional(v.string()),
  createdAt: v.number(),
  habitId: v.id('habits'),
  imageUrl: v.string(),
  order: v.number(),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});

// Maximum images per habit (4-image grid as per spec)
export const MAX_IMAGES_PER_HABIT = 4;

// Maximum caption length (200 characters)
const MAX_CAPTION_LENGTH = 200;

/**
 * Get all images for a specific habit, ordered by display order
 */
export const listByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Sort by order field
    return images.sort((a, b) => a.order - b.order);
  },
  returns: v.array(visionBoardImageObjectValidator),
});

/**
 * Get a single image by ID
 */
export const get = query({
  args: {
    imageId: v.id('visionBoardImages'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.imageId);
  },
  returns: v.union(v.null(), visionBoardImageObjectValidator),
});

/**
 * Count images for a habit (for limit checks)
 */
export const countByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    return images.length;
  },
  returns: v.number(),
});

/**
 * Create a new vision board image
 */
export const create = mutation({
  args: {
    caption: v.optional(v.string()),
    habitId: v.id('habits'),
    imageUrl: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Validate that habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Validate imageUrl
    if (!args.imageUrl || args.imageUrl.trim() === '') {
      throw new Error('Image URL is required');
    }

    // Validate caption length
    if (args.caption && args.caption.length > MAX_CAPTION_LENGTH) {
      throw new Error(`Caption cannot exceed ${MAX_CAPTION_LENGTH} characters`);
    }

    // Get current images to check limit and determine order
    const existingImages = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Check if limit is reached
    if (existingImages.length >= MAX_IMAGES_PER_HABIT) {
      throw new Error(
        `Vision board is full. Maximum ${MAX_IMAGES_PER_HABIT} images allowed.`
      );
    }

    // Determine order - either use provided order or append to end
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

    // Validate order is within bounds
    if (order < 0 || order > MAX_IMAGES_PER_HABIT - 1) {
      throw new Error(
        `Order must be between 0 and ${MAX_IMAGES_PER_HABIT - 1}`
      );
    }

    const now = Date.now();

    return await ctx.db.insert('visionBoardImages', {
      caption: args.caption?.trim(),
      createdAt: now,
      habitId: args.habitId,
      imageUrl: args.imageUrl.trim(),
      order,
    });
  },
  returns: v.id('visionBoardImages'),
});

/**
 * Update an image's caption
 */
export const updateCaption = mutation({
  args: {
    caption: v.optional(v.string()),
    imageId: v.id('visionBoardImages'),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // Validate caption length
    if (args.caption && args.caption.length > MAX_CAPTION_LENGTH) {
      throw new Error(`Caption cannot exceed ${MAX_CAPTION_LENGTH} characters`);
    }

    await ctx.db.patch(args.imageId, {
      caption: args.caption?.trim(),
      updatedAt: Date.now(),
    });

    return args.imageId;
  },
  returns: v.id('visionBoardImages'),
});

/**
 * Reorder images in the grid
 * Accepts a new order array of image IDs
 */
export const reorder = mutation({
  args: {
    habitId: v.id('habits'),
    orderedImageIds: v.array(v.id('visionBoardImages')),
  },
  handler: async (ctx, args) => {
    // Validate all images exist and belong to this habit
    const existingImages = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    const existingIds = new Set(existingImages.map((img) => img._id));

    // Verify all provided IDs are valid
    for (const id of args.orderedImageIds) {
      if (!existingIds.has(id)) {
        throw new Error(`Image ${id} not found in this habit's vision board`);
      }
    }

    // Update order for each image
    const now = Date.now();
    for (let i = 0; i < args.orderedImageIds.length; i++) {
      await ctx.db.patch(args.orderedImageIds[i], {
        order: i,
        updatedAt: now,
      });
    }

    return null;
  },
  returns: v.null(),
});

/**
 * Delete an image from the vision board
 */
export const remove = mutation({
  args: {
    imageId: v.id('visionBoardImages'),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    // Note: The image file in storage should be deleted separately
    // via a scheduled job or file storage cleanup

    await ctx.db.delete(args.imageId);

    // Reorder remaining images to fill the gap
    const remainingImages = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', image.habitId))
      .collect();

    // Sort by current order and reassign sequential orders
    const sorted = remainingImages.sort((a, b) => a.order - b.order);
    const now = Date.now();
    for (const [i, element] of sorted.entries()) {
      if (element.order !== i) {
        await ctx.db.patch(element._id, {
          order: i,
          updatedAt: now,
        });
      }
    }

    return null;
  },
  returns: v.null(),
});

/**
 * Get images by user (for user dashboard/profile)
 */
export const listByUser = query({
  args: {
    limit: v.optional(v.number()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query('visionBoardImages')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc');

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
  returns: v.array(visionBoardImageObjectValidator),
});

/**
 * Get recent images across all habits
 */
export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db.query('visionBoardImages').order('desc').take(limit);
  },
  returns: v.array(visionBoardImageObjectValidator),
});
