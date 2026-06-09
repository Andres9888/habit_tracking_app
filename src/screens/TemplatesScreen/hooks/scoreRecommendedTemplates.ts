/**
 * Pure scoring for personalized template recommendations.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import { getCategoryMeta } from '../data/categoryMeta';
import {
  buildGapCategories,
  buildUserCategories,
  normalizeName,
} from './recommendationCategories';

export interface RecommendedTemplate {
  reason: string;
  template: Doc<'templates'>;
}

export interface ScoreRecommendedOptions {
  allTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  limit?: number;
  userHabitCount: number;
  userHabitNames: string[];
}

const AFFINITY_SCORE = 50;
const GAP_SCORE = 35;
const LIMIT_DEFAULT = 8;
const MIN_HABITS_FOR_RECOMMENDATIONS = 2;

function buildReason(
  template: Doc<'templates'>,
  userCategories: Set<string>,
  gapCategories: Set<string>
): string {
  const label = getCategoryMeta(template.category).label;
  if (userCategories.has(template.category)) {
    return `Because you track ${label}`;
  }
  if (gapCategories.has(template.category)) {
    return `Fills a gap: ${label}`;
  }
  return 'Popular in the library';
}

export function scoreRecommendedTemplates({
  allTemplates,
  importedTemplateIds,
  limit = LIMIT_DEFAULT,
  userHabitCount,
  userHabitNames,
}: ScoreRecommendedOptions): RecommendedTemplate[] {
  if (userHabitCount < MIN_HABITS_FOR_RECOMMENDATIONS) return [];

  const habitNames = new Set(userHabitNames.map((name) => normalizeName(name)));
  const userCategories = buildUserCategories(
    allTemplates,
    importedTemplateIds,
    userHabitNames
  );
  if (userCategories.size === 0) return [];

  const gapCategories = buildGapCategories(userCategories);

  return allTemplates
    .filter((template) => {
      if (importedTemplateIds.has(template._id)) return false;
      if (habitNames.has(normalizeName(template.name))) return false;
      return true;
    })
    .map((template) => {
      let score = template.popularityScore ?? 0;
      if (userCategories.has(template.category)) score += AFFINITY_SCORE;
      if (gapCategories.has(template.category)) score += GAP_SCORE;
      return {
        reason: buildReason(template, userCategories, gapCategories),
        score,
        template,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ reason, template }) => ({ reason, template }));
}
