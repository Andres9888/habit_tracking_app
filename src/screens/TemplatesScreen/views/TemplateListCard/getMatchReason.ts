/**
 * Returns a human-readable reason why a template matched a search query.
 */

import type { Doc } from '../../../../../convex/_generated/dataModel';

export function getMatchReason(
  template: Doc<'templates'>,
  searchQuery: string,
  getCategoryLabel: (categoryId: string) => string
): string | null {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return null;

  if ((template.name ?? '').toLowerCase().includes(query)) {
    return 'Matches your search in the title';
  }

  if ((template.description ?? '').toLowerCase().includes(query)) {
    return 'Matches the habit description';
  }

  if ((template.scientificReference ?? '').toLowerCase().includes(query)) {
    return 'Matches the science summary';
  }

  if (getCategoryLabel(template.category).toLowerCase().includes(query)) {
    return `Related category: ${getCategoryLabel(template.category)}`;
  }

  if ((template.frequency ?? '').toLowerCase().includes(query)) {
    return 'Matches the suggested cadence';
  }

  return 'Related to your search';
}
