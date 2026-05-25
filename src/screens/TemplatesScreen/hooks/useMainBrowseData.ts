/**
 * Data aggregation hook for MainBrowseView
 *
 * Provides popular templates (sorted by popularity, top 10),
 * premium packs data, categories, and user state.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { PREMIUM_PACKS } from '../data/premiumPacks';
import type { CategoryMeta } from '../data/categoryMeta';
import { CATEGORY_META } from '../data/categoryMeta';
import { CATEGORY_PRIORITY, getCategoryPriority } from '../data/categoryPriority';
import { sortTemplatesByImportState } from '../utils/sortTemplatesByImportState';

const POPULAR_LIMIT = 10;
const PREVIEW_EMOJI_LIMIT = 4;
const QUICK_FILTER_IDS = CATEGORY_PRIORITY.slice(0, 7);

interface UseMainBrowseDataOptions {
  allTemplates: Doc<'templates'>[] | undefined;
  importedTemplateIds: Set<string>;
  isPremiumUser: boolean;
  userHabitCount: number;
}

export function useMainBrowseData({
  allTemplates,
  importedTemplateIds,
  isPremiumUser,
  userHabitCount,
}: UseMainBrowseDataOptions) {
  const popularTemplates = useMemo(() => {
    if (!allTemplates) return [];
    const sorted = [...allTemplates].sort(
      (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
    );
    return sortTemplatesByImportState(sorted, importedTemplateIds).slice(
      0,
      POPULAR_LIMIT
    );
  }, [allTemplates, importedTemplateIds]);

  const categoryList = useMemo(() => {
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
  }, [allTemplates]);

  const quickFilterCategories = useMemo(
    () =>
      QUICK_FILTER_IDS.filter((id) =>
        categoryList.some((category) => category.categoryId === id)
      ).map((id) => ({
        icon: CATEGORY_META[id].icon,
        id,
        label: CATEGORY_META[id].label,
      })),
    [categoryList]
  );

  return {
    categoryList,
    isPremiumUser,
    popularTemplates,
    premiumPacks: PREMIUM_PACKS,
    quickFilterCategories,
    userHabitCount,
  };
}
