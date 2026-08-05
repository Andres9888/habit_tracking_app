/**
 * Filtered and computed template data hooks
 */

import { useMemo } from 'react';
import type { Doc } from '../../../convex/_generated/dataModel';
import type { Category, SortOption } from '../templates/constants';
import { getCategoryMeta } from './data/categoryMeta';
import { isHighRoiTemplate, isQuickTemplate } from './data/templateFilters';

function normalizeSearchValue(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase();
}

function getSearchableCategoryLabel(categoryId: string) {
  const fallback = categoryId.replaceAll('_', ' ');
  return `${fallback} ${getCategoryMeta(categoryId).label}`.trim();
}

export function useTemplatesByCategory(
  allTemplates: Doc<'templates'>[] | undefined
) {
  return useMemo(() => {
    if (!allTemplates) return new Map<string, Doc<'templates'>[]>();

    const grouped = new Map<string, Doc<'templates'>[]>();
    for (const template of allTemplates) {
      if (!template) continue;
      const category = template.category || 'uncategorized';
      const existing = grouped.get(category);
      if (existing) {
        existing.push(template);
      } else {
        grouped.set(category, [template]);
      }
    }

    for (const templates of grouped.values()) {
      templates.sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)
      );
    }

    return grouped;
  }, [allTemplates]);
}

export function useCategoryCounts(
  allTemplates: Doc<'templates'>[] | undefined
) {
  return useMemo(() => {
    if (!allTemplates) return {} as Record<Category, number>;
    const counts = {} as Record<Category, number>;
    for (const template of allTemplates) {
      counts.all = (counts.all || 0) + 1;
      counts[template.category as Category] =
        (counts[template.category as Category] || 0) + 1;
    }
    return counts;
  }, [allTemplates]);
}

export function useScienceCountsByCategory(
  allTemplates: Doc<'templates'>[] | undefined
) {
  return useMemo(() => {
    if (!allTemplates) return {} as Record<string, number>;
    const counts: Record<string, number> = {};
    for (const template of allTemplates) {
      if (template.scientificReference)
        counts[template.category] = (counts[template.category] || 0) + 1;
    }
    return counts;
  }, [allTemplates]);
}

export function useFilteredTemplates(
  allTemplates: Doc<'templates'>[] | undefined,
  selectedCategory: Category,
  searchQuery: string,
  sortOption: SortOption
) {
  return useMemo(() => {
    if (!allTemplates) return [];

    let data = [...allTemplates];
    if (selectedCategory === 'quick') {
      data = data.filter(isQuickTemplate);
    } else if (selectedCategory === 'high-roi') {
      data = data.filter(isHighRoiTemplate);
    } else if (selectedCategory !== 'all') {
      data = data.filter((t) => t.category === selectedCategory);
    }

    const safeSearchQuery = normalizeSearchValue(searchQuery);
    if (safeSearchQuery) {
      data = data.filter(
        (t) =>
          normalizeSearchValue(t.name).includes(safeSearchQuery) ||
          normalizeSearchValue(t.description).includes(safeSearchQuery) ||
          normalizeSearchValue(t.scientificReference).includes(
            safeSearchQuery
          ) ||
          normalizeSearchValue(t.frequency).includes(safeSearchQuery) ||
          normalizeSearchValue(getSearchableCategoryLabel(t.category)).includes(
            safeSearchQuery
          )
      );
    }

    const sorter: Record<
      SortOption,
      (a: Doc<'templates'>, b: Doc<'templates'>) => number
    > = {
      az: (a, b) => (a.name || '').localeCompare(b.name || ''),
      popular: (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0),
    };

    return data.sort(sorter[sortOption]);
  }, [allTemplates, selectedCategory, searchQuery, sortOption]);
}
