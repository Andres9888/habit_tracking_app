import { internal } from './_generated/api';
import { mutation } from './_generated/server';

/**
 * Template Library Functions - Barrel Export
 * Phase 3 Feature: Science-backed habit templates
 *
 * This module has been decomposed into focused files:
 *
 * Core Logic (≤100 lines each):
 * - templates/types.ts: Type definitions and validators
 * - templates/helpers.ts: Utility functions
 * - templates/queries.ts: Read operations
 * - templates/importTemplate.ts: Template import mutation
 * - templates/clearAndDedupe.ts: Cleanup mutations
 * - templates/updateLinks.ts: YouTube link updates
 *
 * Seed Data (data-heavy, exception to 100-line rule):
 * - templatesDataSeed.ts: Contains 200+ embedded templates
 *
 * @see docs/DECOMPOSITION_PATTERNS.md for decomposition guidelines
 */

const requireAuthenticatedUser = async (
  ctx: { auth: { getUserIdentity: () => Promise<unknown> } },
  action: string
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error(`Unauthenticated: Must be logged in to ${action}`);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Query exports
// ─────────────────────────────────────────────────────────────────────────────
export {
  getById,
  getPopular,
  getTemplateCount,
  getUsageStats,
  list,
  listTemplateNames,
} from './templates/queries';

// ─────────────────────────────────────────────────────────────────────────────
// Mutation exports
// ─────────────────────────────────────────────────────────────────────────────
export { importTemplate } from './templates/importTemplate';
export { clearTemplates, dedupeTemplates } from './templates/clearAndDedupe';
export { updateYoutubeLinks } from './templates/updateLinks';

// ─────────────────────────────────────────────────────────────────────────────
// Seed mutation exports (data-heavy)
// ─────────────────────────────────────────────────────────────────────────────
export const seedTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx, 'seed templates');
    const existingTemplate = await ctx.db.query('templates').first();
    if (existingTemplate) return { queued: false };

    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedTemplates,
      {}
    );
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedAdditionalTemplates,
      {}
    );
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedNewScienceTemplates,
      {}
    );
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedScienceTemplates,
      {}
    );
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedUniqueTemplates,
      {}
    );
    return { queued: true };
  },
});

export const seedAdditionalTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx, 'seed additional templates');
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedAdditionalTemplates,
      {}
    );
    return null;
  },
});

export const seedNewScienceTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx, 'seed new science templates');
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedNewScienceTemplates,
      {}
    );
    return null;
  },
});

export const seedScienceTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx, 'seed science templates');
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedScienceTemplates,
      {}
    );
    return null;
  },
});

export const seedUniqueTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthenticatedUser(ctx, 'seed unique templates');
    await ctx.scheduler.runAfter(
      0,
      internal.templatesDataSeed.seedUniqueTemplates,
      {}
    );
    return null;
  },
});
