/**
 * Template query functions
 * 
 * SEC-PUBLIC: All template queries are intentionally public.
 * Templates are a browsable library meant to be accessible before login
 * to encourage user onboarding. They contain no user data.
 */
import { v } from 'convex/values';
import { query } from '../_generated/server';
import { categoryValidator, difficultyValidator, seasonalCollectionValidator } from './types';

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

// ─────────────────────────────────────────────────────────────────────────────
// Marketplace Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Query: Get featured templates for the marketplace
 */
export const getFeaturedTemplates = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 8;
    
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_featured')
      .collect();

    return templates.filter(t => t.featured === true).slice(0, limit);
  },
});

/**
 * Query: Get templates by seasonal collection
 */
export const getSeasonalTemplates = query({
  args: {
    collection: seasonalCollectionValidator,
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_seasonal')
      .collect();

    return templates
      .filter(t => t.seasonalCollection === args.collection)
      .slice(0, limit);
  },
});

/**
 * Query: Get all seasonal collections with templates
 */
export const getAllSeasonalCollections = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_seasonal')
      .collect();

    // Group templates by seasonal collection
    const collections: Record<string, any[]> = {};
    for (const template of templates) {
      if (template.seasonalCollection) {
        if (!collections[template.seasonalCollection]) {
          collections[template.seasonalCollection] = [];
        }
        collections[template.seasonalCollection].push(template);
      }
    }

    return collections;
  },
});

/**
 * Query: Search templates by name, description, or keywords
 */
export const searchTemplates = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchQuery = args.query.toLowerCase().trim();
    
    if (!searchQuery) return [];

    const templates = await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .collect();

    return templates
      .filter(t => {
        const nameMatch = t.name.toLowerCase().includes(searchQuery);
        const descMatch = t.description.toLowerCase().includes(searchQuery);
        const categoryMatch = t.category.toLowerCase().includes(searchQuery);
        return nameMatch || descMatch || categoryMatch;
      })
      .slice(0, limit);
  },
});

/**
 * Query: Get templates by difficulty level
 */
export const getTemplatesByDifficulty = query({
  args: {
    difficulty: difficultyValidator,
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .collect();

    return templates
      .filter(t => t.difficulty === args.difficulty)
      .slice(0, limit);
  },
});

/**
 * Query: Get top-rated templates
 */
export const getTopRatedTemplates = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const templates = await ctx.db
      .query('templates')
      .withIndex('by_rating')
      .collect();

    return templates
      .filter(t => t.averageRating !== undefined && t.averageRating >= 4.0)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, limit);
  },
});

/**
 * Query: Get marketplace templates (templates with multiple habits)
 */
export const getMarketplaceTemplates = query({
  args: {
    category: v.optional(categoryValidator),
    difficulty: v.optional(difficultyValidator),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    let templates = await ctx.db
      .query('templates')
      .withIndex('by_createdAt')
      .collect();

    templates = templates.filter(t => t.isMarketplaceTemplate === true);

    if (args.category) {
      templates = templates.filter(t => t.category === args.category);
    }

    if (args.difficulty) {
      templates = templates.filter(t => t.difficulty === args.difficulty);
    }

    return templates.slice(0, limit);
  },
});
