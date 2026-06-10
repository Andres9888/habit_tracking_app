/**
 * Data aggregation hook for MainBrowseView
 *
 * Provides popular templates (sorted by popularity, top 10),
 * premium packs data, categories, and user state.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { PREMIUM_PACKS } from '../data/premiumPacks';
import { CATEGORY_META } from '../data/categoryMeta';
import { CATEGORY_PRIORITY } from '../data/categoryPriority';
import { sortTemplatesByImportState } from '../utils/sortTemplatesByImportState';
import { buildBrowseRowSections } from './buildBrowseRowSections';
import { buildCategoryList } from './buildCategoryList';

export type { BrowseRowSection } from './buildBrowseRowSections';

const POPULAR_LIMIT = 10;
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

  // Top pick for the "Start here" card — highest-popularity template the
  // user hasn't imported yet (popularTemplates already sorts non-imported
  // first, by popularity within each group).
  const featuredTemplate = popularTemplates[0] ?? null;

  const browseRowSections = useMemo(
    () =>
      buildBrowseRowSections({
        allTemplates,
        featuredTemplate,
        importedTemplateIds,
        popularTemplates,
      }),
    [allTemplates, featuredTemplate, importedTemplateIds, popularTemplates]
  );

  const categoryList = useMemo(
    () => buildCategoryList(allTemplates),
    [allTemplates]
  );

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
    browseRowSections,
    categoryList,
    featuredTemplate,
    isPremiumUser,
    popularTemplates,
    premiumPacks: PREMIUM_PACKS,
    quickFilterCategories,
    userHabitCount,
  };
}
