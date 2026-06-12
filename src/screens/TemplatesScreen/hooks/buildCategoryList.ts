/**
 * Pure builder for the browse category list: per-category counts,
 * preview emojis, and priority-aware ordering.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import type { CategoryMeta } from '../data/categoryMeta';
import { CATEGORY_META } from '../data/categoryMeta';
import { getCategoryPriority } from '../data/categoryPriority';

const PREVIEW_EMOJI_LIMIT = 4;

export function buildCategoryList(
  allTemplates: Doc<'templates'>[] | undefined
) {
  if (!allTemplates) return [];
  const ids = [...new Set(allTemplates.map((t) => t.category))].sort();
  return ids
    .map((id) => {
      const meta: CategoryMeta = CATEGORY_META[id] ?? {
        bgColor: '#F3F4F6',
        borderColor: '#E5E7EB',
        icon: '📌',
        isPremium: false,
        label: id,
        textColor: '#374151',
      };
      const catTemplates = allTemplates.filter((t) => t.category === id);
      const previewEmojis = [...catTemplates]
        .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0))
        .slice(0, PREVIEW_EMOJI_LIMIT)
        .map((t) => t.icon);
      const popularityScore = catTemplates.reduce(
        (sum, template) => sum + (template.popularityScore ?? 0),
        0
      );

      return {
        ...meta,
        categoryId: id,
        count: catTemplates.length,
        popularityScore,
        previewEmojis,
      };
    })
    .sort((a, b) => {
      const priorityDelta =
        getCategoryPriority(a.categoryId) - getCategoryPriority(b.categoryId);
      if (priorityDelta !== 0) return priorityDelta;
      if (b.popularityScore !== a.popularityScore) {
        return b.popularityScore - a.popularityScore;
      }
      return a.label.localeCompare(b.label);
    })
    .map(({ popularityScore: _popularityScore, ...category }) => category);
}
