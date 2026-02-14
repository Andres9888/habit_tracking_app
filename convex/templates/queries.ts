/**
 * Template query functions
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { categoryValidator } from './types';

/**
 * Query: List all templates, optionally filtered by category
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

    return await ctx.db.query('templates').order('desc').collect();
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
 */
export const getPopular = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const templates = await ctx.db.query('templates').collect();

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
 */
export const getTemplateCount = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
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
 */
export const listTemplateNames = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    return templates.map((t) => ({
      category: t.category,
      createdAt: t.createdAt,
      name: t.name,
    }));
  },
});
