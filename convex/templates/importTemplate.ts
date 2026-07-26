/**
 * Template import mutation
 */
import { v } from 'convex/values';
import { internalMutation, mutation } from '../_generated/server';
import { progressEmojisValidator } from '../lib/progressEmojisValidator';
import { importTemplateHandler } from './importTemplateHandler';

/**
 * Mutation: Import a template to create a new habit
 */
export const importTemplate = mutation({
  args: {
    customizations: v.optional(
      v.object({
        daysOfWeek: v.optional(v.array(v.number())),
        icon: v.optional(v.string()),
        iconColor: v.optional(v.string()),
        name: v.optional(v.string()),
        preferredTime: v.optional(v.string()),
        progressEmojis: v.optional(progressEmojisValidator),
        reminderTime: v.optional(v.string()),
        streakGoal: v.optional(v.number()),
        strengthAlgorithm: v.optional(
          v.union(
            v.literal('forgiving'),
            v.literal('balanced'),
            v.literal('strict')
          )
        ),
      })
    ),
    templateId: v.id('templates'),
  },
  handler: async (ctx, args) => importTemplateHandler(ctx, args),
});

/**
 * Backfill existing imported habits with their source template growth type.
 * Run after `templatesDataSeed:backfillGrowthType` so templates are populated.
 */
export const backfillImportedHabitGrowthType = internalMutation({
  args: {},
  handler: async (ctx) => {
    const usages = await ctx.db.query('templateUsage').collect();
    let patchedCount = 0;
    const patchedHabitIds: string[] = [];

    for (const usage of usages) {
      if (!usage.habitId) continue;
      const habit = await ctx.db.get(usage.habitId);
      const template = await ctx.db.get(usage.templateId);
      if (!habit || !template?.growthType) continue;
      if (habit.growthType === template.growthType) continue;

      await ctx.db.patch(usage.habitId, { growthType: template.growthType });
      patchedCount++;
      patchedHabitIds.push(usage.habitId);
    }

    return {
      success: true,
      patchedCount,
      patchedHabitIds,
    };
  },
});
