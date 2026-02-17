/**
 * Marketplace template mutations
 * Rating and full template import functionality
 */

import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';

/**
 * Mutation: Rate a template (1-5 stars)
 */
export const rateTemplate = mutation({
  args: {
    templateId: v.id('templates'),
    rating: v.number(), // 1-5
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { templateId, rating, userId } = args;

    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already rated this template
    const existingRatings = await ctx.db
      .query('templateRatings')
      .withIndex('by_user_and_template', (q) =>
        q.eq('userId', userId || '').eq('templateId', templateId)
      )
      .collect();

    // If user already rated, update their rating
    if (existingRatings.length > 0) {
      const existingRating = existingRatings[0];
      await ctx.db.patch(existingRating._id, {
        rating,
        updatedAt: Date.now(),
      });
    } else {
      // Create new rating
      await ctx.db.insert('templateRatings', {
        templateId,
        rating,
        userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Recalculate average rating for the template
    const allRatings = await ctx.db
      .query('templateRatings')
      .withIndex('by_template', (q) => q.eq('templateId', templateId))
      .collect();

    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allRatings.length;

    // Update template with new average rating
    await ctx.db.patch(templateId, {
      averageRating,
      ratingCount: allRatings.length,
    });

    return { success: true, averageRating, ratingCount: allRatings.length };
  },
});

/**
 * Query: Get user's rating for a template
 */
export const getUserTemplateRating = query({
  args: {
    templateId: v.id('templates'),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { templateId, userId } = args;

    if (!userId) return null;

    const ratings = await ctx.db
      .query('templateRatings')
      .withIndex('by_user_and_template', (q) =>
        q.eq('userId', userId).eq('templateId', templateId)
      )
      .collect();

    return ratings.length > 0 ? ratings[0].rating : null;
  },
});

/**
 * Mutation: Import a marketplace template with all its habits
 * Creates multiple habits from a single template
 */
export const importMarketplaceTemplate = mutation({
  args: {
    templateId: v.id('templates'),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { templateId, userId } = args;

    // Get the template
    const template = await ctx.db.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    if (!template.habits || template.habits.length === 0) {
      throw new Error('Template has no habits to import');
    }

    // Create each habit from the template
    const createdHabitIds: string[] = [];
    for (const habitTemplate of template.habits) {
      const habitId = await ctx.db.insert('habits', {
        name: habitTemplate.name,
        description: habitTemplate.description,
        frequency: habitTemplate.frequency,
        icon: habitTemplate.icon,
        iconColor: habitTemplate.iconColor,
        cueTime: habitTemplate.cueTime,
        cueLocation: habitTemplate.cueLocation,
        cueAfterBehavior: habitTemplate.cueAfterBehavior,
        identity: habitTemplate.identity,
        why: habitTemplate.why,
        userId,
        createdAt: Date.now(),
        strength: 0,
        strengthLevel: 'starting',
        currentStreak: 0,
        bestStreak: 0,
        consecutiveDays: 0,
        totalCompletions: 0,
        totalMisses: 0,
        habitDecayParam: 0.175,
        habitGainParam: 0.15,
        accessibility: 1.0,
        accessibilityDecayParam: 0.07,
        accessibilityGainBehavior: 0.15,
        accessibilityGainReminder: 0.1,
      });

      createdHabitIds.push(habitId);
    }

    // Track template usage
    await ctx.db.insert('templateUsage', {
      templateId,
      userId,
      importedAt: Date.now(),
    });

    return {
      success: true,
      habitCount: createdHabitIds.length,
      habitIds: createdHabitIds,
    };
  },
});
