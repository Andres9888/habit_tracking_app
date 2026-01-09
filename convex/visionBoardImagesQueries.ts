/**
 * Vision Board Images queries
 *
 * Read operations for vision board images.
 */

import { v } from 'convex/values';
import { query } from './_generated/server';
import {
  visionBoardImageObjectValidator,
  resolveImageUrls,
  resolveImageUrl,
} from './visionBoardImages/index';

/**
 * Get all images for a specific habit, ordered by display order
 */
export const listByHabit = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query('visionBoardImages')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    const sortedImages = images.sort((a, b) => a.order - b.order);
    return resolveImageUrls(ctx, sortedImages);
  },
  returns: v.array(visionBoardImageObjectValidator),
});

/**
 * Get a single image by ID with resolved URL
 */
export const get = query({
  args: { imageId: v.id('visionBoardImages') },
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) return null;
    return resolveImageUrl(ctx, image);
  },
  returns: v.union(v.null(), visionBoardImageObjectValidator),
});

/**
 * Count images for a habit (for limit checks)
 */
export const countByHabit = query({
  args: { habitId: v.id('habits') },
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

    return resolveImageUrls(ctx, images);
  },
  returns: v.array(visionBoardImageObjectValidator),
});

/**
 * Get recent images across all habits with resolved URLs
 */
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const images = await ctx.db
      .query('visionBoardImages')
      .order('desc')
      .take(limit);

    return resolveImageUrls(ctx, images);
  },
  returns: v.array(visionBoardImageObjectValidator),
});
