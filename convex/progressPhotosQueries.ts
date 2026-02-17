/**
 * Progress Photos queries
 */

import { v } from 'convex/values';
import { query } from './_generated/server';

/**
 * Get all progress photos for a habit, sorted chronologically
 */
export const getByHabit = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    // SEC-001: Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify habit ownership
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) {
      return [];
    }

    // Fetch photos for this habit, sorted by creation date (oldest first)
    const photos = await ctx.db
      .query('progressPhotos')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    // Sort chronologically
    photos.sort((a, b) => a.createdAt - b.createdAt);

    // Get URLs for all photos
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const url = await ctx.storage.getUrl(photo.storageId);
        return {
          ...photo,
          imageUrl: url,
        };
      })
    );

    return photosWithUrls;
  },
});

/**
 * Get photo count for a habit
 */
export const getCount = query({
  args: {
    habitId: v.id('habits'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== identity.subject) {
      return 0;
    }

    const photos = await ctx.db
      .query('progressPhotos')
      .withIndex('by_habit', (q) => q.eq('habitId', args.habitId))
      .collect();

    return photos.length;
  },
});
