/**
 * Saved (bookmarked) library templates — read side.
 * Returns the current user's saves; empty when unauthenticated.
 */
import { query } from '../_generated/server';

export const getSavedTemplateIds = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const rows = await ctx.db
      .query('savedTemplates')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect();
    return rows.map((r) => r.templateId);
  },
});

export const listSavedTemplates = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const rows = await ctx.db
      .query('savedTemplates')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .order('desc')
      .collect();
    const templates = await Promise.all(rows.map((r) => ctx.db.get(r.templateId)));
    return templates.filter((t): t is NonNullable<typeof t> => t !== null);
  },
});
