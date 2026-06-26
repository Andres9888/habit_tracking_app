/**
 * Resolve a template from a deep-link slug derived from its name.
 * Slugs aren't stored; we scan the small templates table and match toSlug(name).
 * INTENTIONALLY PUBLIC — used by deep links before the library is open.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { toSlug } from './slug';

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .collect();
    return templates.find((t) => toSlug(t.name) === args.slug) ?? null;
  },
});
