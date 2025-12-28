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

// Vision board image object validator for return types (with resolved URL)
const visionBoardImageObjectValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('visionBoardImages'),
  caption: v.optional(v.string()),
  createdAt: v.number(),
  habitId: v.id('habits'),
  imageUrl: v.union(v.string(), v.null()),
  order: v.number(),
  storageId: v.id('_storage'),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});

// Vision board image as stored in DB (no resolved URL)
const visionBoardImageDbValidator = v.object({
  _creationTime: v.number(),
  _id: v.id('visionBoardImages'),
  caption: v.optional(v.string()),
  createdAt: v.number(),
  habitId: v.id('habits'),
  imageUrl: v.optional(v.string()),
  order: v.number(),
  storageId: v.id('_storage'),
  updatedAt: v.optional(v.number()),
  userId: v.optional(v.string()),
});

// Maximum images per habit (4-image grid as per spec)
export const MAX_IMAGES_PER_HABIT = 4;

// Maximum caption length (200 characters)
const MAX_CAPTION_LENGTH = 200;

/**
 * Get all images for a specific habit, ordered by display order
 * Resolves storage IDs to URLs
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

    // Sort by order field and resolve URLs
    const sortedImages = images.sort((a, b) => a.order - b.order);

    // Resolve storage URLs for each image
    const imagesWithUrls = await Promise.all(
      sortedImages.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId);
        return {
          ...image,
          imageUrl: url,
        };
      })
    );

    return imagesWithUrls;
  },
  returns: v.array(visionBoardImageObjectValidator),
});

/**
 * Get a single image by ID with resolved URL
 */
export const get = query({
  args: {
    imageId: v.id('visionBoardImages'),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) return null;

    const url = await ctx.storage.getUrl(image.storageId);
    return {
      ...image,
      imageUrl: url,
    };
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
    // Validate that habit exists
    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    // Validate that storage file exists
    const fileMetadata = await ctx.db.system.get(args.storageId);
    if (!fileMetadata) {
      throw new Error('Storage file not found');
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
      order,
      storageId: args.storageId,
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
 * Delete an image from the vision board and storage
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

    // Delete the file from storage
    try {
      await ctx.storage.delete(image.storageId);
    } catch (error) {
      // File may already be deleted, continue with record deletion
      console.warn('Failed to delete storage file:', error);
    }

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
 * Get images by user (for user dashboard/profile) with resolved URLs
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

    const images = args.limit
      ? await query.take(args.limit)
      : await query.collect();

    // Resolve storage URLs for each image
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId);
        return {
          ...image,
          imageUrl: url,
        };
      })
    );

    return imagesWithUrls;
  },
  returns: v.array(visionBoardImageObjectValidator),
});

/**
 * Get recent images across all habits with resolved URLs
 */
export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const images = await ctx.db
      .query('visionBoardImages')
      .order('desc')
      .take(limit);

    // Resolve storage URLs for each image
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storageId);
        return {
          ...image,
          imageUrl: url,
        };
      })
    );

    return imagesWithUrls;
  },
  returns: v.array(visionBoardImageObjectValidator),
});
