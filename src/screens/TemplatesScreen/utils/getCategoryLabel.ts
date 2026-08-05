/**
 * Resolve a category id to a display label.
 */

interface CategoryLike {
  id: string;
  label: string;
}

export function getCategoryLabel(
  categoryId: string,
  categories?: CategoryLike[] | null
) {
  if (categoryId === 'quick') return 'Quick';
  if (categoryId === 'high-roi') return 'High ROI';
  return categories?.find((c) => c.id === categoryId)?.label || categoryId;
}
