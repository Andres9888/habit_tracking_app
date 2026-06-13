/**
 * Template helper functions
 */
import type { MutationCtx } from '../_generated/server';
import type { TemplateInsert } from './types';
import { PRUNED_TEMPLATE_NAMES } from './curatedRemovals';

/**
 * Insert a template if it doesn't already exist
 */
export const insertTemplateIfMissing = async (
  ctx: MutationCtx,
  template: TemplateInsert
) => {
  if (PRUNED_TEMPLATE_NAMES.has(normalizeTemplateName(template.name))) return;

  const existing = await ctx.db
    .query('templates')
    .filter((q) => q.eq(q.field('name'), template.name))
    .first();

  if (existing) return;

  await ctx.db.insert('templates', template);
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
