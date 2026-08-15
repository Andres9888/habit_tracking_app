import { query } from '../_generated/server';

/** User-scoped template-to-habit targets for the library's Today action. */
export const getImportedTemplateHabits = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const usage = await ctx.db
      .query('templateUsage')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect();

    const seenTemplateIds = new Set<string>();
    const mappings = [];
    for (const row of usage) {
      if (!row.habitId || seenTemplateIds.has(row.templateId)) continue;
      seenTemplateIds.add(row.templateId);
      mappings.push({ habitId: row.habitId, templateId: row.templateId });
    }
    return mappings;
  },
});
