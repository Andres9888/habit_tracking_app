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

// ─────────────────────────────────────────────────────────────────────────────
// Mutation exports
// ─────────────────────────────────────────────────────────────────────────────
export { importTemplate } from './templates/importTemplate';
export { clearTemplates, dedupeTemplates } from './templates/clearAndDedupe';
export { updateYoutubeLinks } from './templates/updateLinks';

// ─────────────────────────────────────────────────────────────────────────────
// Marketplace mutation exports
// ─────────────────────────────────────────────────────────────────────────────
export {
  rateTemplate,
  getUserTemplateRating,
  importMarketplaceTemplate,
} from './templates/marketplace';

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
  getFeaturedTemplates,
  getSeasonalTemplates,
  getAllSeasonalCollections,
  searchTemplates,
  getTemplatesByDifficulty,
  getTopRatedTemplates,
  getMarketplaceTemplates,
} from './templates/queries';

// ─────────────────────────────────────────────────────────────────────────────
// Seed mutation exports (data-heavy)
// ─────────────────────────────────────────────────────────────────────────────
export {
  seedAdditionalTemplates,
  seedNewScienceTemplates,
  seedScienceTemplates,
  seedTemplates,
  seedUniqueTemplates,
} from './templatesDataSeed';

// ─────────────────────────────────────────────────────────────────────────────
// Marketplace seed exports
// ─────────────────────────────────────────────────────────────────────────────
export { seedMarketplaceTemplates } from './templates/marketplaceSeed';
