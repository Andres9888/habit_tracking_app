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
  const templateAggregates = useMemo(() => {
    if (!allTemplates) {
      return {
        categories: new Map<
          string,
          {
            count: number;
            popularityScore: number;
            previewTemplates: Doc<'templates'>[];
          }
        >(),
        popularTemplates: [] as Doc<'templates'>[],
      };
    }

    const categories = new Map<
      string,
      {
        count: number;
        popularityScore: number;
        previewTemplates: Doc<'templates'>[];
      }
    >();

    const popularTemplates = [...allTemplates].sort(
      (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
    );

    for (const template of popularTemplates) {
      const categoryId = template.category;
      const existing = categories.get(categoryId);

      if (existing) {
        existing.count += 1;
        existing.popularityScore += template.popularityScore ?? 0;
        if (existing.previewTemplates.length < PREVIEW_EMOJI_LIMIT) {
          existing.previewTemplates.push(template);
        }
        continue;
      }

      categories.set(categoryId, {
        count: 1,
        popularityScore: template.popularityScore ?? 0,
        previewTemplates: [template],
      });
    }

    return { categories, popularTemplates };
  }, [allTemplates]);

  const popularTemplates = useMemo(() => {
    return sortTemplatesByImportState(
      templateAggregates.popularTemplates,
      importedTemplateIds
    ).slice(
      0,
      POPULAR_LIMIT
    );
  }, [importedTemplateIds, templateAggregates.popularTemplates]);

  const categoryList = useMemo(() => {
    return [...templateAggregates.categories.entries()]
      .map(([id, aggregate]) => {
        const meta: CategoryMeta = CATEGORY_META[id] ?? {
          bgColor: '#F3F4F6',
          borderColor: '#E5E7EB',
          icon: '📌',
          isPremium: false,
          label: id,
          textColor: '#374151',
        };

        return {
          ...meta,
          categoryId: id,
          count: aggregate.count,
          popularityScore: aggregate.popularityScore,
          previewEmojis: aggregate.previewTemplates.map((t) => t.icon),
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
  }, [templateAggregates.categories]);

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
