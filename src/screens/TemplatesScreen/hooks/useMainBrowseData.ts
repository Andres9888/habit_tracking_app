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

const POPULAR_LIMIT = 10;
const PREVIEW_EMOJI_LIMIT = 4;

interface UseMainBrowseDataOptions {
  allTemplates: Doc<'templates'>[] | undefined;
  isPremiumUser: boolean;
  userHabitCount: number;
}

export function useMainBrowseData({
  allTemplates,
  isPremiumUser,
  userHabitCount,
}: UseMainBrowseDataOptions) {
  const popularTemplates = useMemo(() => {
    if (!allTemplates) return [];
    return [...allTemplates]
      .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0))
      .slice(0, POPULAR_LIMIT);
  }, [allTemplates]);

  const categoryList = useMemo(() => {
    if (!allTemplates) return [];
    const ids = [...new Set(allTemplates.map((t) => t.category))].sort();
    return ids.map((id) => {
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
      return {
        ...meta,
        categoryId: id,
        count: catTemplates.length,
        previewEmojis,
      };
    });
  }, [allTemplates]);

  return {
    categoryList,
    isPremiumUser,
    popularTemplates,
    premiumPacks: PREMIUM_PACKS,
    userHabitCount,
  };
}
