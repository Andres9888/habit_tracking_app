/**
 * Batch import count queries for library social proof.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';

/** Query: weekly import counts for a set of template IDs. */
export const getImportCounts = query({
  args: {
    sinceDays: v.optional(v.number()),
    templateIds: v.array(v.id('templates')),
  },
  handler: async (ctx, args) => {
    const sinceMs = Date.now() - (args.sinceDays ?? 7) * 24 * 60 * 60 * 1000;
    const counts: Record<string, number> = {};

    await Promise.all(
      args.templateIds.map(async (templateId) => {
        const usage = await ctx.db
          .query('templateUsage')
          .withIndex('by_template', (q) => q.eq('templateId', templateId))
          .collect();
        counts[templateId] = usage.filter(
          (entry) => entry.importedAt > sinceMs
        ).length;
      })
    );

    return counts;
  },
});
