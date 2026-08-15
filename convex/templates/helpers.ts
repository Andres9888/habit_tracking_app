/**
 * Template helper functions
 */
import type { MutationCtx } from '../_generated/server';
import type { TemplateInsert } from './types';
import { PRUNED_TEMPLATE_NAMES } from './curatedRemovals';
import { withPremiumFlag } from './premiumFlags';

/**
 * Insert a template if it doesn't already exist
 */
export const insertTemplateIfMissing = async (
  ctx: MutationCtx,
  template: TemplateInsert
) => {
  if (PRUNED_TEMPLATE_NAMES.has(normalizeTemplateName(template.name))) return;

  // `.withIndex`, not `.filter`: Convex's `.filter` scans every row it is
  // handed, so seeding the ~318-template catalog was quadratic (each insert
  // rescanned the whole growing table).
  const existing = await ctx.db
    .query('templates')
    .withIndex('by_name', (q) => q.eq('name', template.name))
    .first();

  const flagged = withPremiumFlag(template);
  if (existing) {
    if (existing.isPremium !== flagged.isPremium) {
      await ctx.db.patch(existing._id, { isPremium: flagged.isPremium });
    }
    return;
  }

  await ctx.db.insert('templates', flagged);
};

/**
 * Normalize template name for comparison
 */
export const normalizeTemplateName = (name: string) =>
  name.trim().toLowerCase();

/**
 * Template document type with Convex fields
 */
type TemplateDoc = {
  _creationTime: number;
  _id: unknown;
  createdAt: number;
  description: string;
  popularityScore?: number;
  scientificLink?: string;
  scientificReference: string;
};

/**
 * Pick the best template from duplicates based on scoring
 */
export const pickBestTemplate = <T extends TemplateDoc>(templates: T[]): T => {
  const scoreTemplate = (template: T) => {
    const hasScientificLinkScore = template.scientificLink ? 1000 : 0;
    const popularityScore = template.popularityScore ?? 0;
    const descriptionScore = Math.min(template.description.length, 500) / 10;
    const referenceScore = template.scientificReference ? 5 : 0;
    return (
      hasScientificLinkScore +
      popularityScore +
      descriptionScore +
      referenceScore
    );
  };

  let best = templates[0];
  for (const current of templates) {
    const bestScore = scoreTemplate(best);
    const currentScore = scoreTemplate(current);

    if (currentScore > bestScore) {
      best = current;
    } else if (currentScore === bestScore) {
      // Deterministic tie-breakers
      if (current.createdAt > best.createdAt) {
        best = current;
      } else if (
        current.createdAt === best.createdAt &&
        current._creationTime > best._creationTime
      ) {
        best = current;
      }
    }
  }

  return best;
};
