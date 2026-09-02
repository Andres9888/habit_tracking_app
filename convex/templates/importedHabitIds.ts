/**
 * Template → habit lookup for the current user's imports.
 *
 * Split out of queries.ts to keep that file inside the 100-line budget.
 */
import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { query } from '../_generated/server';

/**
 * `getImportedTemplateIds` deliberately keeps its bare `string[]` shape (it is
 * cached offline and several views depend on it), so the habit link lives in
 * this sibling query. Rows without a habitId (legacy usage records) are
 * skipped — there is nothing to focus for them.
 */
export const getImportedTemplateHabitIds = query({
  args: {},
  returns: v.array(
    v.object({ habitId: v.id('habits'), templateId: v.id('templates') })
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const usage = await ctx.db
      .query('templateUsage')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect();
    const pairs: { habitId: Id<'habits'>; templateId: Id<'templates'> }[] = [];
    for (const row of usage) {
      if (row.habitId) {
        pairs.push({ habitId: row.habitId, templateId: row.templateId });
      }
    }
    return pairs;
  },
});
