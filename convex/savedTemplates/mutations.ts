/**
 * Saved (bookmarked) library templates — write side.
 * User-scoped; idempotent; mirrors the auth + dup-check shape of importTemplate.
 */
import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const saveTemplate = mutation({
  args: { templateId: v.id('templates') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to save templates');
    }
    const userId = identity.subject;
    const existing = await ctx.db
      .query('savedTemplates')
      .withIndex('by_user_template', (q) =>
        q.eq('userId', userId).eq('templateId', args.templateId)
      )
      .first();
    if (existing) return { alreadyExists: true, saved: true };
    await ctx.db.insert('savedTemplates', {
      savedAt: Date.now(),
      templateId: args.templateId,
      userId,
    });
    return { saved: true };
  },
});

export const unsaveTemplate = mutation({
  args: { templateId: v.id('templates') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Must be logged in to unsave templates');
    }
    const userId = identity.subject;
    const existing = await ctx.db
      .query('savedTemplates')
      .withIndex('by_user_template', (q) =>
        q.eq('userId', userId).eq('templateId', args.templateId)
      )
      .first();
    if (existing) await ctx.db.delete(existing._id);
    return { saved: false };
  },
});
