/**
 * Template query functions
 *
 * Public queries for the habit template library.
 * Templates are publicly accessible (no auth required) as they contain
 * only curated, science-backed habit data.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { categoryValidator } from './types';

/**
 * List all templates, optionally filtered by category
 *
 * @param args.category - Optional category filter (e.g., 'morning_routine', 'health_fitness')
 * @returns Array of template objects, ordered by creation date (newest first)
 *
 * @example
 * ```typescript
 * // Get all templates
 * const allTemplates = await ctx.query(api.templates.list, {});
 *
 * // Get health & fitness templates
 * const healthTemplates = await ctx.query(api.templates.list, {
 *   category: 'health_fitness'
 * });
 * ```
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
 * Get a single template by ID
 *
 * @param args.id - The template document ID
 * @returns Template object or null if not found
 *
 * @example
 * ```typescript
 * const template = await ctx.query(api.templates.getById, {
 *   id: templateId
 * });
 * ```
 */
export const getById = query({
  args: { id: v.id('templates') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get popular templates sorted by popularity score
 *
 * Popularity scores are manually assigned based on usage data,
 * scientific backing, and user feedback. Higher scores appear first.
 *
 * @param args.limit - Maximum number of templates to return (default: 10)
 * @returns Array of popular templates, sorted by popularityScore descending
 *
 * @example
 * ```typescript
 * // Get top 5 most popular templates
 * const topTemplates = await ctx.query(api.templates.getPopular, {
 *   limit: 5
 * });
 * ```
 */
export const getPopular = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const templates = await ctx.db.query('templates').collect();

    // In-memory sort is more efficient than index on optional field
    // Template count is small (~200), so this performs well
    return templates
      .filter((t) => t.popularityScore !== undefined)
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
      .slice(0, limit);
  },
});

/**
 * Get usage statistics for a template
 *
 * Returns total import count and recent imports (last 7 days).
 * Used to track template popularity and engagement.
 *
 * @param args.templateId - The template ID to get stats for
 * @returns Object with totalImports and recentImports counts
 *
 * @example
 * ```typescript
 * const stats = await ctx.query(api.templates.getUsageStats, {
 *   templateId: templateId
 * });
 * console.log(`Total: ${stats.totalImports}, Recent: ${stats.recentImports}`);
 * ```
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
 * Check if templates exist and return count
 *
 * Used primarily for onboarding and seeding checks.
 * If count is 0, the app may trigger template seeding.
 *
 * @returns Object with count (number) and hasTemplates (boolean)
 *
 * @example
 * ```typescript
 * const { hasTemplates, count } = await ctx.query(
 *   api.templates.getTemplateCount, {}
 * );
 * if (!hasTemplates) {
 *   // Trigger seeding
 * }
 * ```
 */
export const getTemplateCount = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    return { count: templates.length, hasTemplates: templates.length > 0 };
  },
});

/**
 * List all template names (debugging utility)
 *
 * Returns minimal template info for debugging and verification.
 * Used during development and template seeding.
 *
 * @returns Array of objects with name, category, and createdAt
 *
 * @example
 * ```typescript
 * const names = await ctx.query(api.templates.listTemplateNames, {});
 * console.log(names.map(t => t.name));
 * ```
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
