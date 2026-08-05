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
  const { availableCategoryIds, categoryList, popularTemplates } = useMemo(() => {
    if (!allTemplates) {
      return {
        availableCategoryIds: new Set<string>(),
        categoryList: [],
        popularTemplates: [],
      };
    }

    const sortedByPopularity = [...allTemplates].sort(
      (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
    );
    const categoryAggregates = new Map<
      string,
      {
        count: number;
        meta: CategoryMeta;
        popularityScore: number;
        previewTemplates: Doc<'templates'>[];
      }
    >();

    for (const template of sortedByPopularity) {
      const id = template.category;
      const existing = categoryAggregates.get(id);
      if (existing) {
        existing.count += 1;
        existing.popularityScore += template.popularityScore ?? 0;
        if (existing.previewTemplates.length < PREVIEW_EMOJI_LIMIT) {
          existing.previewTemplates.push(template);
        }
        continue;
      }

      categoryAggregates.set(id, {
        count: 1,
        meta: CATEGORY_META[id] ?? {
          bgColor: '#F3F4F6',
          borderColor: '#E5E7EB',
          icon: '📌',
          isPremium: false,
          label: id,
          textColor: '#374151',
        },
        popularityScore: template.popularityScore ?? 0,
        previewTemplates: [template],
      });
    }

    const nextCategoryList = Array.from(categoryAggregates.entries())
      .map(([categoryId, aggregate]) => ({
        ...aggregate.meta,
        categoryId,
        count: aggregate.count,
        popularityScore: aggregate.popularityScore,
        previewEmojis: aggregate.previewTemplates.map((template) => template.icon),
      }))
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

    return {
      availableCategoryIds: new Set(categoryAggregates.keys()),
      categoryList: nextCategoryList,
      popularTemplates: sortTemplatesByImportState(
        sortedByPopularity,
        importedTemplateIds
      ).slice(0, POPULAR_LIMIT),
    };
  }, [allTemplates, importedTemplateIds]);

  const quickFilterCategories = useMemo(
    () =>
      QUICK_FILTER_IDS.filter((id) => availableCategoryIds.has(id)).map((id) => ({
        icon: CATEGORY_META[id].icon,
        id,
        label: CATEGORY_META[id].label,
      })),
    [availableCategoryIds]
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
