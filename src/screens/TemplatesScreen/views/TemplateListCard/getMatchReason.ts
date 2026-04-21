import type { Doc } from '../../../../../convex/_generated/dataModel';

export function getMatchReason(
  template: Doc<'templates'>,
  searchQuery: string,
  getCategoryLabel: (categoryId: string) => string
): string | null {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return null;

  if ((template.name ?? '').toLowerCase().includes(query)) {
    return 'Match: title';
  }
  if ((template.description ?? '').toLowerCase().includes(query)) {
    return 'Match: description';
  }
  if ((template.scientificReference ?? '').toLowerCase().includes(query)) {
    return 'Match: research summary';
  }
  if (getCategoryLabel(template.category).toLowerCase().includes(query)) {
    return `Match: ${getCategoryLabel(template.category)} category`;
  }
  if ((template.frequency ?? '').toLowerCase().includes(query)) {
    return 'Match: frequency';
  }
  return 'Match: template details';
}
