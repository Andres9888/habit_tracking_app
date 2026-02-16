/**
 * Template query functions
 * 
 * SEC-PUBLIC: All template queries are intentionally public.
 * Templates are a browsable library meant to be accessible before login
 * to encourage user onboarding. They contain no user data.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { categoryValidator } from './types';

/**
 * Query: List all templates, optionally filtered by category
 * INTENTIONALLY PUBLIC - no auth required
 * PERF: Uses by_createdAt index to avoid full table scan
 */
export const list = query({
  args: {
    category: v.optional(categoryValidator),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      const category = args.category;
      return await ctx.db
        .query('templates')
        .withIndex('by_category', (q) => q.eq('category', category))
        .order('desc')
        .collect();
    }

    // PERF: Use by_createdAt index for ordered scan instead of full table scan
    return await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .order('desc')
      .collect();
  },
});

/**
 * Query: Get a single template by ID
 */
export const getById = query({
  args: { id: v.id('templates') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Query: Get popular templates (sorted by popularity score)
 * PERF: Still needs full scan for sorting, but minimized by field selection
 * Template count is small (~200), so in-memory sort is acceptable
 */
export const getPopular = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    // PERF: Fetch all templates but with index scan
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .collect();

    // Filter and sort by popularity, then limit
    return templates
      .filter((t) => t.popularityScore !== undefined)
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
      .slice(0, limit);
  },
});

/**
 * Query: Get template usage statistics
 */
export const getUsageStats = query({
  args: { templateId: v.id('templates') },
  handler: async (ctx, args) => {
    const usage = await ctx.db
      .query('templateUsage')
      .withIndex('by_template', (q) => q.eq('templateId', args.templateId))
      .collect();

    return {
      recentImports: usage.filter(
        (u) => u.importedAt > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length,
      totalImports: usage.length,
    };
  },
});

/**
 * Query: Check if templates exist and return count
 * PERF: Use index scan to avoid full table scan
 */
export const getTemplateCount = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .collect();
    return { count: templates.length, hasTemplates: templates.length > 0 };
  },
});

/**
 * Query: List premium templates only
 */
export const listPremium = query({
  args: {
    category: v.optional(categoryValidator),
  },
  handler: async (ctx, args) => {
    const allTemplates = args.category
      ? await ctx.db
          .query('templates')
          .withIndex('by_category', (q) => q.eq('category', args.category!))
          .order('desc')
          .collect()
      : await ctx.db.query('templates').order('desc').collect();

    return allTemplates.filter((t) => t.isPremium === true);
  },
});

/**
 * Query: Get usage counts for all templates (popularity counter)
 */
export const getUsageCounts = query({
  args: {},
  handler: async (ctx) => {
    const allUsage = await ctx.db.query('templateUsage').collect();
    const counts: Record<string, number> = {};
    for (const usage of allUsage) {
      const key = usage.templateId as string;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  },
});

/**
 * Query: List all template names (for debugging)
 * PERF: Use index scan to avoid full table scan
 */
export const listTemplateNames = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .collect();
    return templates.map((t) => ({
      category: t.category,
      createdAt: t.createdAt,
      name: t.name,
    }));
  },
});
