/**
 * One-time migration: Reset all template popularityScore values
 * to reflect actual import counts from the templateUsage table.
 *
 * Run via Convex dashboard: templates:resetPopularity
 */
import { internalMutation } from '../_generated/server';

export const resetPopularity = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allTemplates = await ctx.db.query('templates').collect();
    const allUsage = await ctx.db.query('templateUsage').collect();

    // Count real imports per template
    const counts = new Map<string, number>();
    for (const usage of allUsage) {
      const key = usage.templateId as string;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    let updated = 0;
    for (const template of allTemplates) {
      const realCount = counts.get(template._id as string) ?? 0;
      if (template.popularityScore !== realCount) {
        await ctx.db.patch(template._id, { popularityScore: realCount });
        updated++;
      }
    }

    return { templatesTotal: allTemplates.length, updated };
  },
});
